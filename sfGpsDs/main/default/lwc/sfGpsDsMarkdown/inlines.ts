/* eslint-disable no-cond-assign */

import { Node } from "./node";
import * as common from "./common";
import fromCodePoint from "./fromCodePoint";
import { decodeHTML } from "./entitiesDecode";
import { ParserOptions } from "./blocks";

const normalizeURI = common.normalizeURI;
const unescapeString = common.unescapeString;

// Constants for character codes:

const C_NEWLINE = 10;
const C_ASTERISK = 42;
const C_UNDERSCORE = 95;
const C_BACKTICK = 96;
const C_OPEN_BRACKET = 91;
const C_CLOSE_BRACKET = 93;
const C_LESSTHAN = 60;
const C_BANG = 33;
const C_BACKSLASH = 92;
const C_AMPERSAND = 38;
const C_OPEN_PAREN = 40;
const C_CLOSE_PAREN = 41;
const C_COLON = 58;
const C_SINGLEQUOTE = 39;
const C_DOUBLEQUOTE = 34;

// Some regexps used in inline parser:

const ESCAPABLE = common.ESCAPABLE;
const ESCAPED_CHAR = "\\\\" + ESCAPABLE;

const ENTITY = common.ENTITY;
const reHtmlTag = common.reHtmlTag;

const rePunctuation = new RegExp(
  /^[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/
);

const reLinkTitle = new RegExp(
  '^(?:"(' +
    ESCAPED_CHAR +
    '|[^"\\x00])*"' +
    "|" +
    "'(" +
    ESCAPED_CHAR +
    "|[^'\\x00])*'" +
    "|" +
    "\\((" +
    ESCAPED_CHAR +
    "|[^()\\x00])*\\))"
);

/* eslint-disable */

const reLinkDestinationBraces = /^(?:<(?:[^<>\n\\\x00]|\\.)*>)/;
const reEscapable = new RegExp("^" + ESCAPABLE);
const reEntityHere = new RegExp("^" + ENTITY, "i");
const reTicks = /`+/;
const reTicksHere = /^`+/;
const reEllipses = /\.\.\./g;
const reDash = /--+/g;
const reEmailAutolink =
  /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
const reAutolink = /^<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^<>\x00-\x20]*>/i;
const reSpnl = /^ *(?:\n *)?/;
const reWhitespaceChar = /^[ \t\n\x0b\x0c\x0d]/;
const reUnicodeWhitespaceChar = /^\s/;
const reFinalSpace = / *$/;
const reInitialSpace = /^ */;
const reSpaceAtEndOfLine = /^ *(?:\n|$)/;
const reLinkLabel = /^\[(?:[^\\\[\]]|\\.){0,1000}\]/s;

/* eslint-enable */

