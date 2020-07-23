'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    TagParser = require('./TagParser')
;

class FieldArgsParser extends Parser
{

    static IsStart(c, i, line) {
        return c === '(' ? 1 : 0;
    }


    constructor(document, fieldParser)
    {
        js0.args(arguments, require('../Document'), require('./FieldParser'));
        super(document);

        this.fieldParser = fieldParser;

        this.args = '';
    }

    __read(c, i, line)
    {
        let step;

        if (c === ')') {
            this.fieldParser.args = this.args;
            this.finish();
            return 1;
        }

        this.args +=c;
        return 1;
    }

}
module.exports = FieldArgsParser;