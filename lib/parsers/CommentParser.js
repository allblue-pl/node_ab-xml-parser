'use strict';

const
    js0 = require('js0'),

    Parser = require('../Parser')
;

class CommentParser extends Parser
{

    static IsStart(content, i) {
        js0.args(arguments, 'string', 'int');

        if (content.length >= i + 4) {
            if (content.substring(i, i + 4) === '<!--')
                return 4;
        }

        return 0;
    }


    constructor(document)
    {
        js0.args(arguments, require('../Document'));
        super(document);

        this.value = '';
    }

    __read(c, i, line)
    {
        let content = this.document.content;

        if (content.length >= i + 3) {
            if (content.substring(i, i + 3) === '-->') {
                while([' ', "\r", "\n"].includes(this.value[this.value.length - 1]))
                    this.value = this.value.substring(0, this.value.length - 1);
                if (this.value !== '') {
                    this.document.addNode({
                        type: 'comment',
                        value: this.value,
                    });
                }

                this.finish();
                return 3;
            }
        }

        if (this.value === '') {
            if (c === ' ' || c === "\r" || c === "\n")
                return 1;
        }

        this.value += c;


        return 1;
    }

}
module.exports = CommentParser;