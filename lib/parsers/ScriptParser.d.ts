import type Document from "../Document.ts";
import Parser from "../Parser.ts";
export default class ScriptParser extends Parser {
    #private;
    static get Quotes(): Array<string>;
    constructor(document: Document);
    __read(c: string, i: number, line: number): 0 | 1;
}
//# sourceMappingURL=ScriptParser.d.ts.map