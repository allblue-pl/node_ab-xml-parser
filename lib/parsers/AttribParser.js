'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    AttribNameParser = require('./AttribNameParser'),
    AttribValueParser = require('./AttribValueParser')
;

class AttribParser extends Parser
{

    static IsStart(c, i, line) {
        return /[a-zA-Z_]/.test(c) ? 1 : 0;
    }


    constructor(document, tagParser)
    {
        js0.args(arguments, require('../Document'), require('./TagParser'));
        super(document);

        this.tagParser = tagParser;

        this.name = null;
        this.afterEqual = false;
        this.afterValue = false;
    }

    __read(c, i, line)
    {
        if (this.name === null) {
            this.document.startParser(new AttribNameParser(this.document, this));
            return 0;
        }

        if (this.name !== null && !this.afterEqual ) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            if (c === '=') {
                this.tagParser.attribs[this.name] = [];

                this.afterEqual = true;
                return 1;
            }

            this.error(`Cannot parse tag '${this.tagParser.name}' attribute '${this.name}'.` +
                    ` Unexpected '${c}'.`, line);
        }

        if (this.name !== null && this.afterEqual && !this.afterValue) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            if (c === '"') {
                this.afterValue = true;
                this.document.startParser(new AttribValueParser(this.document, this));
                return 1;
            }

            this.error(`Cannot parse tag '${this.tagParser.name}' attribute '${this.name}'.` +
                ` Unexpected '${c}'.`, line);
        }

        if (this.name !== null && this.afterValue) {
            this.finish();
            return 0;
        }

        this.error(`Cannot parse character '${c}' in tag.`, line);
    }

}
module.exports = AttribParser;