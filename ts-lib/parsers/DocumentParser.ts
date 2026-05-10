import Document from "../Document.ts";
import Parser from "../Parser.ts";
import CommentParser from "./CommentParser.ts";
import ScriptParser from "./ScriptParser.ts";
import TagParser from "./TagParser.ts";
import TextParser from "./TextParser.ts";

export default class DocumentParser extends Parser {
    constructor(document: Document) {
        super(document);
    }

    __read(c: string, i: number, line: number): number {
        let step;

        if (c === ' ' || c === "\r" || c === "\n")
            return 1;

        step = CommentParser.IsStart(this.document.content, i);
        if (step > 0) {
            this.document.startParser(new CommentParser(this.document));
            return step;
        }

        step = TagParser.IsStart(c);
        if (step > 0) {
            this.document.startParser(new TagParser(this.document));
            return step;
        }

        let lastElem = this.document.lastElem;
        if (lastElem !== null) {
            if (lastElem.name !== null && lastElem.name !== undefined) {
                 if (lastElem.name.toLowerCase() === 'script') {
                    this.document.startParser(new ScriptParser(this.document));            
                    return 0;
                }
            }
        }
        
        this.document.startParser(new TextParser(this.document));
        return 0;
    }

}
