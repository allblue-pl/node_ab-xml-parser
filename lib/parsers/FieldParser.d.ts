import type Document from "../Document.ts";
import Parser from "../Parser.ts";
export default class FieldParser extends Parser {
    #private;
    static IsStart(document: Document, c: string, i: number): number;
    get escaped(): boolean;
    get name(): string;
    constructor(document: Document, parser: Parser);
    setArgs(args: string): void;
    __read(c: string, i: number, line: number): 0 | 1;
    addField(): void;
    _getField(): string;
}
//# sourceMappingURL=FieldParser.d.ts.map