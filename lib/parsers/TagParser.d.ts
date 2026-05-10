import Document from "../Document.ts";
import Parser from "../Parser.ts";
export default class TagParser extends Parser {
    #private;
    static IsStart(c: string): number;
    get attribs(): {
        [key: string]: Array<string>;
    };
    get name(): string;
    constructor(document: Document);
    setName(name: string): void;
    __read(c: string, i: number, line: number): number;
}
//# sourceMappingURL=TagParser.d.ts.map