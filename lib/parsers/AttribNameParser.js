'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser')
;

class AttribNameParser extends Parser
{

    static IsStart(c, i, line) {
        return /[a-zA-Z0-9$_]/.test(c) ? 1 : 0;
    }


    constructor(document, attribParser)
    {
        js0.args(arguments, require('../Document'), require('./AttribParser'));
        super(document);

        this.attribParser = attribParser;
        this.name = '';

        this._regExp_Char = /[a-zA-Z0-9\-_]/;
    }

    __read(c, i, line)
    {
        if (this._regExp_Char.test(c)) {
            this.name += c;
            return 1;
        }

        this.attribParser.name = this.name;
        this.finish();
        return 0;
    }

}
module.exports = AttribNameParser;