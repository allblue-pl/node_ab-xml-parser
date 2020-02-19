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
            node.value =xmldocChild.val;
        } else if (xmldocChild.name === 'ab-xml-document_comment') {
            node.type = 'comment';
            node.value =xmldocChild.val;
        } else {
            node.type = 'element';

            let nodeName = xmldocChild.name;
            if (nodeName === 'ab-xml-document_dolar')
                nodeName = '$';
                
            node.name = nodeName;

            node.attribs = {};
            for (var name in xmldocChild.attr)
                node.attribs[name] = xmldocChild.attr[name];

            node.children = [];

            this._parse_ParseNodeChildren(node, xmldocChild);
        }
    }

}
module.exports = Document;
