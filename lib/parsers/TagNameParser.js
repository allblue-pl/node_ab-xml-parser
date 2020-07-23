'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser')
;

class TagNameParser extends Parser
{

    static IsStart(c, i, line) {
        return /[a-zA-Z0-9$_]/.test(c) ? 1 : 0;
    }


    constructor(document, tagParser)
    {
        js0.args(arguments, require('../Document'), require('./TagParser'));
        super(document);

        this.tagParser = tagParser;
        this.name = '';

        this._regExp_Char = /[a-zA-Z0-9$\-_]/;
    }

    __read(c, i, line)
    {
        if (this._regExp_Char.test(c)) {
            this.name += c;
            return 1;
        }

        this.tagParser.name = this.name;
        this.finish();
        return 0;
    }

}
module.exports = TagNameParser;