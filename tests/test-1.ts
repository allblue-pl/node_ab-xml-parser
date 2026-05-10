import Document from "./ts-lib/Document.ts";


let d = new Document(`
<h1>
    Hello World
</h1>
<p _elem="hello">
    Sone text test.
</p>
<_>
    Virtual!
</_>
`);
console.log(d.nodes);