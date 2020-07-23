'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser'),

    TagParser = require('./TagParser')
;

class ScriptParser extends Parser
{

    constructor(document)
    {
        js0.args(arguments, require('../Document'));
        super(document);

        this.quoteOpened = null;
        this.quotes = [ '"', '\'', '`' ];
        for (let quote in this.quotes_Opened)
            this.quotes.push(quote);

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
            step = TagParser.IsStart(c);
            if (step > 0) {
                this.document.addNode({
                    type: 'text',
                    value: this.value,
                });
                this.finish();
                return 0;
            }
        }

        this.value +=c;
        return 1;
    }

}
module.exports = ScriptParser;