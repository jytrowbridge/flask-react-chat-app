    
import * as React from 'react';

import { Socket } from './Socket';
import { MessageList } from './MessageList';
import { ChatTextBox } from './ChatTextBox'
import { UsernameBox } from './UsernameBox'

export class Content extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div id="chat-wrapper">
                <MessageList />
                <UsernameBox />
                <ChatTextBox /> 
            </div>
        );
    }
}
