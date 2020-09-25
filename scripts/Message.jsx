import * as React from 'react';
import { getCookie } from './getCookie'

export class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const className = 'message ' + 
      (getCookie('user_id') == this.props.user_id ? 'selfMsg' : 'otherMsg');
    
    return (
      // <div className="message" data-user-id={this.props.user_id}>
      <div className={className}>
        {this.props.message}
      </div>
    );
  }
}