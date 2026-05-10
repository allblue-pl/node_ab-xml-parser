import Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribNameParser from "./AttribNameParser.ts";
import AttribValueParser from "./AttribValueParser.ts";
import TagParser from "./TagParser.ts";

export default class AttribParser extends Parser {
    static IsStart(c: string): number {
        return /[a-zA-Z_]/.test(c) ? 1 : 0;
    }


    #tagParser: TagParser;
    #name: string|null;
    #afterEqual: boolean;
    #afterValue: boolean;


    get name(): string {
        return this.#name === null ? '' : this.#name;
    }

    get tagParser(): TagParser {
        return this.#tagParser;
    }


    constructor(document: Document, tagParser: TagParser) {
        super(document);

        this.#tagParser = tagParser;

        this.#name = null;
        this.#afterEqual = false;
        this.#afterValue = false;
    }

    setName(name: string): void {
        this.#name = name;
    }


    __read(c: string, i: number, line: number): number {
        if (this.#name === null) {
            this.document.startParser(new AttribNameParser(this.document, this));
            return 0;
        }

        if (this.#name !== null && !this.#afterEqual ) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            if (c === '=') {
                this.#tagParser.attribs[this.#name] = [];

                this.#afterEqual = true;
                return 1;
            }

            this.error(`Cannot parse tag '${this.#tagParser.name}' attribute '${this.#name}'.` +
                    ` Unexpected '${c}'.`, line);
        }

        if (this.#name !== null && this.#afterEqual && !this.#afterValue) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            if (c === '"') {
                this.#afterValue = true;
                this.document.startParser(new AttribValueParser(this.document, this));
                return 1;
            }

            this.error(`Cannot parse tag '${this.#tagParser.name}' attribute '${this.#name}'.` +
                ` Unexpected '${c}'.`, line);
        }

        if (this.#name !== null && this.#afterValue) {
            this.finish();
            return 0;
        }

        this.error(`Cannot parse character '${c}' in tag.`, line);
        return 0;
    }

}
