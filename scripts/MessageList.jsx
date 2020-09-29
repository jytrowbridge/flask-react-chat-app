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

  handleConnection(data, type) {
    const userName = data['user_name'];
    let messages = this.state.messages;
    const msgType = type == 'connected' ? 'userConnect' : 'userDisconnect'
    messages.push({
      'type': msgType,
      'user_name': userName
    });

    this.setState({
      'messages': messages
    })
  }

  componentDidMount() {
    Socket.on('message received', (data) => {
      let messages = this.state.messages;
      const prevMessageInd = messages.length - 1;
      let unixTimestamp = new Date().getTime();
      data['renderName'] = true;
      data['renderTime'] = true;
      data['type'] = 'message';
      
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

      updated_messages.push({
        'type': 'usernameUpdate',
        'user_name': data['user_name'],
        'old_user_name': data['old_user_name']
      }); 

      this.setState({
        'messages': updated_messages
      });
    });

    Socket.on('connected', (data) =>{
      this.handleConnection(data, 'connected');
    });

    Socket.on('disconnected', (data) =>{
      this.handleConnection(data, 'disconnected');
    });
  }

  
  render() {
    let messages = this.state.messages;
    let messageBlocks = [];
    let messagesExist = false;
    messages.forEach(message => {
      if (message['type'] == 'message') {
        messagesExist = true;
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
      } else if (message['type'] == 'userConnect' || message['type'] == 'userDisconnect') {
        const connected = message['type'] == 'userConnect';
        messageBlocks.push(
          <div className="meta-message" key={uuidv4()}>
            {message['user_name']} {connected ? 'joined the chat!' : 'left the chat :('}
          </div>
        )
      } else if (message['type'] == 'usernameUpdate') {
        messageBlocks.push(
          <div className="meta-message" key={uuidv4()}>
            {message['old_user_name']} changed their name to {message['user_name']}
          </div>
        )
      }
    })

    const placeholder = <div id='chat-placeholder'>No chats yet :( Say something interesting!</div>
    console.log(messagesExist)
    return (
      <div id="message-list">
        {messagesExist
        ? null
        : placeholder
        }
        {messageBlocks}
      </div>
    );
  }
}
