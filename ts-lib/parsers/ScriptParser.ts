import type Document from "../Document.ts";
import Parser from "../Parser.ts";
import TagParser from "./TagParser.ts";

export default class ScriptParser extends Parser {
    static get Quotes(): Array<string> {
        return [ '"', '\'', '`' ];
    }


    #quoteOpened: null|string;
    #value: string;


    constructor(document: Document) {
        super(document);

        this.#quoteOpened = null;

        this.#value = '';
    }

    __read(c: string, i: number, line: number) {
        let step;

        if (this.#quoteOpened === null) {
            if (ScriptParser.Quotes.includes(c)) {
                this.#quoteOpened = c;
                this.#value += c;
                return 1;
            }
        } else {
            if (c === this.#quoteOpened && this.document.content[i - 1] !== '\\') {
                this.#quoteOpened = null;
                this.#value += c;
                return 1;
            }
        }

        if (this.#quoteOpened === null) {
            step = TagParser.IsStart(c);
            if (step > 0) {
                this.document.addNode({
                    type: 'text',
                    value: this.#value,
                });
                this.finish();
                return 0;
            }
        }

        this.#value +=c;
        return 1;
    }

}
