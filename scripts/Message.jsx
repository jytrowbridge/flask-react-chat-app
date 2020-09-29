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
            ? <div className={timestampClass}>{this.props.time}</div>
            : null
          }
        </div>
      </div>
    );
  }
}