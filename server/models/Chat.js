const { Schema, Types, model } = require('mongoose');

const chatSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Chat = model('Chat', chatSchema);

module.exports = { Chat };
