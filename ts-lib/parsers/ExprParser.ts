import type Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribParser from "./AttribParser.ts";
import AttribValueParser from "./AttribValueParser.ts";
import TagParser from "./TagParser.ts";
import TextParser from "./TextParser.ts";

export default class ExprParser extends Parser {
    static get Quotes(): Array<string> {
        return [ '"', '\'', '`' ];
    }

    static IsStart(content: string, i: number): number {
        if (content.length > i + 1) {
            if (content[i] === '?' && content[i + 1] === '(')
                return 2;
        }

        return 0;
    }


    #bracketsOpened: number;
    #parentParser: Parser;
    #quoteOpened: string|null;
    #value: string;


    constructor(document: Document, parser: Parser) {
        super(document);

        this.#parentParser = parser;
        if (!(parser instanceof TextParser) && 
                !(parser instanceof AttribValueParser))
            throw new Error(`Invalid parser type: ${parser.constructor.name}.`);

        this.#quoteOpened = null;
        this.#bracketsOpened = 0;

        this.#value = '';
    }

    __read(c: string, i: number, line: number) {
        let step;

        if (this.#quoteOpened === null) {
            if (ExprParser.Quotes.includes(c)) {
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
            if (c === '(') {
                this.#bracketsOpened++;
                this.#value += c;
                return 1;
            }

            if (c === ')') {
                if (this.#bracketsOpened > 0) {
                    this.#bracketsOpened--;
                    this.#value += c;
                    return 1;
                }

                if (this.#parentParser instanceof TextParser) {
                    this.document.addNode({
                        type: 'text',
                        value: '?(' + this.#value + ')',
                    });
                } else if (this.#parentParser instanceof AttribValueParser) {
                    this.#parentParser.attribParser.tagParser
                            .attribs[this.#parentParser.attribParser.name].push(
                            '?(' + this.#value + ')');
                }
                this.finish();
                return 1;
            }
        }

        this.#value +=c;
        return 1;
    }

}
