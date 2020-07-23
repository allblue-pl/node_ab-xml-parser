'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    FieldArgsParser = require('./FieldArgsParser'),
    TagParser = require('./TagParser')
;

class FieldParser extends Parser
{

    static IsStart(c, i, line) {
        return c === '$' ? 1 : 0;
    }


    constructor(document, parser)
    {
        js0.args(arguments, require('../Document'), require('../Parser'));
        super(document);

        this.parentParser = parser;
        this.parentParser_Type = null;
        if (js0.type(parser, require('./TextParser')))
            this.parentParser_Type = 'text';
        else if (js0.type(parser, require('./AttribValueParser')))
            this.parentParser_Type = 'attrib'; 

        js0.assert(this.parentParser_Type !== null, 
                `Invalid parser type: ${parser.constructor.name}.`);

        this.name = '';
        this.args = null;

        this.escaped = false;
    
        this.regexp = /[a-zA-Z0-9_.]/;
    }

    __read(c, i, line)
    {
        let step;

        if (this.name === '') {
            if (c === '{') {
                this.escaped = true;
                return 1;
            }
        }

        if (this.regexp.test(c)) {
            this.name += c;
            return 1;
        }

        if (this.name !== '') {
            if (c === '(') {
                this.document.startParser(new FieldArgsParser(this.document, this));
                return 1;
            }
        }

        if (this.escaped) {
            if (c !== '}')
                this.error('Wrong field name format.', line);

            if (this.parentParser_Type === 'text') {
                this.document.addNode({
                    type: 'text',
                    value: this._getField(),
                });
            } else if (this.parentParser_Type === 'attrib') {
                this.parentParser.attribParser.tagParser
                        .attribs[this.parentParser.attribParser.name].push(this._getField());
            }

            this.finish();
            return 1;
        }

        if (this.parentParser_Type === 'text') {
            this.document.addNode({
                type: 'text',
                value: this._getField(),
            });
        } else if (this.parentParser_Type === 'attrib') {
            this.parentParser.attribParser.tagParser
                .attribs[this.parentParser.attribParser.name].push(this._getField());
        }

        this.finish();
        return 0;
    }


    _getField()
    {
        return '$' + this.name + (this.args === null ? '' : '(' + this.args + ')');
    }

}
module.exports = FieldParser;