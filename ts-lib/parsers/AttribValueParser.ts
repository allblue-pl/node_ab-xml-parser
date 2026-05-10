import Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribParser from "./AttribParser.ts";
import ExprParser from "./ExprParser.ts";
import FieldParser from "./FieldParser.ts";

export default class AttribValueParser extends Parser {
    static IsStart(c: string): number {
        return /[a-zA-Z0-9$_]/.test(c) ? 1 : 0;
    }


    #attribParser: AttribParser;
    #value: string;
    #regExp_Char: RegExp;


    get attribParser(): AttribParser {
        return this.#attribParser;
    }


    constructor(document: Document, attribParser: AttribParser) {
        super(document);

        this.#attribParser = attribParser;
        this.#value = '';

        this.#regExp_Char = /[a-zA-Z0-9\-_]/;
    }

    __read(c: string, i: number, line: number): number {
        let step: number;

        step = FieldParser.IsStart(this.document, c, i);
        if (step > 0) {
            if (this.#value !== '') {
                this.#attribParser.tagParser.attribs[this.#attribParser.name]
                        .push(this.#value);
            }
            this.#value = '';    

            this.document.startParser(new FieldParser(this.document, this));
            return step;
        }

        step = ExprParser.IsStart(this.document.content, i);
        if (step > 0) {
            if (this.#value !== '') {
                this.#attribParser.tagParser.attribs[this.#attribParser.name]
                        .push(this.#value);
            }
            this.#value = '';

            this.document.startParser(new ExprParser(this.document, this));
            return step;
        }

        if (c !== '"') {
            this.#value += c;
            return 1;
        }


        if (this.#value !== '' || 
                this.#attribParser.tagParser.attribs[this.#attribParser.name].length === 0) {
            this.#attribParser.tagParser.attribs[this.#attribParser.name].push(this.#value);
        }
        this.finish();
        return 1;
    }

}
