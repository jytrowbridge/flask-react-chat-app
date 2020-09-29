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

      const prevMessageInd = messages.length - 1;
      let unixTimestamp = new Date().getTime();


      data['renderName'] = true;
      data['renderTime'] = true;

      if (prevMessageInd >= 0) {
        if (messages[prevMessageInd]['user_id'] == data['user_id'] 
           && (unixTimestamp - messages[prevMessageInd]['time'] < 30000)) {
             console.log('setting should be false')
          messages[prevMessageInd]['renderTime'] = false;
          data['renderName'] = false;
        }
      }

      data['time'] = unixTimestamp;
      messages.push(data);
      this.setState({
        'messages': messages
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

    let prevUserID;
    let prevTime = 0;
    messages.forEach((message, index) => {
      messageBlocks.push(
       <Message 
          message={message['message']} 
          key={uuidv4()}
          user_id={message['user_id']}
          user_name={message['user_name']}
          time={message['time']}
          renderName={message['renderName']}
          renderTime={message['renderTime']}
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
