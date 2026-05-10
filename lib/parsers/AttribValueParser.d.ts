import Document from "../Document.ts";
import Parser from "../Parser.ts";
import AttribParser from "./AttribParser.ts";
export default class AttribValueParser extends Parser {
    #private;
    static IsStart(c: string): number;
    get attribParser(): AttribParser;
    constructor(document: Document, attribParser: AttribParser);
    __read(c: string, i: number, line: number): number;
}
//# sourceMappingURL=AttribValueParser.d.ts.map