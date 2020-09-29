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
        messages[prevMessageInd]['delayShow'] = false;
        if (messages[prevMessageInd]['user_id'] == data['user_id'] 
           && (unixTimestamp - messages[prevMessageInd]['time'] < 30000)) {
             console.log('setting should be false')
          // if message user different than previous, or time since last message > 30 secs, render name
          // if message user different than next, or time since last message > 30 secs, render time
          messages[prevMessageInd]['renderTime'] = false;
          data['renderName'] = false;
        }
      }

      data['time'] = unixTimestamp;
      data['delayShow'] = true;
      messages.push(data);
      
      this.setState({
        'messages': messages
      });

      // Set timer to remove 'hidden' from timestamp after 3 seconds
      const timeDivs = document.querySelectorAll('.timestamp')
      let timer = setTimeout(() => {
        timeDivs[timeDivs.length - 1].classList.remove('delay-show');
      }, 1000);

    });

    Socket.on('change username', (data) => {

      let user_id = data['user_id'];
      let user_name = data['user_name'];
      let messages = this.state.messages;
      let updated_messages = messages.map(message => {
        if (message['user_id'] == user_id) {
          message['user_name'] = user_name;
        } if (message['delayShow']) {
          message['delayShow'] = false;
        }
        return message;
      });

      this.setState({
        'messages': updated_messages
      });
    });
  }

  render() {
    let messages = this.state.messages;
    let messageBlocks = [];
    messages.forEach(message => {
      messageBlocks.push(
       <Message 
          message={message['message']} 
          key={uuidv4()}
          user_id={message['user_id']}
          user_name={message['user_name']}
          time={message['time']}
          renderName={message['renderName']}
          renderTime={message['renderTime']}
          delayShow={message['delayShow']}
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
