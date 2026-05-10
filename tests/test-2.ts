import fs from "node:fs";
import Document from "../ts-lib/Document.ts";

let d = new Document(fs.readFileSync('./test.xml').toString());
// d._printTag(d.elems[0]);
console.log(d.nodes);