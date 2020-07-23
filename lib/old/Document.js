'use strict';

const 
    xmldoc = require('xmldoc')
;

class Document
{

    get nodes() { 
        return this._nodes; 
    }


    constructor(html)
    {
        this._nodes = [];

        html = this._replaceSpecials(html);
        let xmldocDocument = new xmldoc.XmlDocument(html);
        this._parse(xmldocDocument);
    }


    _replaceSpecials(html)
    {
        /* Find replace text with `<xml-document-text` nodes. */
        //var regexp = new RegExp(/>([ \t\r\n]*)(.*?)([ \t\r\n]*)</gs);

        /* Text to nodes. */
        /* Comments to text nodes. */
        var regexp = /<!--([\s\S]*?)-->/gm;
        let newHtml = '';
        let htmlStart = 0;
        while(true) {
            var match = regexp.exec(html);
            if (!match)
                break;

            var escaped = match[1]
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/\//g, "&#047;");

            newHtml += html.substring(htmlStart, match.index);
            newHtml += '<ab-xml-document_comment>' + 'bla' + '</ab-xml-document_comment>';
            htmlStart = match.index + match[0].length;
            // html = html.replace(match[0], '<ab-xml-document_comment>' +
            //         escaped + '</ab-xml-document_comment>');
        }
        newHtml += html.substring(htmlStart);
        html = newHtml;

        /* Escape expressions */
        html = this._replaceSpecials_EscapeExpressions(html);

        /* Replace text with text nodes. */
        html = html.replace(/(>|^)([ \t\r\n]*)([\s\S]*?)([ \t\r\n]*)(<|$)/g,
                '$1$2<ab-xml-document_text>$3</ab-xml-document_text>$4$5');

        html = html.replace(
                /<ab-xml-document_text><\/ab-xml-document_text>/mg, '');

        /* Replace virtual nodes */
        html = html.replace(/< *\$ /g, '<ab-xml-document_dolar ');
        html = html.replace(/<\/ *\$ *>/g, '</ab-xml-document_dolar>');

        html = '<ab-xml-document>' + html + '</ab-xml-document>';

        return html;
    }

    _parse(xmldocDocument)
    {
        this._parse_ParseNodeChildren(null, xmldocDocument);
    }

    _parse_ParseNodeChildren(parentNode, xmldocChild)
    {
        if (!('children' in xmldocChild))
            return;

        for (var i = 0; i < xmldocChild.children.length; i++)
            this._parse_ParseNode(parentNode, xmldocChild.children[i]);
    }

    _parse_ParseNode(parentNode, xmldocChild)
    {
        if (!('name' in xmldocChild))
            return;

        var node = {};

        if (parentNode === null)
            this._nodes.push(node);
        else
            parentNode.children.push(node);

        if (xmldocChild.name === 'ab-xml-document_text') {
            node.type = 'text';
            node.value = this._parse_UnescapeExpressions(xmldocChild.val);
        } else if (xmldocChild.name === 'ab-xml-document_comment') {
            node.type = 'comment';
            node.value = this._parse_UnescapeExpressions(xmldocChild.val)   ;
        } else {
            node.type = 'element';

            let nodeName = xmldocChild.name;
            if (nodeName === 'ab-xml-document_dolar')
                nodeName = '$';
                
            node.name = nodeName;

            node.attribs = {};
            for (var name in xmldocChild.attr)
                node.attribs[name] = this._parse_UnescapeExpressions(
                        xmldocChild.attr[name]);

            node.children = [];

            this._parse_ParseNodeChildren(node, xmldocChild);
        }
    }

    _parse_UnescapeExpressions(content)
    {
        let expression = content
            .replace(/ab-xml-document_amp/g, '&')
            .replace(/ab-xml-document_lt/g, '<')
            .replace(/ab-xml-document_gt/g, '>')
            .replace(/ab-xml-document_quot/g, '"')
            .replace(/ab-xml-document_#039/g, '\'');

        return expression;
    }

    _replaceSpecials_EscapeExpressions(content)
    {
       let p = new (require('./ab-brackets-parser').Parser)({
            tags: ['?(', ')' ],
            innerTags: [
                [ '(', ')' ],
            ],
            innerQuotes: [
                [ '\'', '\'' ],
                [ '"', '"' ],
                [ '`', '`' ],
            ],
            innerQuotesEscapers: [
                '\\',
            ],
        });
        p.parse(content);

        let r = new RegExp('\\?\\(((\\s|\\S)+)\\)','g');
        let offset = 0;
        let content_Escaped = '';
        while(true) {
            let match = r.exec(content);
            if (match === null)
                break;

            let expression = match[1]
                .replace(/&/g, "ab-xml-document_amp")
                .replace(/</g, "ab-xml-document_lt")
                .replace(/>/g, "ab-xml-document_gt")
                .replace(/"/g, "ab-xml-document_quot")
                .replace(/'/g, "ab-xml-document_#039");

            content_Escaped += content.substring(offset, match.index);
            content_Escaped += '?(' + expression + ')';

            offset = match.index + match[0].length;
        }

        content_Escaped += content.substring(offset);

        return content_Escaped;
    }

}
module.exports = Document;
