import {ItemReader, Item, TodoReader, TodoTxt} from '../parser/todotxt'
import {expect} from 'chai'
import * as moment from 'moment'
import 'mocha'

const baseParse    = "testing the parse"
const doneParse    = "x test done"
const doneDate     = "x 21-07-1995 test done"
const priority     = "(A) test done"
const donePriority = "x (A) test done"
const context = "test done @a @b"


describe('Task Parse', () => {
    const reader = new ItemReader()
    it('should parse text', () => {
        const text = baseParse.split(" ")
        let result = reader.read(baseParse, 0)
        expect(result.text).to.deep.equal(text);
    })
    it('should prase done', () => {
        const text = ["test", "done"]
        let result = reader.read(doneParse, 0)
        expect(result.isComplete).to.equal(true)
        expect(result.text).to.deep.equal(text)
    })
    it('should parse done with date', () => {
        const text = ['test', 'done']
        let result = reader.read(doneDate, 0)
        expect(result.isComplete).to.equal(true)
        expect(result.text).to.deep.equal(text)
        expect(result.completedDate).to.deep.equal(moment("21-07-1995", 'DD-MM-YYYY', true))
    })
    it('should parse priority', () => {
        const text = ["test", "done"]
        let result = reader.read(priority, 0)
        expect(result.priority).to.deep.equal("(A)")
        expect(result.text).to.deep.equal(text)
    })
    it('should parse done task with priority', () => {
        const text = ["test", "done"]
        let result = reader.read(donePriority, 0)
        expect(result.priority).to.deep.equal("(A)")
        expect(result.isComplete).to.deep.equal(true)
        expect(result.text).to.deep.equal(text)
    })
    it('should parse task with contexts', () => {
        const text = ["test", "done"]
        let result = reader.read(context, 0)
        expect(result.contexts).to.deep.equal(["@a", "@b"])
        expect(result.text).to.deep.equal(text)
    })
})

const fileBlob = `(A) Task 1
x (B) Task 2
(C) Task 3
x 21-07-1995 (D) Task 4
`

describe("File Parse", () => {
    it('should parse file blob', () => {
        const reader = new TodoReader()
        let result = reader.read(fileBlob)
        expect(result.items[0].lineNum).to.equal(0)
        expect(result.items[3].lineNum).to.equal(3)

        expect(result.items[0].text).to.deep.equal(["Task", "1"])
        expect(result.items[1].text).to.deep.equal(["Task", "2"])
        expect(result.items[2].text).to.deep.equal(["Task", "3"])
        expect(result.items[3].text).to.deep.equal(["Task", "4"])

        expect(result.items[0].priority).to.deep.equal("(A)")
        expect(result.items[1].priority).to.deep.equal("(B)")
        expect(result.items[2].priority).to.deep.equal("(C)")
        expect(result.items[3].priority).to.deep.equal("(D)")

        expect(result.items[1].isComplete).to.equal(true)
        expect(result.items[3].isComplete).to.equal(true)

        expect(result.items[3].completedDate).to.deep.equal(moment("21-07-1995", 'DD-MM-YYYY', true))
    })
})
