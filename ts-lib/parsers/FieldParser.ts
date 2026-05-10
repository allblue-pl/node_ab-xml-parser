import type Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribValueParser from "./AttribValueParser.ts";
import FieldArgsParser from "./FieldArgsParser.ts";
import TagParser from "./TagParser.ts";
import TextParser from "./TextParser.ts";

export default class FieldParser extends Parser {
    static IsStart(document: Document, c: string, i: number): number {
        if (c !== '$')
            return 0;

        if (i >= 1) {
            if (document.content[i - 1] === '\\')
                return 0;
        }

        return 1;
    }


    #args: string|null;
    #bracketsOpened: number;
    #escaped: boolean;
    #name: string;
    #parentParser: Parser;
    #regExp: RegExp;


    get escaped(): boolean {
        return this.#escaped;
    }

    get name(): string {
        return this.#name;
    }


    constructor(document: Document, parser: Parser) {
        super(document);

        this.#parentParser = parser;
        if (!(parser instanceof TextParser) && !(parser instanceof AttribValueParser))
            throw new Error(`Invalid parser type: ${parser.constructor.name}.`);

        this.#name = '';
        this.#args = null;
        this.#bracketsOpened = 0;

        this.#escaped = false;
    
        this.#regExp = /[a-zA-Z0-9_.]/;
    }

    setArgs(args: string) {
        this.#args = args;
    }

    __read(c: string, i: number, line: number) {
        let step;

        if (this.#name === '' && !this.#escaped) {
            if (i + 2 < this.document.content.length) {
                if (this.document.content[i + 2] === '{') {
                    this.#escaped = true;
                    return 1;
                }
            }

            if (i + 1 < this.document.content.length) {
                if (this.document.content[i + 1] === '{') {
                    this.#bracketsOpened++;
                    this.#name += '{';
                    return 1;
                }
            }

            if (c === '{') {
                this.#escaped = true;
                return 1;
            }
        }

        if (c === '{') {
            this.#bracketsOpened++;
            this.#name += '{';
            return 1;
        }

        if (c === '}') {
            if (this.#bracketsOpened > 0) {
                this.#bracketsOpened--;
                this.#name += '}';
                return 1;
            }
        }

        if (this.#regExp.test(c)) {
            if (this.#args !== null) {
                if (this.#name !== '') {
                    this.addField();
                    this.finish();
                    return 0;
                }
            }

            this.#name += c;

            if (i + 1 >= this.document.content.length && !this.#escaped) {
                if (this.#name !== '') {
                    this.addField();
                    this.finish();
                }
            }

            return 1;
        }

        if (this.#name !== '') {
            if (c === '(') {
                this.document.startParser(new FieldArgsParser(this.document, this));
                return 1;
            }
        }

        if (this.#escaped) {
            if (c !== '}')
                this.error('Wrong field name format.', line);

            if (this.#name !== '')
                this.addField();

            this.finish();
            return 1;
        }

        if (this.#name !=='')
            this.addField();

        this.finish();
        return 0;
    }


    addField() {
        if (this.#parentParser instanceof TextParser) {
            this.document.addNode({
                type: 'text',
                value: this._getField(),
            });
        } else if (this.#parentParser instanceof AttribValueParser) {
            this.#parentParser.attribParser.tagParser
                .attribs[this.#parentParser.attribParser.name].push(this._getField());
        }
    }

    _getField() {
        return '$' + (this.#escaped ? '{' : '') + this.#name + 
                (this.#args === null ? '' : '(' + this.#args + ')') + 
                (this.#escaped ? '}' : '');
    }

}
