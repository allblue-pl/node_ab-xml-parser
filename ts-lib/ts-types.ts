export type ElemType = {
    attribs?: { [name:string]: Array<string> },
    type: string;
    name?: string|null;
    value?: string;
    children?: Array<ElemType>;
};