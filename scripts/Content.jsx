    
import * as React from 'react';

import { Button } from './Button';
import { Socket } from './Socket';
import { MessageList } from './MessageList';
import { ChatTextBox } from './ChatTextBox'

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'numbers': []
        };
    }
    
    componentDidMount() {
        Socket.on('send:message', (data) => {
            // this.setState({
            //     'number_received': data['number']
            // });
            console.log('aaaaa')
        })
    }

    render() {
        let my_rand_num = this.state.number_received
        return (
            <div id="chat-wrapper">
                {/* <h1>Random number!</h1>
                <ul>{my_rand_num}</ul>
                <Button /> */}
                <MessageList />
                <ChatTextBox /> 
            </div>
        );
    }
}
