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
      console.log('new message received ' + data);
      let messages = this.state.messages;
      messages.push(data);
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
          message={message['message']} 
          key={uuidv4()}
          user_id={message['user_id']}
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
