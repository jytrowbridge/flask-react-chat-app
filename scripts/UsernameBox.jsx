import * as React from 'react';
import { Socket } from './Socket';
import { getCookie } from './getCookie'

export class UsernameBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: getCookie('user_name')}
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let old_username = getCookie('user_name')
    console.log('updated username cookie')
    document.cookie = `user_name=${this.state.value}`
    Socket.emit('update_username', {
      'user_name': this.state.value,
      'old_user_name': old_username,
      'user_id': getCookie('user_id')
    });
    this.handleClick();
    console.log(`Sent update for user ${old_username}, changed username to ${this.state.value}`);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleClick() {
    const usernameForm = document.getElementById('username-form');
    const usernameInput = document.getElementById('username-input');
    const inputText = document.getElementById('input-text');
    if (usernameForm.classList.contains('max-width')) {
      usernameForm.classList.remove('max-width')
      usernameInput.classList.remove('edit');
      inputText.focus();
    } else { 
      usernameForm.classList.add('max-width')
      usernameInput.classList.add('edit');
      usernameInput.focus();
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} id="username-form">
        <div id="username-box">
          <div id="username-gear" onClick={this.handleClick}>
            &#x2699;
          </div>
          <input type="text"
            value={this.state.value}
            onChange={this.handleChange}
            id="username-input"
          />
          <input type="submit" //className="hidden"
            value="Update!"
            id="username-button"
          />
        </div>
      </form>
    )
  }
}