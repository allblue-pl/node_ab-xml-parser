'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    ExprParser = require('./ExprParser'),
    FieldParser = require('./FieldParser')
;

class AttribValueParser extends Parser
{

    static IsStart(c, i, line) {
        return /[a-zA-Z0-9$_]/.test(c) ? 1 : 0;
    }


    constructor(document, attribParser)
    {
        js0.args(arguments, require('../Document'), require('./AttribParser'));
        super(document);

        this.attribParser = attribParser;
        this.value = '';

        this._regExp_Char = /[a-zA-Z0-9\-_]/;
    }

    __read(c, i, line)
    {
        let step;

        step = FieldParser.IsStart(this.document, c, i, line);
        if (step > 0) {
            if (this.value !== '')
                this.attribParser.tagParser.attribs[this.attribParser.name].push(this.value);
            this.value = '';    

            this.document.startParser(new FieldParser(this.document, this));
            return step;
        }

        step = ExprParser.IsStart(this.document.content, i);
        if (step > 0) {
            if (this.value !== '')
                this.attribParser.tagParser.attribs[this.attribParser.name].push(this.value);
            this.value = '';

            this.document.startParser(new ExprParser(this.document, this));
            return step;
        }

        if (c !== '"') {
            this.value += c;
            return 1;
        }

        if (this.value !== '' || 
                this.attribParser.tagParser.attribs[this.attribParser.name].length === 0) {
            this.attribParser.tagParser.attribs[this.attribParser.name].push(this.value);
        }
        this.finish();
        return 1;
    }

}
module.exports = AttribValueParser;