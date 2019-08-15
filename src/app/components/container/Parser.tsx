import * as React from 'react';
import * as fs from 'fs';
import {TodoReader, TodoTxt} from '../../../parser/todotxt';
import { TodoItem } from '../presentational/TodoItem';

export interface TodoParserProps {
    todoPath:string
}

type TodoState = {
    files: Map<string,number>
    todos: Map<string, TodoTxt>
}

export class TodoParser extends React.Component<TodoParserProps, TodoState> {

    constructor(props: TodoParserProps) {
        super(props)
        //open file descriptors to all files in todo path
        let files = fs.readdirSync(props.todoPath)
        let reader = new TodoReader()
        let fds = new Map<string,number>()
        let tds = new Map<string,TodoTxt>()
        for (let file of files) {
            console.log("Opening " + file)
            fds.set(file, fs.openSync(props.todoPath+file, "r+"))
            let fileContent = fs.readFileSync(fds.get(file))
            tds.set(file, reader.read(fileContent.toString()))
        }

        //parse the files
        this.state = {files:fds, todos:tds}
    }

    getTodos = (fName : string) : React.Fragment  => {
        let todotxt = this.state.todos.get(fName)
        let todos : TodoItem[] = []
        for (let item of todotxt.items){
            todos.push(new TodoItem(item))
        }
        return (
            <React.Fragment>
                {{todos}}
            </React.Fragment>
        )
    }


    // this is a purely logical container
    render(){
        return false
    }
}
