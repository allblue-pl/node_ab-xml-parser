'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    FieldArgsParser = require('./FieldArgsParser'),
    TagParser = require('./TagParser')
;

class FieldParser extends Parser
{

    static IsStart(document, c, i, line) {
        if (c !== '$')
            return 0;

        if (i >= 1) {
            if (document.content[i - 1] === '\\')
                return 0;
        }

        return 1;
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
        this.bracketsOpened = 0;

        this.escaped = false;
    
        this.regexp = /[a-zA-Z0-9_.]/;
    }

    __read(c, i, line)
    {
        let step;

        if (this.name === '' && !this.escaped) {
            if (i + 2 < this.document.content.length) {
                if (this.document.content[i + 2] === '{') {
                    this.escaped = true;
                    return 1;
                }
            }

            if (i + 1 < this.document.content.length) {
                if (this.document.content[i + 1] === '{') {
                    this.bracketsOpened++;
                    this.name += '{';
                    return 1;
                }
            }

            if (c === '{') {
                this.escaped = true;
                return 1;
            }
        }

        if (c === '{') {
            this.bracketsOpened++;
            this.name += '{';
            return 1;
        }

        if (c === '}') {
            if (this.bracketsOpened > 0) {
                this.bracketsOpened--;
                this.name += '}';
                return 1;
            }
        }

        if (this.regexp.test(c)) {
            this.name += c;

            if (i + 1 >= this.document.content.length && !this.escaped) {
                if (this.name !== '') {
                    this.content.addNode({
                        type: 'text',
                        value: this._getField(),
                    });
                    this.finish();
                }
            }

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
                        .attribs[this.parentParser.attribParser.name].push(
                        this._getField());
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
        return '$' + (this.escaped ? '{' : '') + this.name + 
                (this.args === null ? '' : '(' + this.args + ')') + 
                (this.escaped ? '}' : '');
    }

}
module.exports = FieldParser;