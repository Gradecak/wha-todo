/*
 * "Inspired" by: https://github.com/roufamatic/todo-txt-js :)
 */

import * as moment from 'moment'

const SORT_ASC = 'asc';
const SORT_DESC = 'desc';
const reTrim = /^\s+|\s+$/g;
const reSplitSpaces = /\+s/;
const reFourDigits = /^\d{4}$/;
const reTwoDigits = /^\d{2}$/;
const rePriority = /^\([A-Z]\)$/;
const reBlankLine = /^\s*$/;
const reAddOn = /[^\:]+\:[^\:]/;

class ItemReader {
    // private tokens : string[]
    // private item : Item

    read = (line: string) : Item => {
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

        item.isComplete = tokens.length > 0 && tokens[0] === "x";
        this._completedDate(tokens, item)
        this._priority(tokens, item)
        return item
    }

    private _completedDate = (tokens : string[], item : Item) : moment.Moment  => {
        if (!item.isComplete || tokens.length<2) return null
        item.completedDate = moment(tokens[1])
    }

    private _priority = (tokens : string[], item : Item) : string => {
        let pos = 0;
        if (item.isComplete){
            pos++;
            if (item.completedDate != null){
                pos++;
            }
        }
        if (tokens.length <= pos) return null;
        let priorityToken = tokens[pos];
        if (!rePriority.test(priorityToken)) return null;
        return priorityToken
    }

    private createdDate = (tokens :string[], item : Item) : moment.Moment => {
        let pos = 0;
        if (item.isComplete) pos++;
        if (item.completedDate) pos++;
        if (item.priority) pos++;
        if (tokens.length <= pos) return null
        return moment(tokens[pos])
    }

    contexts = () => {
        var seen = {};

    }

}

class Item {

    public id : string
    public isComplete : boolean
    public completedDate : moment.Moment
    public priority : string
    public createDate : moment.Moment

    // constructor(){


    //     this.isComplete =
    //     this.completedDate = this._completedDate()
    //     this.priority = this._priority()
    // }


    // TODO func replaceWith()
}

class TodoTxt {


    public items : [Item]

    constructor(blob: string){

    }
}
