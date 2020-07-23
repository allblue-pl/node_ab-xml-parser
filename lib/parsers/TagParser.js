'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    AttribParser = require('./AttribParser'),
    TagNameParser = require('./TagNameParser')
;

class TagParser extends Parser
{

    static IsStart(c, i, line) {
        return c === '<' ? 1 : 0;
    }


    constructor(document)
    {
        js0.args(arguments, require('../Document'));
        super(document);

        this.name = null;
        this.attribs = {};

        this.closing = false;
        this.selfClosing = false;
    }

    __read(c, i, line)
    {
        if (this.name === null) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            if (c === '/') {
                this.closing = true;
                return 1;
            }

            if (TagNameParser.IsStart(c)) {
                this.document.startParser(new TagNameParser(this.document, this, i));
                return 0;
            }
        }

        if (this.name !== null && !this.selfClosing) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;
            
            if (c === '/') {
                this.selfClosing = true;
                return 1;
            }
            
            if (c === '>') {
                if (this.closing) {
                    this.document.closeElem(this.name, line);
                    this.finish();
                    return 1;
                }

                this.document.addNode({
                    type: 'element',
                    name: this.name,
                    attribs: this.attribs,
                    children: [],
                });
                this.finish();
                return 1;
            }

            if (AttribParser.IsStart(c) > 0) {
                this.document.startParser(new AttribParser(this.document, this));
                return 0;
            }
        }

        if (this.selfClosing){
            if (c === ' ' || c === "\r" || c === "\n") {
                this.selfClosing = true;
                return 1;
            }

            if (c === '>') {
                this.document.addNode({
                    type: 'element',
                    name: this.name,
                    attribs: this.attribs,
                    children: [],
                });
                this.document.closeElem(this.name, line);
                this.finish();
                return 1;
            }
        } 

        this.error(`Cannot parse character '${c}' in tag.`, line);
    }

}
module.exports = TagParser;