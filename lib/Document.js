'use strict';

const
    js0 = require('js0'),

    DocumentParser = require('./parsers/DocumentParser')
;

class Document
{

    get nodes() {
        return this.elems[0].children;
    }


    constructor(content)
    {
        this.content = content;
        this.parsers = [
            new DocumentParser(this),
        ];

        this.elems = [{
            type: 'root',
            name: '$root',
            children: [],
        }];

        this.parse();
    }

    parse()
    {
        let i = 0;
        let line = 1;
        while(true) {
            let c = this.content[i];
            let step = 0;

            let activeParser = this.parsers[this.parsers.length - 1];
            step = activeParser.read(c, i, line);
            
            if (step === 0 && this.parsers[this.parsers.length - 1] === activeParser)
                throw new Error(`Parser '${activeParser.constructor.name}' with step 0 created infinite loop.`);

            i += step;
            if (c === '\n')
                line++;

            if (i >= this.content.length)
                break;
        }

        if (this.elems.length > 1)
            throw new Error(`Tag '${this.elems[this.elems.length - 1].name}' not closed.`);

        // this._printTag(this.elems[0]);
    }

    addNode(node)
    {
        this.elems[this.elems.length - 1].children.push(node);

        // console.log('Adding', node);

        if (node.type === 'comment') {
            // Do nothing.
        } else if (node.type === 'text') {
            // Do nothing.
        }  else if (node.type === 'element') {
            this.elems.push(node);
        } else
            throw new Error(`Unknown node type '${node.type}'.`);
    }

    closeElem(tagName, line)
    { 
        js0.args(arguments, 'string', 'int');

        if (this.elems.length > 1) {
            if (tagName === this.elems[this.elems.length - 1].name) {
                this.elems.pop();
                return;
            }
        }

        this.error(`Unexpected close tag '${tagName}'.`, line);
    }

    error(message, line)
    {
        throw new Error('Line: ' + line + '. ' + message);
    }

    finishParser(parser)
    {
        js0.args(arguments, require('./Parser'));

        this.parsers.pop();
    }

    startParser(parser)
    {
        js0.args(arguments, require('./Parser'));

        this.parsers.push(parser);
        // if (parser.read(c, i, line) !== true)
        //     
        // throw new Error('Parser started incorrectly.');
    }


    _printTag(tag, offset = '')
    {
        if (tag.type === 'comment') {
            console.log(offset, '<!-- ' + tag.value + ' -->');
            return;
        }

        if (tag.type === 'text') {
            console.log(offset, '"' + tag.value + '"');
            return;
        }

        if (tag.type === 'element')
            console.log(offset, '#' + tag.name, tag.attribs);
        for (let tag_Child of tag.children)
            this._printTag(tag_Child, offset + '  ');
    }

}
module.exports = Document;