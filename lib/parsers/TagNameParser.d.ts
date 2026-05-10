import type Document from "../Document.ts";
import Parser from "../Parser.ts";
import type TagParser from "./TagParser.ts";
export default class TagNameParser extends Parser {
    #private;
    static IsStart(c: string): number;
    constructor(document: Document, tagParser: TagParser);
    __read(c: string, i: number, line: number): 0 | 1;
}
//# sourceMappingURL=TagNameParser.d.ts.map