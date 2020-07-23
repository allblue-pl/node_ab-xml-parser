'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    TagParser = require('./TagParser')
;

class ExprParser extends Parser
{

    static IsStart(content, i)
    {
        if (content.length > i + 1) {
            if (content[i] === '?' && content[i + 1] === '(')
                return 2;
        }

        return 0;
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

        this.quoteOpened = null;
        this.quotes = [ '"', '\'', '`' ];
        for (let quote in this.quotes_Opened)
            this.quotes.push(quote);

        this.bracketsOpened = 0;

        this.value = '';
    }

    __read(c, i, line)
    {
        let step;

        if (this.quoteOpened === null) {
            if (this.quotes.includes(c)) {
                this.quoteOpened = c;
                this.value += c;
                return 1;
            }
        } else {
            if (c === this.quoteOpened && this.document.content[i - 1] !== '\\') {
                this.quoteOpened = null;
                this.value += c;
                return 1;
            }
        }

        if (this.quoteOpened === null) {
            if (c === '(') {
                this.bracketsOpened++;
                this.value += c;
                return 1;
            }

            if (c === ')') {
                if (this.bracketsOpened > 0) {
                    this.bracketsOpened--;
                    this.value += c;
                    return 1;
                }

                if (this.parentParser_Type === 'text') {
                    this.document.addNode({
                        type: 'text',
                        value: '?(' + this.value + ')',
                    });
                } else if (this.parentParser_Type === 'attrib') {
                    this.parentParser.attribParser.tagParser
                            .attribs[this.parentParser.attribParser.name].push(
                            '?(' + this.value + ')');
                }
                this.finish();
                return 1;
            }
        }

        this.value +=c;
        return 1;
    }

}
module.exports = ExprParser;