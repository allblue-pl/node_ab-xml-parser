import type Document from "../Document.ts";
import Parser from "../Parser.ts";
import type FieldParser from "./FieldParser.ts";
import TagParser from "./TagParser.ts";

export default class FieldArgsParser extends Parser {
    static IsStart(c: string, i: number, line: number): number {
        return c === '(' ? 1 : 0;
    }


    #args: string;
    #fieldParser: FieldParser;


    constructor(document: Document, fieldParser: FieldParser) {
        super(document);

        this.#fieldParser = fieldParser;

        this.#args = '';
    }

    __read(c: string, i: number, line: number) {
        let step;

        if (c === ')') {
            this.#fieldParser.setArgs(this.#args);
            this.finish();

            if (i + 1 >= this.document.content.length && !this.#fieldParser.escaped) {
                if (this.#fieldParser.name !== '') {
                    this.#fieldParser.finish();
                    this.#fieldParser.addField();
                }
            }

            return 1;
        }

        this.#args +=c;
        return 1;
    }

}
