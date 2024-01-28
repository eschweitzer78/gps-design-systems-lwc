"use strict";

import encode from "./mdUrlEncode";
import { decodeHTML } from "./entitiesDecode";

let C_BACKSLASH = 92;

let ENTITY = "&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});";

let TAGNAME = "[A-Za-z][A-Za-z0-9-]*";
let ATTRIBUTENAME = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
let UNQUOTEDVALUE = "[^\"'=<>`\\x00-\\x20]+";
let SINGLEQUOTEDVALUE = "'[^']*'";
let DOUBLEQUOTEDVALUE = '"[^"]*"';
let ATTRIBUTEVALUE =
  "(?:" +
  UNQUOTEDVALUE +
  "|" +
  SINGLEQUOTEDVALUE +
  "|" +
  DOUBLEQUOTEDVALUE +
  ")";
let ATTRIBUTEVALUESPEC = "(?:\\s*=\\s*" + ATTRIBUTEVALUE + ")";
let ATTRIBUTE = "(?:\\s+" + ATTRIBUTENAME + ATTRIBUTEVALUESPEC + "?)";
let OPENTAG = "<" + TAGNAME + ATTRIBUTE + "*\\s*/?>";
let CLOSETAG = "</" + TAGNAME + "\\s*[>]";
let HTMLCOMMENT = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
let PROCESSINGINSTRUCTION = "[<][?][\\s\\S]*?[?][>]";
let DECLARATION = "<![A-Z]+\\s+[^>]*>";
let CDATA = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
let HTMLTAG =
  "(?:" +
  OPENTAG +
  "|" +
  CLOSETAG +
  "|" +
  HTMLCOMMENT +
  "|" +
  PROCESSINGINSTRUCTION +
  "|" +
  DECLARATION +
  "|" +
  CDATA +
  ")";
let reHtmlTag = new RegExp("^" + HTMLTAG);

let reBackslashOrAmp = /[\\&]/;

let ESCAPABLE = "[!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]";

let reEntityOrEscapedChar = new RegExp("\\\\" + ESCAPABLE + "|" + ENTITY, "gi");

let XMLSPECIAL = '[&<>"]';

let reXmlSpecial = new RegExp(XMLSPECIAL, "g");

let unescapeChar = function (s) {
  if (s.charCodeAt(0) === C_BACKSLASH) {
    return s.charAt(1);
  }
  return decodeHTML(s);
};

// Replace entities and backslash escapes with literal characters.
let unescapeString = function (s) {
  if (reBackslashOrAmp.test(s)) {
    return s.replace(reEntityOrEscapedChar, unescapeChar);
  }
  return s;
};

let normalizeURI = function (uri) {
  try {
    return encode(uri);
  } catch (err) {
    return uri;
  }
};

let replaceUnsafeChar = function (s) {
  switch (s) {
    case "&":
      return "&amp;";
    case "<":
      return "&lt;";
    case ">":
      return "&gt;";
    case '"':
      return "&quot;";
    default:
      return s;
  }
};

let escapeXml = function (s) {
  if (reXmlSpecial.test(s)) {
    return s.replace(reXmlSpecial, replaceUnsafeChar);
  }
  return s;
};

export {
  unescapeString,
  normalizeURI,
  escapeXml,
  reHtmlTag,
  OPENTAG,
  CLOSETAG,
  ENTITY,
  ESCAPABLE
};
