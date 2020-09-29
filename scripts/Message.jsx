import * as React from 'react';
import { getCookie } from './getCookie'

export class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const msgSenderClass = (getCookie('user_id') == this.props.user_id ? 'self-message' : 'other-message');
    const msgClass = 'message ' + msgSenderClass;
    const msgWrapperOuterClass = 'message-wrapper__outer ' + msgSenderClass;
    const msgWrapperInnerClass = 'message-wrapper__inner ' + msgSenderClass;
    
    return (
      // <div className="message" data-user-id={this.props.user_id}>
      <div className={msgWrapperOuterClass}>
        <div className={msgWrapperInnerClass}>
          <div className={msgClass}>
            {this.props.message}
          </div>
          <div className="username">
            {this.props.user_name}
          </div>
        </div>
      </div>
    );
  }
}