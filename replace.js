const disallowedTags = [
    "script",
    "style",
    "svg",
    "meta",
    "input"
];

function disallowed(tag) {
    for (let i = 0; i < disallowedTags.length; i++) {
        if (disallowedTags[i] == tag.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function getTextNodes(node, out) {
    if (node.nodeType === Node.ELEMENT_NODE && disallowed(node.localName))
        return;
    
    if (node.nodeType === Node.TEXT_NODE) {
        out.push(node);
    } else {
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
            getTextNodes(children[i], out);
        }
    }
}

function capitalized(string) {
    return string === string.toUpperCase()
}

const heshe = /\b(h)(e)\s*(?:\/| or )\s*she\b/ig
const hishers = /\b(h)(i)s\s*(?:\/| or )\s*hers?\b/ig
const himher = /\b(h)(i)m\s*(?:\/| or )\s*her\b/ig

const shehe = /\b(s)(h)e\s*(?:\/| or )\s*he\b/ig
const hershis = /\b(h)(e)rs?\s*(?:\/| or )\s*his\b/ig
const herhim = /\b(h)(e)r\s*(?:\/| or )\s*him\b/ig

function replacement(allcaps, onecap, nocaps) {
    return function(_, c1, c2) {
        if (capitalized(c1)) {
            return capitalized(c2) ? allcaps : onecap;
        } else {
            return nocaps;
        }
    };
}

const they = replacement("THEY", "They", "they"); // TODO: reconjugate common words
const their = replacement("THEIR", "Their", "their");
const them = replacement("THEM", "Them", "them");

function fixText(string) {
    return string
        .replace(heshe, they)
        .replace(shehe, they)
        .replace(hishers, their)
        .replace(hershis, their)
        .replace(himher, them)
        .replace(herhim, them);
}

console.log(document)

// Replace all tags when page loads
const nodes = [];
getTextNodes(document, nodes);
for (let i = 0; i < nodes.length; i++) {
    nodes[i].nodeValue = fixText(nodes[i].nodeValue);
}

// Replace all tags text after they are added
// TODO