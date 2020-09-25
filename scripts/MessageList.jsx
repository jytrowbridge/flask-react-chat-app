
import * as React from 'react';

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
      console.log('new received ' + data['message']);
      let messages = this.state.messages;
      messages.push(data['message']);
      this.setState({
        'message': messages
      })
    })
  }


  render() {
    let messages = this.state.messages;

    let messageBlocks = [];

    messages.forEach(message =>{
      messageBlocks.push(
       <Message 
          message={message} 
          key={message}
        />
      );
    })

    return (
      <div id="message-list">
        {messageBlocks}
      </div>
    );
  }
}
