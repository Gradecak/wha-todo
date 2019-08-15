import * as React from 'react';
import * as fs from 'fs';
import * as todo from '../../../parser/todotxt.js';

export interface TodoParserProps {
  todoPath:string
}

type TodoState = {
  files: Map<string,number>
}

export default class TodoParser extends React.Component<TodoParserProps, TodoState> {

  //open file descriptors to all files in todo path
  constructor(props: TodoParserProps) {
    super(props)
    let files = fs.readdirSync(props.todoPath)
    let fds = new Map<string,number>()
    for (let file of files) {
      fds.set(file, fs.openSync(file, "rw"))
    }
    this.state = {files:fds}
  }

  /* getTodos = () : => {

   * } */


  // this is a purely logical container
  render(){
    return false
  }

}
