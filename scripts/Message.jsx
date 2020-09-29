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
    const timestampClass = this.props.delayShow ? 'timestamp delay-show' : 'timestamp' 
    
    const timestamp = new Date(this.props.time);
    const today = new Date();
    const timeOptions = {month: 'long', day: 'numeric' , hour: '2-digit', minute: '2-digit'};
    let formattedTime;
    if (timestamp.getFullYear() == today.getFullYear()
    && timestamp.getMonth() == today.getMonth()
    && timestamp.getDate() == today.getDate()) {
      const timeOptions = {hour: '2-digit', minute: '2-digit'};
      formattedTime = timestamp.toLocaleTimeString('en-us', timeOptions)
    } else {
      const timeOptions = {month: 'long', day: 'numeric' , hour: '2-digit', minute: '2-digit'};
      formattedTime = timestamp.toLocaleDateString('en-us', timeOptions)
    }

    return (
      <div className={msgWrapperOuterClass}>
        <div className={msgWrapperInnerClass}>
          {this.props.renderName
            ? <div className="username">{this.props.user_name}</div>
            : null
          }
          <div className={msgClass}>
            {this.props.message}
          </div>
          {this.props.renderTime
            ? <div className={timestampClass}>{formattedTime}</div>
            : null
          }
        </div>
      </div>
    );
  }
}