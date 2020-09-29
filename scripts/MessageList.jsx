import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from './Socket';
import { Message } from './Message';

export class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'messages': []
    };
  }

  componentDidMount() {
    Socket.on('message received', (data) => {
      let messages = this.state.messages;
      let unixTimestamp = new Date().getTime();
      data['time'] = unixTimestamp;
      messages.push(data);
      this.setState({
        'messages': messages // wait this should be messages?...
      })
    });

    Socket.on('change username', (data) => {

      console.log('change username notice received at message list level')

      let user_id = data['user_id'];
      let user_name = data['user_name'];
      let messages = this.state.messages;
      let updated_messages = messages.map(message => {
        if (message['user_id'] == user_id) {
          message['user_name'] = user_name;
        } 
        return message;
      });

      console.log(messages);

      this.setState({
        'messages': updated_messages
      });
    });
  }

  render() {
    let messages = this.state.messages;

    let messageBlocks = [];

    let prevUsername = '';
    let prevTime = 0;
    messages.forEach(message =>{
      
      // maybe should stick this in the socket reception
      let renderNameAndTime = true;
      if (prevUsername == message['user_name']) {
        if (message['time'] - prevTime < 30000) {
          // Hide username/time if same user sends multiple messages in a row, and messages were sent within 30 seconds
          renderNameAndTime = false;
        }
      }
      prevUsername = message['user_name'];
      prevTime = message['time'];

      messageBlocks.push(
       <Message 
          message={message['message']} 
          key={uuidv4()}
          user_id={message['user_id']}
          user_name={message['user_name']}
          time={message['time']}
          renderNameAndTime={renderNameAndTime}
        />
      );
    })

    const placeholder = <div id='chat-placeholder'>No chats yet :( Say something interesting!</div>

    const content = messages.length > 0 ? messageBlocks : placeholder;

    return (
      <div id="message-list">
        {content}
      </div>
    );
  }
}
