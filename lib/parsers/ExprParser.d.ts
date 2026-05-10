import type Document from "../Document.ts";
import Parser from "../Parser.ts";
export default class ExprParser extends Parser {
    #private;
    static get Quotes(): Array<string>;
    static IsStart(content: string, i: number): number;
    constructor(document: Document, parser: Parser);
    __read(c: string, i: number, line: number): number;
}
//# sourceMappingURL=ExprParser.d.ts.map