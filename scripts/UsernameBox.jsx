import * as React from 'react';
import { Socket } from './Socket';
import { getCookie } from './getCookie'

export class UsernameBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''}
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let old_username = getCookie('user_name')
    console.log('updated username cookie')
    document.cookie = `user_name=${this.state.value}`
    Socket.emit('update_username', {
      'user_name': this.state.value,
      'user_id': getCookie('user_id')
    });
    console.log(`Sent update for user ${old_username}, changed username to ${this.state.value}`);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="submit"
          value="Update!"
        />
      </form>
    )
  }
}