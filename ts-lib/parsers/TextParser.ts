import { decode as htmlEntities_Decode } from "html-entities";

import Parser from "../Parser.ts";
import ExprParser from "./ExprParser.ts";
import FieldParser from "./FieldParser.ts";
import TagParser from "./TagParser.ts";
import type Document from "../Document.ts";

export default class TextParser extends Parser {
    static IsStart(c: string): number {
        return c === '<' ? 1 : 0;
    }


    #value: string|null;


    constructor(document: Document) {
        super(document);

        this.#value = null;
    }

    __read(c: string, i: number, line: number): number {
        let step;

        step = TagParser.IsStart(c);
        if (step > 0) {
            if (this.#value !== null && this.#value !== '') {
                while ([ ' ', "\r", "\n" ].includes(this.#value[this.#value.length - 1]))
                    this.#value = this.#value.substring(0, this.#value.length - 1);
                if (this.#value !== '') {
                    this.document.addNode({
                        type: 'text',
                        value: this._decodeHtml(this.#value),
                    });
                }
            }
            
            this.finish();
            return 0;
        }

        if (this.#value === null) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            this.#value = '';
        }

        step = FieldParser.IsStart(this.document, c, i);
        if (step > 0) {
            if (this.#value !== null && this.#value !== '') {
                this.document.addNode({
                    type: 'text',
                    value: this._decodeHtml(this.#value),
                });
            }
            this.#value = '';

            this.document.startParser(new FieldParser(this.document, this));
            return step;
        }

        step = ExprParser.IsStart(this.document.content, i);
        if (step > 0) {
            if (this.#value !== null && this.#value !== '') {
                this.document.addNode({
                    type: 'text',
                    value: this._decodeHtml(this.#value),
                });
            }
            this.#value = '';

            this.document.startParser(new ExprParser(this.document, this));
            return step;
        }

        this.#value += c;

        if (i + 1 >= this.document.content.length) {
            this.document.addNode({
                type: 'text',
                value: this._decodeHtml(this.#value),
            });
            this.finish();
        }

        return 1;
    }


    _decodeHtml(str: string): string {
        return htmlEntities_Decode(str);
    }

}
