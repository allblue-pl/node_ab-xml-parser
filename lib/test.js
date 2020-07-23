'use strict';

const
    fs = require('fs'),

    Document = require('./Document')
;

let d = new Document(fs.readFileSync('./test.xml').toString());
d._printTag(d.elems[0]);
// console.log(d.nodes);