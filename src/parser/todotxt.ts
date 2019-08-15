/*
 * "Inspired" by: https://github.com/roufamatic/todo-txt-js :)
 */

import * as moment from 'moment'

const DATE_FORMAT = 'DD-MM-YYYY';
const SORT_ASC = 'asc';
const SORT_DESC = 'desc';
const reTrim = /^\s+|\s+$/g;
const reSplitSpaces = /\s+/;
const reFourDigits = /^\d{4}$/;
const reTwoDigits = /^\d{2}$/;
const rePriority = /^\([A-Z]\)$/;
const reBlankLine = /^\s*$/;
const reAddOn = /[^\:]+\:[^\:]/;

export class ItemReader {

    read = (line: string, lineNum : number) : Item => {
        let tokens : string[] = []
        let item = new Item()
        //fail construction
        if (!line || reBlankLine.test(line)) return null;

        // attempt to tokenize line
        let l = line.replace(reTrim, '');
        if (l !== ''){
            tokens = l.split(reSplitSpaces);
        }

        //TODO figure out what the hell this does???
        item.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        //parse items
        item.isComplete = tokens.length > 0 && tokens[0] === "x";
        item.lineNum = lineNum
        this._completedDate(tokens, item)
        this._priority(tokens, item)
        this._createdDate(tokens,item)
        this._context(tokens,item)
        this._projects(tokens,item)
        this._text(tokens,item)
        return item
    }

    private _completedDate = (tokens : string[], item : Item)  => {
        if (!item.isComplete || tokens.length<2) return
        let date = moment(tokens[1], DATE_FORMAT, true)
        if (date.isValid()) item.completedDate = date
    }

    private _priority = (tokens : string[], item : Item) => {
        let pos = 0;
        if (item.isComplete){
            pos++;
            if (item.completedDate != null){
                pos++;
            }
        }
        if (tokens.length <= pos) return;
        let priorityToken = tokens[pos];
        if (!rePriority.test(priorityToken)) return;
        item.priority = priorityToken
    }

    private _createdDate = (tokens :string[], item : Item) => {
        let pos = 0;
        if (item.isComplete) pos++;
        if (item.completedDate) pos++;
        if (item.priority) pos++;
        if (tokens.length <= pos) return
        let date = moment(tokens[pos], DATE_FORMAT, true)
        if (date.isValid()) item.createDate = date
    }

    private _context = (tokens : string[], item: Item) => {
        item.contexts = this._parseTags(tokens, "@")
    }

    private _projects = (tokens : string[], item : Item) => {
        item.projects = this._parseTags(tokens, "+")
    }

    private _text = (tokens: string[], item: Item) => {
        let a : string[] = []
        let pos = 0
        if (item.isComplete) pos++
        if (item.completedDate) pos++
        if (item.priority) pos++
        if (item.createDate) pos++

        for (let i=pos; i < tokens.length; i++){
            let token = tokens[i]
            if (token[0] === '@' || token[0] === '+' || reAddOn.test(token)) continue;
            a.push(token)
        }
        item.text = a
    }

    private _parseTags = (tokens : string[], tag : string) : string[] => {
        let toks : string[] = []
        for (let token of tokens){
            if (token.length < 2) continue;
            if (token[0] === tag){
                toks.push(token)
            }
        }
        return toks
    }
}

export class Item {

    public id : string
    public lineNum : number
    public isComplete : boolean
    public completedDate : moment.Moment
    public priority : string
    public createDate : moment.Moment
    public contexts : string[]
    public projects : string[]
    public text : string[]

    completeTask = () => {
        if (this.isComplete) return
        this.isComplete = true
        this.completedDate = moment()
    }

    uncompleteTask = () => {
        if (!this.isComplete) return
        this.isComplete = false
        this.completedDate = null
    }

    addContext = (ctx : string) => {
        if (ctx[0] !== '@') ctx = '@'+ctx
        this.contexts.push(ctx)
    }

    addProject = (prj : string) => {
        if (prj[0] !== "+") prj = '+'+prj
        this.projects.push(prj)
    }

    removeContext = (ctx : string) => {
        if (ctx[0] !== '@') ctx = '@'+ctx
        const index = this.contexts.indexOf(ctx, 0);
        if (index > -1){
            this.contexts.splice(index,1);
        }
    }

    removeProject = (prj : string) => {
        if (prj[0] !== '@') prj = '@'+prj
        const index = this.contexts.indexOf(prj, 0);
        if (index > -1){
            this.contexts.splice(index,1);
        }
    }

    // TODO render
}

export class TodoReader {

    read = (blob : string) : TodoTxt => {
        const iReader = new ItemReader()
        let items : Item[] = []
        let ls = blob.split("\n")
        for (let i=0; i<ls.length; i++){
            let line = ls[i]
            if (reBlankLine.test(line)) continue
            items.push(iReader.read(line, i))
        }
        return new TodoTxt(items)
    }

    // constructor(blob : string){

    // }
}

export class TodoTxt {

    public items : Item[]

    constructor (items : Item[]) {
        this.items=items
    }

}
