import Document from "../Document.ts";
import Parser from "../Parser.ts";
export default class CommentParser extends Parser {
    #private;
    static IsStart(content: string, i: number): number;
    constructor(document: Document);
    __read(c: string, i: number, line: number): 1 | 3;
}
//# sourceMappingURL=CommentParser.d.ts.map