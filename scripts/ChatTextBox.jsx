import * as React from 'react';
import { Socket } from './Socket';
import { getCookie } from './getCookie'

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
      'user_id': getCookie('user_id')
    });
    console.log('sent message ' + this.state.value + ' to server')
    this.setState({
      value: ''
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" 
          value={this.state.value} 
          onChange={this.handleChange}  
        />
      </form>
    )
  }
}