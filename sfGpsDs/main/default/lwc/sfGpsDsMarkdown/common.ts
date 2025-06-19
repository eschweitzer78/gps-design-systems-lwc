"use strict";

/* eslint-disable no-unused-vars */

import encode from "./mdUrlEncode";
import { decodeHTML } from "./entitiesDecode";

const C_BACKSLASH = 92;

export const ENTITY = "&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});";

const TAGNAME = "[A-Za-z][A-Za-z0-9-]*";
const ATTRIBUTENAME = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
const UNQUOTEDVALUE = "[^\"'=<>`\\x00-\\x20]+";
const SINGLEQUOTEDVALUE = "'[^']*'";
const DOUBLEQUOTEDVALUE = '"[^"]*"';
const ATTRIBUTEVALUE =
  "(?:" +
  UNQUOTEDVALUE +
  "|" +
  SINGLEQUOTEDVALUE +
  "|" +
  DOUBLEQUOTEDVALUE +
  ")";
const ATTRIBUTEVALUESPEC = "(?:\\s*=\\s*" + ATTRIBUTEVALUE + ")";
const ATTRIBUTE = "(?:\\s+" + ATTRIBUTENAME + ATTRIBUTEVALUESPEC + "?)";
export const OPENTAG = "<" + TAGNAME + ATTRIBUTE + "*\\s*/?>";
export const CLOSETAG = "</" + TAGNAME + "\\s*[>]";
const HTMLCOMMENT = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
const PROCESSINGINSTRUCTION = "[<][?][\\s\\S]*?[?][>]";
const DECLARATION = "<![A-Z]+\\s+[^>]*>";
const CDATA = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
const HTMLTAG =
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

export const reHtmlTag = new RegExp("^" + HTMLTAG);

const reBackslashOrAmp = /[\\&]/;

export const ESCAPABLE = "[!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]";
const reEntityOrEscapedChar = new RegExp("\\\\" + ESCAPABLE + "|" + ENTITY, "gi");

const XMLSPECIAL = '[&<>"]';
const reXmlSpecial = new RegExp(XMLSPECIAL, "g");

function unescapeChar(s: string) {
  return s.charCodeAt(0) === C_BACKSLASH 
    ? s.charAt(1) 
    : decodeHTML(s);
};

// Replace entities and backslash escapes with literal characters.
export function unescapeString(s: string) {
  return reBackslashOrAmp.test(s) 
    ? s.replace(reEntityOrEscapedChar, unescapeChar) 
    : s;
};

export function normalizeURI(uri: string) {
  try {
    return encode(uri);
  } catch (err) {
    return uri;
  }
};

const replaceUnsafeChar = (s: string): string => {
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

export function escapeXml(s: string): string {
    return reXmlSpecial.test(s) 
      ? s.replace(reXmlSpecial, replaceUnsafeChar) 
      : s;
};
