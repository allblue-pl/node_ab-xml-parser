import Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribParser from "./AttribParser.ts";

export default class AttribNameParser extends Parser {
    static IsStart(c: string, i: number, line: string): number {
        return /[a-zA-Z0-9$_]/.test(c) ? 1 : 0;
    }


    #attribParser: AttribParser;
    #name: string;
    #regExp_Char: RegExp;


    constructor(document: Document, attribParser: AttribParser) {
        super(document);

        this.#attribParser = attribParser;
        this.#name = '';

        this.#regExp_Char = /[a-zA-Z0-9\-_]/;
    }

    __read(c: string, i: number, line: number): number {
        if (this.#regExp_Char.test(c)) {
            this.#name += c;
            return 1;
        }

        this.#attribParser.setName(this.#name);
        this.finish();
        return 0;
    }

}
