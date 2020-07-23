'use strict';

const
    js0 = require('js0')
;

class Parser
{

    constructor(document)
    {
        js0.args(arguments, require('./Document'));

        this.document = document;
    }

    error(message, line)
    {
        throw new Error('Line: ' + line + '. ' + message);
    }

    finish()
    {
        this.document.finishParser(this);
    }

    read(c, i, line)
    {
        // console.log(line, i, c, this.constructor.name);

        return this.__read(c, i, line);
            // return true;

        // for (let j = 0; j < this.innerParsers.length; j++) {
        //     let innerParser = this.innerParsers[j];
        //     if (innerParser.check(c, i, line)) {
        //         this.document.pushParser(innerParser);
        //         return innerParser.read(c, i, line);
        //     }
        // }

        // return false;
    }


    __check(c, i, line) { js0.virtual(this); }
    __read(c, i, line) { js0.virtual(this); }

}
module.exports = Parser;