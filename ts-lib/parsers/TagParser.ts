import Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribParser from "./AttribParser.ts";
import TagNameParser from "./TagNameParser.ts";

export default class TagParser extends Parser {
    static IsStart(c: string): number {
        return c === '<' ? 1 : 0;
    }


    #name: string|null;
    #attribs: { [key:string]: Array<string> };
    #closing: boolean;
    #selfClosing: boolean;


    get attribs(): { [key:string]: Array<string> } {
        return this.#attribs;
    }

    get name(): string {
        return this.#name === null ? '' : this.#name;
    }


    constructor(document: Document) {
        super(document);

        this.#name = null;
        this.#attribs = {};

        this.#closing = false;
        this.#selfClosing = false;
    }

    setName(name: string) {
        this.#name = name;
    }

    __read(c: string, i: number, line: number): number {
        if (this.#name === null) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            if (c === '/') {
                this.#closing = true;
                return 1;
            }

            if (TagNameParser.IsStart(c)) {
                this.document.startParser(new TagNameParser(this.document, this));
                return 0;
            }
        }

        if (this.#name !== null && !this.#selfClosing) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;
            
            if (c === '/') {
                this.#selfClosing = true;
                return 1;
            }
            
            if (c === '>') {
                if (this.#closing) {
                    this.document.closeElem(this.#name, line);
                    this.finish();
                    return 1;
                }

                this.document.addNode({
                    type: 'element',
                    name: this.#name,
                    attribs: this.#attribs,
                    children: [],
                });
                this.finish();
                return 1;
            }

            if (AttribParser.IsStart(c) > 0) {
                this.document.startParser(new AttribParser(this.document, this));
                return 0;
            }
        }

        if (this.#selfClosing){
            if (c === ' ' || c === "\r" || c === "\n") {
                this.#selfClosing = true;
                return 1;
            }

            if (c === '>') {
                this.document.addNode({
                    type: 'element',
                    name: this.#name,
                    attribs: this.#attribs,
                    children: [],
                });
                this.document.closeElem(this.#name, line);
                this.finish();
                return 1;
            }
        } 

        this.error(`Cannot parse character '${c}' in tag.`, line);
        return 0;
    }

}
