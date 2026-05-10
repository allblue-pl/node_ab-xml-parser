import Document from "./Document.js";
export default class Parser {
    get document() {
        return this.#document;
    }
    #document;
    constructor(document) {
        this.#document = document;
    }
    error(message, line) {
        throw new Error('Line: ' + line + '. ' + message);
    }
    finish() {
        this.#document.finishParser(this);
    }
    read(c, i, line) {
        return this.__read(c, i, line);
    }
}
