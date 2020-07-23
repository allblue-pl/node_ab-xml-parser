'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    CommentParser = require('./CommentParser'),
    ScriptParser = require('./ScriptParser'),
    TagParser = require('./TagParser'),
    TextParser = require('./TextParser')
;

class DocumentParser extends Parser
{

    constructor(document)
    {
        js0.args(arguments, require('../Document'));

        super(document);
    }

    __read(c, i, line)
    {
        let step;

        if (c === ' ' || c === "\r" || c === "\n")
            return 1;

        step = CommentParser.IsStart(this.document.content, i);
        if (step > 0) {
            this.document.startParser(new CommentParser(this.document));
            return step;
        }

        step = TagParser.IsStart(c);
        if (step > 0) {
            this.document.startParser(new TagParser(this.document));
            return step;
        }

        if (this.document.elems[this.document.elems.length - 1].name.toLowerCase() === 'script') {
            this.document.startParser(new ScriptParser(this.document));            
            return 0;
        }
        
        this.document.startParser(new TextParser(this.document));
        return 0;
    }

}
module.exports = DocumentParser;