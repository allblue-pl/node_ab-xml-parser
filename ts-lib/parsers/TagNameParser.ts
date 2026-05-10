import type Document from "../Document.ts";
import Parser from "../Parser.ts";
import type TagParser from "./TagParser.ts";

export default class TagNameParser extends Parser {
    static IsStart(c: string): number {
        return /[a-zA-Z0-9$_]/.test(c) ? 1 : 0;
    }


    #name: string;
    #regExp_Char: RegExp;
    #tagParser: TagParser;



    constructor(document: Document, tagParser: TagParser) {
        super(document);

        this.#tagParser = tagParser;
        this.#name = '';

        this.#regExp_Char = /[a-zA-Z0-9$\-_]/;
    }

    __read(c: string, i: number, line: number) {
        if (this.#regExp_Char.test(c)) {
            this.#name += c;
            return 1;
        }

        this.#tagParser.setName(this.#name);
        this.finish();
        return 0;
    }

}
