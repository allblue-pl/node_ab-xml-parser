'use strict';

const
    js0 = require('js0'),
    htmlEntities = require('html-entities'),

    Parser = require('../Parser'),

    ExprParser = require('./ExprParser'),
    FieldParser = require('./FieldParser'),
    TagParser = require('./TagParser')
;

class TextParser extends Parser
{

    static IsStart(c, i, line) {
        return c === '<' ? 1 : 0;
    }


    constructor(document)
    {
        js0.args(arguments, require('../Document'));
        super(document);

        this.value = null;
        this._htmlEntities = new htmlEntities.AllHtmlEntities();
    }

    __read(c, i, line)
    {
        let step;

        step = TagParser.IsStart(c);
        if (step > 0) {
            if (this.value !== null && this.value !== '') {
                while ([ ' ', "\r", "\n" ].includes(this.value[this.value.length - 1]))
                    this.value = this.value.substring(0, this.value.length - 1);
                if (this.value !== '') {
                    this.document.addNode({
                        type: 'text',
                        value: this._decodeHtml(this.value),
                    });
                }
            }
            
            this.finish();
            return 0;
        }

        if (this.value === null) {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;

            this.value = '';
        }

        step = FieldParser.IsStart(c);
        if (step > 0) {
            if (this.value !== null && this.value !== '') {
                this.document.addNode({
                    type: 'text',
                    value: this._decodeHtml(this.value),
                });
            }
            this.value = '';

            this.document.startParser(new FieldParser(this.document, this));
            return step;
        }

        step = ExprParser.IsStart(this.document.content, i);
        if (step > 0) {
            if (this.value !== null && this.value !== '') {
                this.document.addNode({
                    type: 'text',
                    value: this._decodeHtml(this.value),
                });
            }
            this.value = '';

            this.document.startParser(new ExprParser(this.document, this));
            return step;
        }

        this.value += c;
        return 1;
    }


    _decodeHtml(str)
    {
        return this._htmlEntities.decode(str);
    }

}
module.exports = TextParser;