import * as React from 'react';

export class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="message">
        {this.props.message}
      </div>
    );
  }
}