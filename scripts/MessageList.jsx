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

      if (prevMessageInd > 0) {
        if (messages[prevMessageInd]['user_id'] == data['user_id'] 
           && unixTimeStamp - messages['time'] < 30000) {
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
      
      /*
        when to render time:
          when the next user is different
          else
            when the previous message was > 30 seconds ago
          aka, don't render when:
            previous user same, and last message < 30 seconds ago
          
          when to render name:
          when the *previous* user is different
          else
            when the previous message was > 30 seconds ago
          aka, don't render when:
            next user the same, and last message < 30 seconds ago

        This should be added to above so it doesn't have to calculate each time
      */

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
