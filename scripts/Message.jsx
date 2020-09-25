import * as React from 'react';
import { getCookie } from './getCookie'

export class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const msgSenderClass = (getCookie('user_id') == this.props.user_id ? 'self-message' : 'other-message');
    const msgClass = 'message ' + msgSenderClass;
    const msgWrapperClass = 'message-wrapper ' + msgSenderClass;
    
    return (
      // <div className="message" data-user-id={this.props.user_id}>
      <div className={msgWrapperClass}>
        <div className={msgClass}>
          {this.props.message}
        </div>
      </div>
    );
  }
}