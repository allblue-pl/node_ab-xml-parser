import Parser from "./Parser.ts";
import DocumentParser from "./parsers/DocumentParser.ts";
import type { ElemType } from "./ts-types.ts";

export default class Document {
    #content: string;
    #elems: Array<ElemType>;
    #parsers: Array<Parser>;


    get content() {
        return this.#content;
    }

    get lastElem(): ElemType|null {
        if (this.#elems.length === 0)
            return null;

        return this.#elems[this.#elems.length - 1];
    }

    get nodes(): Array<ElemType> {
        return this.#elems[0].children === undefined ? 
                [] : this.#elems[0].children;
    }


    constructor(content: string) {
        this.#content = content;
        this.#parsers = [
            new DocumentParser(this),
        ];

        this.#elems = [{
            type: 'root',
            name: '$root',
            children: [],
        }];

        if (content !== '')
            this.parse();
    }

    parse(): void {
        let i = 0;
        let line = 1;
        while(true) {
            let c = this.#content[i];
            let step = 0;

            let activeParser = this.#parsers[this.#parsers.length - 1];
            step = activeParser.read(c, i, line);
            
            if (step === 0 && this.#parsers[this.#parsers.length - 1] === activeParser)
                throw new Error(`Parser '${activeParser.constructor.name}' with step 0 created infinite loop.`);

            i += step;
            if (c === '\n')
                line++;

            if (i >= this.#content.length)
                break;
        }

        if (this.#elems.length > 1)
            throw new Error(`Tag '${this.#elems[this.#elems.length - 1].name}' not closed.`);

        // this._printTag(this.#elems[0]);
    }

    addNode(node: ElemType): void {
        if (this.lastElem === null)
            throw new Error("Cannot add node. Last elem is 'null'.");
        if (this.lastElem.children === undefined)
            throw new Error("Cannot add node. Last elem does not have 'children'.");
        this.lastElem.children.push(node);

        // console.log('Adding', node);

        if (node.type === 'comment') {
            // Do nothing.
        } else if (node.type === 'text') {
            // Do nothing.
        }  else if (node.type === 'element') {
            this.#elems.push(node);
        } else
            throw new Error(`Unknown node type '${node.type}'.`);
    }

    closeElem(tagName: string|null, line: number): void { 
        if (this.#elems.length > 1) {
            if (tagName === this.#elems[this.#elems.length - 1].name) {
                this.#elems.pop();
                return;
            }
        }

        this.error(`Unexpected close tag '${tagName}'.`, line);
    }

    error(message: string, line: number): void {
        throw new Error('Line: ' + line + '. ' + message);
    }

    finishParser(parser: Parser) {
        this.#parsers.pop();
    }

    startParser(parser: Parser) {
        this.#parsers.push(parser);
    }

    // _printTag(tag, offset: string = '') {
    //     if (tag.type === 'comment') {
    //         console.log(offset, '<!-- ' + tag.value + ' -->');
    //         return;
    //     }

    //     if (tag.type === 'text') {
    //         console.log(offset, '"' + tag.value + '"');
    //         return;
    //     }

    //     if (tag.type === 'element')
    //         console.log(offset, '#' + tag.name, tag.attribs);
    //     for (let tag_Child of tag.children)
    //         this._printTag(tag_Child, offset + '  ');
    // }
}
