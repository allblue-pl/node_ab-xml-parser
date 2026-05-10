import Document from "../Document.ts";
import Parser from "../Parser.ts";
import TagParser from "./TagParser.ts";
export default class AttribParser extends Parser {
    #private;
    static IsStart(c: string): number;
    get name(): string;
    get tagParser(): TagParser;
    constructor(document: Document, tagParser: TagParser);
    setName(name: string): void;
    __read(c: string, i: number, line: number): number;
}
//# sourceMappingURL=AttribParser.d.ts.map