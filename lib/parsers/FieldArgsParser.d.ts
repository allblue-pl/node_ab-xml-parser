import type Document from "../Document.ts";
import Parser from "../Parser.ts";
import type FieldParser from "./FieldParser.ts";
export default class FieldArgsParser extends Parser {
    #private;
    static IsStart(c: string, i: number, line: number): number;
    constructor(document: Document, fieldParser: FieldParser);
    __read(c: string, i: number, line: number): number;
}
//# sourceMappingURL=FieldArgsParser.d.ts.map