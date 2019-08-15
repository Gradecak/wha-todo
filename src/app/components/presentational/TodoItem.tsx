import * as React from 'react';
import {Item} from '../../../parser/todotxt'

export class TodoItem extends React.Component<Item> {
    render(){
        return (
            <div key={this.props.id}>
                {this.props.text}
            </div>
        )
    }
}
