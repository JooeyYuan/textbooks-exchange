import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import {
  MessageOutlined,
  StopOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { capitalizeFirstLetter } from '../../utils';
import './ChatsPage.css';

class ChatsPage extends Component {
  state = {
    showModal: false,
    recipients: [],
    activeRecipient: null,
    selectedRecipientMessages: [],
  };

  componentDidMount() {
    this.currentUserId = localStorage.getItem('userId');
    this.socket = io('http://localhost:5000', {
      query: { userId: this.currentUserId },
    });

    this.socket.emit('getRecipientsList', (recipients) => { // fetch current User's recipient list
      const { location } = this.props;
      const recipient = location.state?.seller;
      if (recipient) { // if coming from a product page
        const { _id, fullname } = recipient;
        if (recipients.find((r) => r._id === _id)) {
          this.setState({ recipients }, () => this.readMessages(_id));
        } else {
          const newRecipient = { _id, fullname, unread: 0, newChat: true };
          this.setState({
            activeRecipient: newRecipient,
            recipients: recipients.concat(newRecipient),
          });
        }
      } else { // if coming from the menu bar
        this.setState({ recipients });
      }
    });

    this.socket.on('receiveMsg', (msg) => {
      const { recipient, sender } = msg;
      const {
        activeRecipient,
        selectedRecipientMessages,
        recipients,
      } = this.state;
      if (recipient._id === this.currentUserId) { // checks if someone sent you a message
        const foundRecipient = recipients.find((r) => r._id === sender._id);
        if (activeRecipient?._id === sender._id) {  // is it the person I'm currently chatting with?
          this.setState({
            selectedRecipientMessages: selectedRecipientMessages.concat(msg),
          });
        } else if (foundRecipient) { // checks if the recipient in your list already
          foundRecipient.unread += 1;
          this.setState({ recipients });
        } else { // if a new recipient, add to the list
          const newRecipient = {
            _id: sender._id,
            fullname: sender.fullname,
            unread: 1,
          };
          this.setState({ recipients: recipients.concat(newRecipient) });
        }
      }
    });
  }

  toggleModal = () =>
    this.setState((prevState) => ({ showModal: !prevState.showModal }));

  handleInputChange = (e) => this.setState({ [e.target.id]: e.target.value });

  submitChatMessage = () => {
    const {
      activeRecipient,
      chatMessage,
      selectedRecipientMessages,
    } = this.state;
    const {
      user: { userData },
    } = this.props;
    this.socket.emit(
      'sendMsg',
      {
        message: chatMessage,
        sender: userData._id,
        type: 'text',
        recipient: activeRecipient._id,
      },
      (newMsg) => {
        this.setState({
          selectedRecipientMessages: selectedRecipientMessages.concat(newMsg),
          chatMessage: '',
        });
      }
    );
  };

  readMessages = (recipientId) => {
    const { recipients } = this.state;
    const activeRecipient = recipients.find((r) => r._id === recipientId);
    if (activeRecipient) {
      this.setState({ activeRecipient, selectedRecipientMessages: [] }, () => {
        const users = [this.currentUserId, activeRecipient._id];
        this.socket.emit('readRecipientMsgs', users, (msgs) => {
          activeRecipient.unread = 0;
          this.setState({ selectedRecipientMessages: msgs, recipients });
        });
      });
    }
  };

  deleteMessages = (recipientId) => {
    const { recipients } = this.state;
    const activeRecipient = recipients.find((r) => r._id === recipientId);
    if (activeRecipient) {
      this.socket.emit('deleteUserChats', { recipientId }, () => {
        this.setState({
          recipients: recipients.filter((r) => r._id !== recipientId),
          selectedRecipientMessages: [],
          activeRecipient: null,
        });
      });
    }
  };

  render() {
    const {
      chatMessage,
      recipients,
      selectedRecipientMessages,
      activeRecipient,
    } = this.state;
    return (
      <div id='home-bg'>
        <div style={{ maxWidth: '1000px', margin: '75px auto' }}>
          <Row>
            <Col span={24}>
              <div style={{ textAlign: 'center' }}>
                <h1>Messages</h1>
              </div>
            </Col>
            <div className='wholeView'>
              <div className='leftBar'>
                <Col style={{ borderBlockWidth: '2px' }} >
                  <div className='recipients'> 
                    <h2>Recipients</h2>
                  </div>
                  {recipients.map((recipient, i) => (
                    <div className='recipientList' key={i} onClick={() => this.readMessages(recipient._id)}>
                      <h3>
                        {!recipient.newChat && (
                          <StopOutlined
                            onClick={() => this.deleteMessages(recipient._id)}
                          />
                        )}{' '}
                        -{' '}
                        <span className='black'>
                          {capitalizeFirstLetter(recipient.fullname)}
                        </span>
                        {recipient.unread ? ` - ${recipient.unread} New` : ''}
                      </h3>
                    </div>
                  ))}
                </Col>
              </div>
              <div className='rightBar'>
                <Col>
                  <Row>
                    <Col>
                      <div className='messagesView'>
                        {selectedRecipientMessages.map((m, i) => (
                          <div  className='messagesSender' key={i}>
                            {capitalizeFirstLetter(m.sender.fullname)}
                            {' - '}
                            <span className= 'messagesDate'>
                              {moment(m.createdAt).format('MMMM Do YYYY, h:mm a')}:
                            </span>{' '}{"\n"}
                            <span className='messagesContent'
                              dangerouslySetInnerHTML={{ __html: m.message }}
                            ></span>
                          </div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Col>
                </div>
            </div>
            <div className='inputWhole'>
              <div className='inputLine'>
                {activeRecipient && (
                  <Form  onFinish={this.submitChatMessage}>
                      <Input
                        style={{ width: '650px'}}
                        id='chatMessage'
                        prefix={
                          <MessageOutlined
                            style={{ color: 'rgba(255,0,0,0.6)' }}
                          />
                        }
                        placeholder='Type your message'
                        type='text'
                        value={chatMessage}
                        onChange={this.handleInputChange}
                        required
                      />
                      <Button type='secondary' size='medium' htmlType='submit'>
                        <RollbackOutlined />
                      </Button>
                  </Form>
                )}
              </div>
            </div>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  chats: state.chat.chats,
});

const mapActionsToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapActionsToProps)(ChatsPage);
