import Parser from "../Parser.ts";
import type Document from "../Document.ts";
export default class TextParser extends Parser {
    #private;
    static IsStart(c: string): number;
    constructor(document: Document);
    __read(c: string, i: number, line: number): number;
    _decodeHtml(str: string): string;
}
//# sourceMappingURL=TextParser.d.ts.map