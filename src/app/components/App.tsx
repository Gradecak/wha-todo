import * as React from 'react';
import {TodoParser, TodoParserProps} from './container/Parser'

type AppState = {
    todoParser: TodoParser

}

export class App extends React.Component<{}, AppState> {

    constructor(props:any){
        super(props)
        let parser = new TodoParser({todoPath:"/home/maki/Documents/todo/test/"})
        this.state = {todoParser: parser}
    }


    render(){
        let items = this.state.todoParser.getTodos('todo.txt')
        console.log(items)
        return (
            <div>
                {items}
            </div>
        )
    }
}
