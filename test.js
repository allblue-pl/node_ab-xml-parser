'use strict';

const
    abXmlParser = require('./lib')
;


let d = new abXmlParser.Document(`
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