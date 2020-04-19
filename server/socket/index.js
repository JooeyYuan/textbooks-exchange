const _ = require('lodash');
const { Chat } = require('../models/Chat');
const { User } = require('../models/User');
const { objectIdToString } = require('../utils');

module.exports = (io, socket) => {
  const currentUserId = socket.handshake.query.userId;

  socket.on('sendMsg', async (msg, cb) => {
    try {
      let message = await Chat.create(msg);
      message = await message.populate(['sender', 'recipient']).execPopulate();
      cb(message);
      socket.broadcast.emit('receiveMsg', message);
    } catch (err) {
      //console.log('error sending message', err);
    }
  });

  socket.on('readRecipientMsgs', async (users, cb) => {
    try {
      const loggedInUser = users.find((u) => u === currentUserId);
      let recipient = users.find((u) => u !== loggedInUser);

      let roomMessages = await Chat.find({
        $or: [
          { recipient: loggedInUser, sender: recipient },
          { sender: loggedInUser, recipient },
        ],
      }).populate(['sender', 'recipient']);

      roomMessages = _.uniqBy(roomMessages, '_id');
      cb(roomMessages);
      const roomMessagesPromises = [...roomMessages]
        .filter((m) => m.recipient._id.toString() === currentUserId)
        .map((m) => {
          m.read = true;
          return m.save();
        });
      await Promise.all(roomMessagesPromises);
    } catch (err) {
      console.log('error reading recipient messages', err);
    }
  });

  socket.on('getRecipientsList', async (cb) => {
    try {
      let messages = await Chat.find({
        $or: [{ sender: currentUserId }, { recipient: currentUserId }],
      }).lean();
      messages = objectIdToString(messages, ['sender', 'recipient']);

      messages = _.uniqBy(messages, '_id');

      let recipients = _.uniq(
        messages.map((m) =>
          [m.sender, m.recipient].find((i) => i !== currentUserId)
        )
      );

      recipients = recipients.filter((r) => r);
      if (
        messages.find(
          (m) => m.sender === currentUserId && m.recipient === currentUserId
        )
      ) {
        recipients.push(currentUserId);
      }

      const recipientsPromises = recipients.map((r) => {
        return new Promise(async (resolve) => {
          try {
            const { fullname } = await User.findOne({ _id: r }).lean();
            const room = [r, currentUserId].sort().join('|');
            const unread = messages.filter(
              (m) => m.sender == r && m.recipient == currentUserId && !m.read
            ).length;
            socket.join(room, () => {
              resolve({ fullname, _id: r, unread });
            });
          } catch (err) {
            resolve(null)
          }
        });
      });

      const recips = await Promise.all(recipientsPromises);
      cb(recips.filter(r => r));
    } catch (err) {
      console.log('error sending message', err);
    }
  });

  socket.on('deleteUserChats', ({ recipientId }, cb) => {
    Chat.deleteMany({
      $or: [
        { sender: currentUserId, recipient: recipientId },
        { sender: recipientId, recipient: currentUserId },
      ],
    })
      .then(() => {
        cb();
      })
      .catch((err) => console.log('err fetching msgs', err));
  });
};
