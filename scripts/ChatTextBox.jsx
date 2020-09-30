import * as React from 'react';
import { Socket } from './Socket';
import { getCookie } from './getCookie'
import { submitOnEnter } from './submitOnEnter'

export class ChatTextBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    Socket.emit('send:message', {
      'message': this.state.value,
      'user_id': getCookie('user_id'),
      'user_name': getCookie('user_name')
    });
    console.log('sent message ' + this.state.value + ' to server')
    this.setState({
      value: ''
    })
  }

  componentDidMount() {
    const inputTextArea = document.getElementById('input-text');
    inputTextArea.addEventListener('keypress', submitOnEnter);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} id="input-form">
        <input
          autoFocus="true"
          type="text"
          value={this.state.value} 
          onChange={this.handleChange}  
          id="input-text"
          placeholder="Type a message!" // need to update so this disappears after click/first message
        />
      </form>
    )
  }
}