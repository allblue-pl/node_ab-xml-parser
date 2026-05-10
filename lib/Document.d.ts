import Parser from "./Parser.ts";
import type { ElemType } from "./ts-types.ts";
export default class Document {
    #private;
    get content(): string;
    get lastElem(): ElemType | null;
    get nodes(): Array<ElemType>;
    constructor(content: string);
    parse(): void;
    addNode(node: ElemType): void;
    closeElem(tagName: string | null, line: number): void;
    error(message: string, line: number): void;
    finishParser(parser: Parser): void;
    startParser(parser: Parser): void;
}
//# sourceMappingURL=Document.d.ts.map