// Matches a string of non-special characters.
const reMain = /^[^\n`[\]\\!<&*_'"]+/m;

function text(s: string): Node {
  let node = new Node("text");
  node._literal = s;
  return node;
};

// normalize a reference in reference link (remove []s, trim,
// collapse internal space, unicode case fold.
// See commonmark/commonmark.js#168.

function normalizeReference(string: string): string {
  return string
    .slice(1, string.length - 1)
    .trim()
    .replace(/[ \t\r\n]+/, " ")
    .toLowerCase()
    .toUpperCase();
};

// INLINE PARSER

// These are methods of an InlineParser object, defined below.
// An InlineParser keeps track of a subject (a string to be
// parsed) and a position in that subject.

function removeDelimitersBetween(bottom: Delimiters, top: Delimiters): void {
  if (bottom.next !== top) {
    bottom.next = top;
    top.previous = bottom;
  }
};

interface Delimiters {
  cc: number,
  numdelims: number,
  origdelims: number,
  node: Node,
  previous?: Delimiters,
  next?: Delimiters,
  canOpen: boolean,
  canClose: boolean
};

interface Brackets {
  node: Node,
  previous?: Brackets,
  previousDelimiter?: Delimiters,
  index: number,
  image: boolean,
  active: boolean,
  bracketAfter?: boolean
}

interface Reference { 
  destination: string, 
  title: string 
}

type ReferenceMap = { [key: string]: Reference }

interface InlineParserOptions extends ParserOptions {
  smart?: boolean
}

// The InlineParser object.
class InlineParser {
  subject: string;
  delimiters?: Delimiters;
  brackets?: Brackets;
  pos: number;
  refmap: ReferenceMap;
  options: InlineParserOptions;

  constructor(options?: InlineParserOptions) {
    this.subject = "";
    this.delimiters = undefined; // used by handleDelim method
    this.brackets = undefined;
    this.pos = 0;
    this.refmap = {};
    this.options = options || {};
  };


  // If re matches at current position in the subject, advance
  // position in subject and return the match; otherwise return null.
  match(re: RegExp): string | null {
    let m = re.exec(this.subject.slice(this.pos));

    if (m == null) {
      return null;
    }

    this.pos += m.index + m[0].length;
    return m[0];
  };

  // Returns the code for the character at the current subject position, or -1
  // there are no more characters.
  peek(): number {
    return this.pos < this.subject.length 
      ? this.subject.charCodeAt(this.pos)
      : -1;
  };

  // Parse zero or more space characters, including at most one newline
  spnl(): boolean {
    this.match(reSpnl);

    return true;
  };

  // All of the parsers below try to match something at the current position
  // in the subject.  If they succeed in matching anything, they
  // return the inline matched, advancing the subject.

  // Attempt to parse backticks, adding either a backtick code span or a
  // literal sequence of backticks.
  parseBackticks(block: Node): boolean {
    let ticks = this.match(reTicksHere);

    if (ticks == null) {
      return false;
    }

    let afterOpenTicks = this.pos;
    let matched: string | null;
    let node: Node;
    let contents: string;

    while ((matched = this.match(reTicks)) !== null) {
      if (matched === ticks) {
        node = new Node("code");
        contents = this.subject
          .slice(afterOpenTicks, this.pos - ticks.length)
          .replace(/\n/gm, " ");

        if (
          contents.length > 0 &&
          contents.match(/[^ ]/) !== null &&
          contents[0] === " " &&
          contents[contents.length - 1] === " "
        ) {
          node._literal = contents.slice(1, contents.length - 1);
        } else {
          node._literal = contents;
        }

        block.appendChild(node);
        return true;
      }
    }

    // If we got here, we didn't match a closing backtick sequence.
    this.pos = afterOpenTicks;
    block.appendChild(text(ticks));

    return true;
  };

  // Parse a backslash-escaped special character, adding either the escaped
  // character, a hard line break (if the backslash is followed by a newline),
  // or a literal backslash to the block's children.  Assumes current character
  // is a backslash.
  parseBackslash(block: Node): boolean {
    let subj = this.subject;
    let node: Node;

    this.pos += 1;

    if (this.peek() === C_NEWLINE) {
      this.pos += 1;
      node = new Node("linebreak");
      block.appendChild(node);
    } else if (reEscapable.test(subj.charAt(this.pos))) {
      block.appendChild(text(subj.charAt(this.pos)));
      this.pos += 1;
    } else {
      block.appendChild(text("\\"));
    }

    return true;
  };


  // Add open bracket to delimiter stack and add a text node to block's children.

  parseOpenBracket(block: Node): boolean {
    let startpos = this.pos;
    this.pos += 1;

    let node = text("[");
    block.appendChild(node);

    // Add entry to stack for this opener
    this.addBracket(node, startpos, false);

    return true;
  };

  // IF next character is [, and ! delimiter to delimiter stack and
  // add a text node to block's children.  Otherwise just add a text node.

  parseBang(block: Node): boolean {
    let startpos = this.pos;
    this.pos += 1;

    if (this.peek() === C_OPEN_BRACKET) {
      this.pos += 1;

      let node = text("![");
      block.appendChild(node);

      // Add entry to stack for this opener
      this.addBracket(node, startpos + 1, true);
    } else {
      block.appendChild(text("!"));
    }

    return true;
  };

  // Try to match close bracket against an opening in the delimiter
  // stack.  Add either a link or image, or a plain [ character,
  // to block's children.  If there is a matching delimiter,
  // remove it from the delimiter stack.

  parseCloseBracket(block: Node): boolean {
    let startpos: number;
    let dest: string | null = null;
    let title: string | null = null;
    let matched: boolean = false;
    let reflabel: string | null = null;
    let opener: Brackets | undefined;

    this.pos += 1;
    startpos = this.pos;

    // get last [ or ![
    opener = this.brackets;

    if (opener == null) {
      // no matched opener, just return a literal
      block.appendChild(text("]"));
      return true;
    }

    if (!opener.active) {
      // no matched opener, just return a literal
      block.appendChild(text("]"));
      // take opener off brackets stack
      this.removeBracket();

      return true;
    }

    // If we got here, open is a potential opener
    const is_image = opener.image;

    // Check to see if we have a link/image

    let savepos = this.pos;

    // Inline link?
    if (this.peek() === C_OPEN_PAREN) {
      this.pos++;

      if (
        this.spnl() &&
        (dest = this.parseLinkDestination()) != null &&
        this.spnl() &&
        // make sure there's a space before the title:
        ((reWhitespaceChar.test(this.subject.charAt(this.pos - 1)) &&
          (title = this.parseLinkTitle())) ||
          true) &&
        this.spnl() &&
        this.peek() === C_CLOSE_PAREN
      ) {
        this.pos += 1;
        matched = true;
      } else {
        this.pos = savepos;
      }
    }

    if (!matched) {
      // Next, see if there's a link label
      let beforelabel = this.pos;
      let n = this.parseLinkLabel();

      if (n > 2) {
        reflabel = this.subject.slice(beforelabel, beforelabel + n);
      } else if (!opener.bracketAfter) {
        // Empty or missing second label means to use the first label as the reference.
        // The reference must not contain a bracket. If we know there's a bracket, we don't even bother checking it.
        reflabel = this.subject.slice(opener.index, startpos);
      }

      if (n === 0) {
        // If shortcut reference link, rewind before spaces we skipped.
        this.pos = savepos;
      }

      if (reflabel) {
        // lookup rawlabel in refmap
        let link = this.refmap[normalizeReference(reflabel)];

        if (link) {
          dest = link.destination;
          title = link.title;
          matched = true;
        }
      }
    }

    if (matched) {
      let node = new Node(is_image ? "image" : "link");
      node._destination = dest;
      node._title = title || "";

      let tmp: Node | undefined, next: Node | undefined;
      tmp = opener.node._next;

      while (tmp) {
        next = tmp._next;
        tmp.unlink();
        node.appendChild(tmp);
        tmp = next;
      }

      block.appendChild(node);
      this.processEmphasis(opener.previousDelimiter);
      this.removeBracket();
      opener.node.unlink();

      // We remove this bracket and processEmphasis will remove later delimiters.
      // Now, for a link, we also deactivate earlier link openers.
      // (no links in links)
      if (!is_image) {
        opener = this.brackets;

        while (opener != null) {
          if (!opener.image) {
            opener.active = false; // deactivate this opener
          }
          opener = opener.previous;
        }
      }

      return true;
    }
    // no match

    this.removeBracket(); // remove this opener from stack
    this.pos = startpos;
    block.appendChild(text("]"));

    return true;
  };

  addBracket(node: Node, index: number, image: boolean): void {
    if (this.brackets != null) {
      this.brackets.bracketAfter = true;
    }

    this.brackets = {
      node: node,
      previous: this.brackets,
      previousDelimiter: this.delimiters,
      index: index,
      image: image,
      active: true
    };
  };

  removeBracket(): void {
    this.brackets = this.brackets 
      ? (this.brackets as Brackets).previous
      : undefined;
  };

  // Parse a newline.  If it was preceded by two spaces, return a hard
  // line break; otherwise a soft line break.

  parseNewline(block: Node): boolean {
    this.pos += 1; // assume we're at a \n
    // check previous node for trailing spaces
    let lastc = block._lastChild;
    if (
      lastc &&
      lastc.type === "text" &&
      lastc._literal[lastc._literal.length - 1] === " "
    ) {
      let hardbreak = lastc._literal[lastc._literal.length - 2] === " ";
      lastc._literal = lastc._literal.replace(reFinalSpace, "");
      block.appendChild(new Node(hardbreak ? "linebreak" : "softbreak"));
    } else {
      block.appendChild(new Node("softbreak"));
    }
    this.match(reInitialSpace); // gobble leading spaces in next line
    return true;
  };


  // Attempt to parse an entity.
  parseEntity(block: Node): boolean {
    const m = this.match(reEntityHere);

    if (m) block.appendChild(text(decodeHTML(m)));
    return !!m;
  };

  // Parse a run of ordinary characters, or a single character with
  // a special meaning in markdown, as a plain string.

  parseString(block: Node): boolean {
    const m = this.match(reMain);

    if (m) {
      if (this.options.smart) {
        block.appendChild(
          text(
            m.replace(reEllipses, "\u2026").replace(reDash, function (chars) {
              let enCount = 0;
              let emCount = 0;

              if (chars.length % 3 === 0) {
                // If divisible by 3, use all em dashes
                emCount = chars.length / 3;
              } else if (chars.length % 2 === 0) {
                // If divisible by 2, use all en dashes
                enCount = chars.length / 2;
              } else if (chars.length % 3 === 2) {
                // If 2 extra dashes, use en dash for last 2; em dashes for rest
                enCount = 1;
                emCount = (chars.length - 2) / 3;
              } else {
                // Use en dashes for last 4 hyphens; em dashes for rest
                enCount = 2;
                emCount = (chars.length - 4) / 3;
              }

              return "\u2014".repeat(emCount) + "\u2013".repeat(enCount);
            })
          )
        );
      } else {
        block.appendChild(text(m));
      }
    }

    return !!m;
  };

  // Parse the next inline element in subject, advancing subject position.
  // On success, add the result to block's children and return true.
  // On failure, return false.

  parseInline(block: Node): boolean {
    let res = false;
    let c = this.peek();

    if (c === -1) {
      return false;
    }

    switch (c) {
      case C_NEWLINE:
        res = this.parseNewline(block);
        break;

      case C_BACKSLASH:
        res = this.parseBackslash(block);
        break;

      case C_BACKTICK:
        res = this.parseBackticks(block);
        break;

      case C_ASTERISK:
      case C_UNDERSCORE:
        res = this.handleDelim(c, block);
        break;

      case C_SINGLEQUOTE:
      case C_DOUBLEQUOTE:
        res = !!this.options.smart && this.handleDelim(c, block);
        break;
        
      case C_OPEN_BRACKET:
        res = this.parseOpenBracket(block);
        break;

      case C_BANG:
        res = this.parseBang(block);
        break;

      case C_CLOSE_BRACKET:
        res = this.parseCloseBracket(block);
        break;

      case C_LESSTHAN:
        res = this.parseAutolink(block) || this.parseHtmlTag(block);
        break;

      case C_AMPERSAND:
        res = this.parseEntity(block);
        break;

      default:
        res = this.parseString(block);
        break;
    }

    if (!res) {
      this.pos += 1;
      block.appendChild(text(fromCodePoint(c)));
    }

    return true;
  };

  // Attempt to parse a link reference, modifying refmap.

  parseReference(s: string, refmap: ReferenceMap): number {
    this.subject = s;
    this.pos = 0;
    let rawlabel : string;
    let dest: string | null;
    let title: string | null = null;
    let matchChars: number;
    let startpos = this.pos;

    // label:
    matchChars = this.parseLinkLabel();
    if (matchChars === 0) {
      return 0;
    }

    rawlabel = this.subject.substring(0, matchChars);

    // colon:
    if (this.peek() === C_COLON) {
      this.pos++;
    } else {
      this.pos = startpos;
      return 0;
    }

    //  link url
    this.spnl();

    dest = this.parseLinkDestination();
    if (dest == null) {
      this.pos = startpos;
      return 0;
    }

    let beforetitle = this.pos;
    this.spnl();

    if (this.pos !== beforetitle) {
      title = this.parseLinkTitle();
    }

    if (title == null) {
      title = "";
      // rewind before spaces
      this.pos = beforetitle;
    }

    // make sure we're at line end:
    let atLineEnd = true;

    if (this.match(reSpaceAtEndOfLine) == null) {
      if (title === "") {
        atLineEnd = false;
      } else {
        // the potential title we found is not at the line end,
        // but it could still be a legal link reference if we
        // discard the title
        title = "";
        // rewind before spaces
        this.pos = beforetitle;
        // and instead check if the link URL is at the line end
        atLineEnd = this.match(reSpaceAtEndOfLine) !== null;
      }
    }

    if (!atLineEnd) {
      this.pos = startpos;
      return 0;
    }

    let normlabel = normalizeReference(rawlabel);
    if (normlabel === "") {
      // label must contain non-whitespace characters
      this.pos = startpos;
      return 0;
    }

    if (!refmap[normlabel]) {
      refmap[normlabel] = { destination: dest, title: title };
    }

    return this.pos - startpos;
  };

  // Attempt to parse an autolink (URL or email in pointy brackets).
  parseAutolink(block: Node): boolean {
    let m: string | null;
    let dest: string;
    let node: Node;

    if (m = this.match(reEmailAutolink)) {
      dest = m.slice(1, m.length - 1);
      node = new Node("link");
      node._destination = normalizeURI("mailto:" + dest);
      node._title = "";
      node.appendChild(text(dest));
      block.appendChild(node);
      return true;
    } else if (m = this.match(reAutolink)) {
      dest = m.slice(1, m.length - 1);
      node = new Node("link");
      node._destination = normalizeURI(dest);
      node._title = "";
      node.appendChild(text(dest));
      block.appendChild(node);
      return true;
    }

    return false;
  };

  // Attempt to parse a raw HTML tag.

  parseHtmlTag(block: Node): boolean {
    const m = this.match(reHtmlTag);

    if (m == null) {
      return false;
    }

    let node = new Node("html_inline");

    node._literal = m;
    block.appendChild(node);

    return true;
  };

  // Scan a sequence of characters with code cc, and return information about
  // the number of delimiters and whether they are positioned such that
  // they can open and/or close emphasis or strong emphasis.  A utility
  // function for strong/emph parsing.

  scanDelims(cc: number) {
    let numdelims = 0;
    let charBefore: string, charAfter: string, ccAfter: number;
    let startpos = this.pos;
    let left_flanking, right_flanking, canOpen: boolean, canClose: boolean;
    let afterIsWhitespace: boolean,
      afterIsPunctuation: boolean,
      beforeIsWhitespace: boolean,
      beforeIsPunctuation: boolean;

    if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
      numdelims++;
      this.pos++;
    } else {
      while (this.peek() === cc) {
        numdelims++;
        this.pos++;
      }
    }

    if (numdelims === 0) {
      return null;
    }

    charBefore = startpos === 0 ? "\n" : this.subject.charAt(startpos - 1);

    ccAfter = this.peek();
    charAfter = ccAfter === -1 ? "\n" : fromCodePoint(ccAfter);
    afterIsWhitespace = reUnicodeWhitespaceChar.test(charAfter);
    afterIsPunctuation = rePunctuation.test(charAfter);
    beforeIsWhitespace = reUnicodeWhitespaceChar.test(charBefore);
    beforeIsPunctuation = rePunctuation.test(charBefore);

    left_flanking =
      !afterIsWhitespace &&
      (!afterIsPunctuation || beforeIsWhitespace || beforeIsPunctuation);
    right_flanking =
      !beforeIsWhitespace &&
      (!beforeIsPunctuation || afterIsWhitespace || afterIsPunctuation);

    if (cc === C_UNDERSCORE) {
      canOpen = left_flanking && (!right_flanking || beforeIsPunctuation);
      canClose = right_flanking && (!left_flanking || afterIsPunctuation);
    } else if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
      canOpen = left_flanking && !right_flanking;
      canClose = right_flanking;
    } else {
      canOpen = left_flanking;
      canClose = right_flanking;
    }
    this.pos = startpos;

    return {  
      numdelims, 
      canOpen, 
      canClose 
    };
  };


  // Handle a delimiter marker for emphasis or a quote.
  handleDelim(cc: number, block: Node): boolean {
    let res = this.scanDelims(cc);

    if (!res) {
      return false;
    }

    let numdelims = res.numdelims;
    let startpos = this.pos;
    let contents: string;

    this.pos += numdelims;

    if (cc === C_SINGLEQUOTE) {
      contents = "\u2019";
    } else if (cc === C_DOUBLEQUOTE) {
      contents = "\u201C";
    } else {
      contents = this.subject.slice(startpos, this.pos);
    }

    let node = text(contents);

    block.appendChild(node);

    // Add entry to stack for this opener
    if (
      (res.canOpen || res.canClose) &&
      (this.options.smart || (cc !== C_SINGLEQUOTE && cc !== C_DOUBLEQUOTE))
    ) {
      this.delimiters = {
        cc: cc,
        numdelims: numdelims,
        origdelims: numdelims,
        node: node,
        previous: this.delimiters,
        next: undefined,
        canOpen: res.canOpen,
        canClose: res.canClose
      };

      if (this.delimiters.previous != null) {
        this.delimiters.previous.next = this.delimiters;
      }
    }

    return true;
  };

  // Attempt to parse link title (sans quotes), returning the string
  // or null if no match.
  parseLinkTitle(): string | null {
    const title = this.match(reLinkTitle);

    // chop off quotes from title and unescape:
    return title == null 
      ? null 
      : unescapeString(title.substring(1, title.length - 1));
  };

  // Attempt to parse link destination, returning the string or
  // null if no match.

  parseLinkDestination(): string | null {
    let res = this.match(reLinkDestinationBraces);

    if (res == null) {
      if (this.peek() === C_LESSTHAN) {
        return null;
      }

      // TODO handrolled parser; res should be null or the string
      let savepos = this.pos;
      let openparens = 0;
      let c: number;

      while ((c = this.peek()) !== -1) {
        if (
          c === C_BACKSLASH &&
          reEscapable.test(this.subject.charAt(this.pos + 1))
        ) {
          this.pos += 1;

          if (this.peek() !== -1) {
            this.pos += 1;
          }
        } else if (c === C_OPEN_PAREN) {
          this.pos += 1;
          openparens += 1;
        } else if (c === C_CLOSE_PAREN) {
          if (openparens < 1) {
            break;
          } else {
            this.pos += 1;
            openparens -= 1;
          }
        } else if (reWhitespaceChar.exec(fromCodePoint(c)) !== null) {
          break;
        } else {
          this.pos += 1;
        }
      }

      if (this.pos === savepos && c !== C_CLOSE_PAREN) {
        return null;
      }

      if (openparens !== 0) {
        return null;
      }

      res = this.subject.substr(savepos, this.pos - savepos);
      return normalizeURI(unescapeString(res));
    }

    // chop off surrounding <..>:
    return normalizeURI(unescapeString(res.substring(1, res.length - 1)));
  };


  // Attempt to parse a link label, returning number of characters parsed.
  parseLinkLabel(): number {
    let m = this.match(reLinkLabel);
    return (m == null || m.length > 1001) ? 0 : m.length;
  };

  // Parse string content in block into inline children,
  // using refmap to resolve references.

  parse(block: Node): void {
    this.subject = (block._string_content as string).trim();
    this.pos = 0;
    this.delimiters = undefined;
    this.brackets = undefined;

    /* eslint-disable */
    while (this.parseInline(block)) {}

    /* eslint-enable */
    block._string_content = undefined; // allow raw string to be garbage collected
    this.processEmphasis(undefined);
  };


  processEmphasis(
    stackBottom: Delimiters | undefined
  ): void {
    let opener: Delimiters | undefined;
    let closer: Delimiters | undefined;
    let oldCloser: Delimiters;
    let openerInl: Node, closerInl: Node;
    let tempstack: Delimiters | undefined;
    let useDelims: number;
    let tmp: Node | undefined, next: Node | undefined;
    let openerFound: boolean;
    let openersBottom: Array<Array<Delimiters | undefined>> = [[], [], []];
    let oddMatch = false;

    for (let i = 0; i < 3; i++) {
      openersBottom[i][C_UNDERSCORE] = stackBottom;
      openersBottom[i][C_ASTERISK] = stackBottom;
      openersBottom[i][C_SINGLEQUOTE] = stackBottom;
      openersBottom[i][C_DOUBLEQUOTE] = stackBottom;
    }

    // find first closer above stackBottom:
    closer = this.delimiters;

    while (
      closer != null && 
      (closer as Delimiters).previous !== stackBottom
    ) {
      closer = (closer as Delimiters).previous;
    }

    // move forward, looking for closers, and handling each
    while (closer != null) {
      let closercc = (closer as Delimiters).cc;

      if (!(closer as Delimiters).canClose) {
        closer = (closer as Delimiters).next;
      } else {
        // found emphasis closer. now look back for first matching opener:
        opener = (closer as Delimiters).previous;
        openerFound = false;

        while (
          opener != null &&
          opener !== stackBottom &&
          opener !== openersBottom[(closer as Delimiters).origdelims % 3][closercc]
        ) {
          oddMatch =
            ((closer as Delimiters).canOpen || opener.canClose) &&
            (closer as Delimiters).origdelims % 3 !== 0 &&
            (opener.origdelims + (closer as Delimiters).origdelims) % 3 === 0;

          if (opener.cc === (closer as Delimiters).cc && opener.canOpen && !oddMatch) {
            openerFound = true;
            break;
          }

          opener = opener.previous;
        }

        oldCloser = closer as Delimiters;

        if (
          closercc === C_ASTERISK || 
          closercc === C_UNDERSCORE
        ) {
          if (!openerFound) {
            closer = (closer as Delimiters).next;
          } else {
            // calculate actual number of delimiters used from closer
            useDelims = (closer as Delimiters).numdelims >= 2 && (opener as Delimiters).numdelims >= 2 ? 2 : 1;

            openerInl = (opener as Delimiters).node;
            closerInl = (closer as Delimiters).node;

            // remove used delimiters from stack elts and inlines
            (opener as Delimiters).numdelims -= useDelims;
            (closer as Delimiters).numdelims -= useDelims;
            openerInl._literal = openerInl._literal.slice(
              0,
              openerInl._literal.length - useDelims
            );
            closerInl._literal = closerInl._literal.slice(
              0,
              closerInl._literal.length - useDelims
            );

            // build contents for new emph element
            let emph = new Node(useDelims === 1 ? "emph" : "strong");

            tmp = openerInl._next;

            while (tmp && tmp !== closerInl) {
              next = tmp._next;
              tmp.unlink();
              emph.appendChild(tmp);
              tmp = next;
            }

            openerInl.insertAfter(emph);

            // remove elts between opener and closer in delimiters stack
            removeDelimitersBetween(
              opener as Delimiters, 
              closer as Delimiters
            );

            // if opener has 0 delims, remove it and the inline
            if ((opener as Delimiters).numdelims === 0) {
              openerInl.unlink();
              this.removeDelimiter(opener as Delimiters);
            }

            if ((closer as Delimiters).numdelims === 0) {
              closerInl.unlink();
              tempstack = (closer as Delimiters).next;
              this.removeDelimiter(closer as Delimiters);
              closer = tempstack;
            }
          }
        } else if (closercc === C_SINGLEQUOTE) {
          (closer as Delimiters).node._literal = "\u2019";

          if (openerFound) {
            (opener as Delimiters).node._literal = "\u2018";
          }

          closer = (closer as Delimiters).next;
        } else if (closercc === C_DOUBLEQUOTE) {
          (closer as Delimiters).node._literal = "\u201D";

          if (openerFound) {
            (opener as Delimiters).node.literal = "\u201C";
          }

          closer = (closer as Delimiters).next;
        }

        if (!openerFound) {
          // Set lower bound for future searches for openers:
          openersBottom[oldCloser.origdelims % 3][closercc] =
            oldCloser.previous;

          if (!oldCloser.canOpen) {
            // We can remove a closer that can't be an opener,
            // once we've seen there's no matching opener:
            this.removeDelimiter(oldCloser);
          }
        }
      }
    }

    // remove all delimiters
    while (
      this.delimiters != null && 
      this.delimiters !== stackBottom
    ) {
      this.removeDelimiter(this.delimiters);
    }
  };


  removeDelimiter(delim: Delimiters): void {
    if (delim.previous != null) {
      delim.previous.next = delim.next;
    }

    if (delim.next == null) {
      // top of stack
      this.delimiters = delim.previous;
    } else {
      delim.next.previous = delim.previous;
    }
  };
}

export default InlineParser;
