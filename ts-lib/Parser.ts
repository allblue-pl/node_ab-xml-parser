import Document from "./Document.ts";

export default abstract class Parser {
    get document(): Document {
        return this.#document;
    }


    #document: Document;


    constructor(document: Document) {
        this.#document = document;
    }

    error(message: string, line: number) {
        throw new Error('Line: ' + line + '. ' + message);
    }

    finish() {
        this.#document.finishParser(this);
    }

    read(c: string, i: number, line: number): number {
        return this.__read(c, i, line);
    }


    abstract __read(c: string, i: number, line: number): number;
}