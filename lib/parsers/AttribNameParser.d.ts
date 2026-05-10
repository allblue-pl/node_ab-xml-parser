import Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribParser from "./AttribParser.ts";
export default class AttribNameParser extends Parser {
    #private;
    static IsStart(c: string, i: number, line: string): number;
    constructor(document: Document, attribParser: AttribParser);
    __read(c: string, i: number, line: number): number;
}
//# sourceMappingURL=AttribNameParser.d.ts.map