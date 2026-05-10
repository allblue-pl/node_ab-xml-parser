import Document from "./Document.ts";
export default abstract class Parser {
    #private;
    get document(): Document;
    constructor(document: Document);
    error(message: string, line: number): void;
    finish(): void;
    read(c: string, i: number, line: number): number;
    abstract __read(c: string, i: number, line: number): number;
}
//# sourceMappingURL=Parser.d.ts.map