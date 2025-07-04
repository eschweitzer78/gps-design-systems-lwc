/* eslint-disable no-unused-vars */

import { 
  ListData,
  Node 
} from "./node";
import { 
  unescapeString, 
  OPENTAG, 
  CLOSETAG 
} from "./common";
import InlineParser from "./inlines";

const CODE_INDENT = 4;

const C_TAB = 9;
const C_NEWLINE = 10;
const C_GREATERTHAN = 62;
const C_LESSTHAN = 60;
const C_SPACE = 32;
const C_OPEN_BRACKET = 91;

const reHtmlBlockOpen = [
  /./, // dummy for 0
  /^<(?:script|pre|textarea|style)(?:\s|>|$)/i,
  /^<!--/,
  /^<[?]/,
  /^<![A-Z]/,
  /^<!\[CDATA\[/,
  /^<[/]?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[123456]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|[/]?[>]|$)/i,
  new RegExp("^(?:" + OPENTAG + "|" + CLOSETAG + ")\\s*$", "i")
];

/* patched /-->/ to /--!?>/ to sort out a CodeQL warning */
const reHtmlBlockClose = [
  /./, // dummy for 0
  /<\/(?:script|pre|textarea|style)>/i,
  /--!?>/,
  /\?>/,
  />/,
  /\]\]>/
];

const reThematicBreak = /^(?:\*[ \t]*){3,}$|^(?:_[ \t]*){3,}$|^(?:-[ \t]*){3,}$/;
const reMaybeSpecial = /^[#`~*+_=<>0-9-]/;
const reNonSpace = /[^ \t\f\v\r\n]/;
const reBulletListMarker = /^[*+-]/;
const reOrderedListMarker = /^(\d{1,9})([.)])/;
const reATXHeadingMarker = /^#{1,6}(?:[ \t]+|$)/;
const reCodeFence = /^`{3,}(?!.*`)|^~{3,}/;
const reClosingCodeFence = /^(?:`{3,}|~{3,})(?= *$)/;
const reSetextHeadingLine = /^(?:=+|-+)[ \t]*$/;
const reLineEnding = /\r\n|\n|\r/;

// Returns true if string contains only space characters.
function isBlank(s: string): boolean {
  return !reNonSpace.test(s);
};

function isSpaceOrTab(c: number): boolean {
  return c === C_SPACE || c === C_TAB;
};

function peek(ln: string | undefined, pos: number) {
  if (ln && pos < ln.length) {
    return ln.charCodeAt(pos);
  }
  return -1;
};

// DOC PARSER

// These are methods of a Parser object, defined below.

// Returns true if block ends with a blank line, descending if needed
// into lists and sublists.
function endsWithBlankLine(block: Node | undefined): boolean {
  while (block) {
    if (block._lastLineBlank) {
      return true;
    }
    let t = block.type;
    if (!block._lastLineChecked && (t === "list" || t === "item")) {
      block._lastLineChecked = true;
      block = block._lastChild;
    } else {
      block._lastLineChecked = true;
      break;
    }
  }
  return false;
};

// Parse a list marker and return data on the marker (type,
// start, delimiter, bullet character, padding) or null.
function parseListMarker(parser: Parser, container: Node) {
  let rest = parser.currentLine.slice(parser.nextNonspace);
  let match;
  let nextc;
  let spacesStartCol;
  let spacesStartOffset;
  let data: ListData = {
    type: undefined,
    tight: true, // lists are tight by default
    bulletChar: undefined,
    start: undefined,
    delimiter: undefined,
    padding: undefined,
    markerOffset: parser.indent
  };
  if (parser.indent >= 4) {
    return null;
  }
  if ((match = rest.match(reBulletListMarker))) {
    data.type = "bullet";
    data.bulletChar = match[0][0];
  } else if (
    (match = rest.match(reOrderedListMarker)) &&
    (container.type !== "paragraph" || match[1] === "1")
  ) {
    data.type = "ordered";
    data.start = parseInt(match[1], 10);
    data.delimiter = match[2];
  } else {
    return null;
  }
  // make sure we have spaces after
  nextc = peek(parser.currentLine, parser.nextNonspace + match[0].length);
  if (!(nextc === -1 || nextc === C_TAB || nextc === C_SPACE)) {
    return null;
  }

  // if it interrupts paragraph, make sure first line isn't blank
  if (
    container.type === "paragraph" &&
    !parser.currentLine
      .slice(parser.nextNonspace + match[0].length)
      .match(reNonSpace)
  ) {
    return null;
  }

  // we've got a match! advance offset and calculate padding
  parser.advanceNextNonspace(); // to start of marker
  parser.advanceOffset(match[0].length, true); // to end of marker
  spacesStartCol = parser.column;
  spacesStartOffset = parser.offset;
  do {
    parser.advanceOffset(1, true);
    nextc = peek(parser.currentLine, parser.offset);
  } while (parser.column - spacesStartCol < 5 && isSpaceOrTab(nextc));
  let blank_item = peek(parser.currentLine, parser.offset) === -1;
  let spaces_after_marker = parser.column - spacesStartCol;
  if (spaces_after_marker >= 5 || spaces_after_marker < 1 || blank_item) {
    data.padding = match[0].length + 1;
    parser.column = spacesStartCol;
    parser.offset = spacesStartOffset;
    if (isSpaceOrTab(peek(parser.currentLine, parser.offset))) {
      parser.advanceOffset(1, true);
    }
  } else {
    data.padding = match[0].length + spaces_after_marker;
  }
  return data;
};

// Returns true if the two list items are of the same type,
// with the same delimiter and bullet character.  This is used
// in agglomerating list items into lists.
let listsMatch = function(
  list_data: ListData, 
  item_data: ListData
) {
  return (
    list_data.type === item_data.type &&
    list_data.delimiter === item_data.delimiter &&
    list_data.bulletChar === item_data.bulletChar
  );
};




/*
let Document = function () {
  let doc = new Node("document", [
    [1, 1],
    [0, 0]
  ]);
  return doc;
};
*/

export interface ParserOptions {
  time?: any
}

// The Parser object.
export class Parser {
  doc: Node;
  tip: Node;
  oldtip: Node;
  currentLine: string;
  lineNumber: number;
  offset: number;
  column: number;
  nextNonspace: number;
  nextNonspaceColumn: number;
  indent: number;
  indented: boolean;
  blank: boolean;
  partiallyConsumedTab: boolean;
  allClosed: boolean;
  lastMatchedContainer: Node;
  refmap: { [key: string]: any };
  lastLineLength: number;
  options: ParserOptions;
  inlineParser: InlineParser;

  // 'finalize' is run when the block is closed.
  // 'continue' is run to check whether the block is continuing
  // at a certain line and offset (e.g. whether a block quote
  // contains a `>`.  It returns 0 for matched, 1 for not matched,
  // and 2 for "we've dealt with this line completely, go to next."
  blocks: Record<string, {
        continue: (parser: Parser, container: Node) => number,
        finalize: (parser: Parser, block: Node) => void,
        canContain: (t: string) => boolean,
        acceptsLines: boolean
    }> = {
    document: {
      continue: function (_parser: Parser, container: Node): number {
        return 0;
      },
      finalize: function (_parser: Parser, block: Node) {},
      canContain: function (t: string): boolean {
        return t !== "item";
      },
      acceptsLines: false
    },

    list: {
      continue: function (_parser: Parser, container: Node): number {
        return 0;
      },
      finalize: function (_parser: Parser, block: Node) {
        let item = block._firstChild;
        while (item) {
          // check for non-final list item ending with blank line:
          if (endsWithBlankLine(item) && item._next) {
            block._listData.tight = false;
            break;
          }
          // recurse into children of list item, to see if there are
          // spaces between any of them:
          let subitem = item._firstChild;
          while (subitem) {
            if (endsWithBlankLine(subitem) && (item._next || subitem._next)) {
              block._listData.tight = false;
              break;
            }
            subitem = subitem._next;
          }
          item = item._next;
        }
      },
      canContain: function (t: string): boolean {
        return t === "item";
      },
      acceptsLines: false
    },

    block_quote: {
      continue: function (parser: Parser, container: Node): number {
        let ln = parser.currentLine;
        if (!parser.indented && peek(ln, parser.nextNonspace) === C_GREATERTHAN) {
          parser.advanceNextNonspace();
          parser.advanceOffset(1, false);
          if (isSpaceOrTab(peek(ln, parser.offset))) {
            parser.advanceOffset(1, true);
          }
        } else {
          return 1;
        }
        return 0;
      },
      finalize: function (_parser: Parser, block: Node) {},
      canContain: function (t: string): boolean {
        return t !== "item";
      },
      acceptsLines: false
    },

    item: {
      continue: function (parser: Parser, container: Node): number {
        if (parser.blank) {
          if (container._firstChild == null) {
            // Blank line after empty list item
            return 1;
          }
          parser.advanceNextNonspace();
        } else if (
          parser.indent >=
          (container._listData.markerOffset as number) + (container._listData.padding as number)
        ) {
          parser.advanceOffset(
            (container._listData.markerOffset as number) + (container._listData.padding as number),
            true
          );
        } else {
          return 1;
        }
        return 0;
      },
      finalize: function (_parser: Parser, _block: Node) {},
      canContain: function (t: string): boolean {
        return t !== "item";
      },
      acceptsLines: false
    },

    heading: {
      continue: function (_parser: Parser, container: Node): number {
        // a heading can never container > 1 line, so fail to match:
        return 1;
      },
      finalize: function (_parser: Parser, block: Node) {},
      canContain: function (t: string): boolean {
        return false;
      },
      acceptsLines: false
    },

    thematic_break: {
      continue: function (_parser: Parser, container: Node): number {
        // a thematic break can never container > 1 line, so fail to match:
        return 1;
      },
      finalize: function (_parser: Parser, block: Node) {},
      canContain: function (t: string): boolean {
        return false;
      },
      acceptsLines: false
    },

    code_block: {
      continue: function (parser: Parser, container: Node): number {
        let ln = parser.currentLine;
        let indent = parser.indent;
        if (container._isFenced) {
          // fenced
          let match =
            indent <= 3 &&
            ln.charAt(parser.nextNonspace) === container._fenceChar &&
            ln.slice(parser.nextNonspace).match(reClosingCodeFence);
          if (match && match[0].length >= container._fenceLength) {
            // closing fence - we're at end of line, so we can return
            parser.lastLineLength = parser.offset + indent + match[0].length;
            parser.finalize(container, parser.lineNumber);
            return 2;
          }
          // skip optional spaces of fence offset
          let i = container._fenceOffset;
          while (i && i > 0 && isSpaceOrTab(peek(ln, parser.offset))) {
            parser.advanceOffset(1, true);
            i--;
          }
        } else {
          // indented
          if (indent >= CODE_INDENT) {
            parser.advanceOffset(CODE_INDENT, true);
          } else if (parser.blank) {
            parser.advanceNextNonspace();
          } else {
            return 1;
          }
        }
        return 0;
      },
      finalize: function (_parser: Parser, block: Node) {
        if (block._isFenced) {
          // fenced
          // first line becomes info string
          const content = block._string_content as string;
          const newlinePos = content.indexOf("\n");
          const firstLine = content.slice(0, newlinePos);
          const rest = content.slice(newlinePos + 1);
          block.info = unescapeString(firstLine.trim());
          block._literal = rest;
        } else {
          // indented
          block._literal = (block._string_content as string).replace(/(\n *)+$/, "\n");
        }
        block._string_content = undefined; // allow GC
      },
      canContain: function (t: string): false {
        return false;
      },
      acceptsLines: true
    },

    html_block: {
      continue: function (
        parser: Parser, 
        container: Node
      ) {
        return parser.blank &&
          (container._htmlBlockType === 6 || container._htmlBlockType === 7)
          ? 1
          : 0;
      },
      finalize: function (
        _parser: Parser, 
        block: Node
      ): void {
        block._literal = (block._string_content as string).replace(/(\n *)+$/, "");
        block._string_content = undefined; // allow GC
      },
      canContain: function (t: string): boolean {
        return false;
      },
      acceptsLines: true
    },

    paragraph: {
      continue: function (parser: Parser, _container: Node): number {
        return parser.blank ? 1 : 0;
      },
      finalize: function (parser: Parser, block: Node): void {
        let pos;
        let hasReferenceDefs = false;

        // try parsing the beginning as link reference definitions:
        while (
          peek(block._string_content, 0) === C_OPEN_BRACKET &&
          (pos = parser.inlineParser.parseReference(
            block._string_content as string,
            parser.refmap
          ))
        ) {
          block._string_content = (block._string_content as string).slice(pos);
          hasReferenceDefs = true;
        }
        if (hasReferenceDefs && isBlank(block._string_content as string)) {
          block.unlink();
        }
      },
      canContain: function (_t: string): boolean {
        return false;
      },
      acceptsLines: true
    }
  };

  // block start functions.  Return values:
  // 0 = no match
  // 1 = matched container, keep going
  // 2 = matched leaf, no more block starts
  blockStarts = [
    // block quote
    function (parser: Parser) {
      if (
        !parser.indented &&
        peek(parser.currentLine, parser.nextNonspace) === C_GREATERTHAN
      ) {
        parser.advanceNextNonspace();
        parser.advanceOffset(1, false);
        // optional following space
        if (isSpaceOrTab(peek(parser.currentLine, parser.offset))) {
          parser.advanceOffset(1, true);
        }
        parser.closeUnmatchedBlocks();
        parser.addChild("block_quote", parser.nextNonspace);
        return 1;
      }
      return 0;
    },

    // ATX heading
    function (parser: Parser) {
      let match;
      if (
        !parser.indented &&
        (match = parser.currentLine
          .slice(parser.nextNonspace)
          .match(reATXHeadingMarker))
      ) {
        parser.advanceNextNonspace();
        parser.advanceOffset(match[0].length, false);
        parser.closeUnmatchedBlocks();
        let container = parser.addChild("heading", parser.nextNonspace);
        container.level = match[0].trim().length; // number of #s
        // remove trailing ###s:
        container._string_content = parser.currentLine
          .slice(parser.offset)
          .replace(/^[ \t]*#+[ \t]*$/, "")
          .replace(/[ \t]+#+[ \t]*$/, "");
        parser.advanceOffset(parser.currentLine.length - parser.offset);
        return 2;
      }
      return 0;
    },

    // Fenced code block
    function (parser: Parser) {
      let match;
      if (
        !parser.indented &&
        (match = parser.currentLine.slice(parser.nextNonspace).match(reCodeFence))
      ) {
        let fenceLength = match[0].length;
        parser.closeUnmatchedBlocks();
        let container = parser.addChild("code_block", parser.nextNonspace);
        container._isFenced = true;
        container._fenceLength = fenceLength;
        container._fenceChar = match[0][0];
        container._fenceOffset = parser.indent;
        parser.advanceNextNonspace();
        parser.advanceOffset(fenceLength, false);
        return 2;
      }
      return 0;
    },

    // HTML block
    function (parser: Parser, container: Node) {
      if (
        !parser.indented &&
        peek(parser.currentLine, parser.nextNonspace) === C_LESSTHAN
      ) {
        let s = parser.currentLine.slice(parser.nextNonspace);
        let blockType;

        for (blockType = 1; blockType <= 7; blockType++) {
          if (
            reHtmlBlockOpen[blockType].test(s) &&
            (blockType < 7 ||
              (container.type !== "paragraph" &&
                !(
                  !parser.allClosed &&
                  !parser.blank &&
                  parser.tip.type === "paragraph"
                ))) // maybe lazy
          ) {
            parser.closeUnmatchedBlocks();
            // We don't adjust parser.offset;
            // spaces are part of the HTML block:
            let b = parser.addChild("html_block", parser.offset);
            b._htmlBlockType = blockType;
            return 2;
          }
        }
      }

      return 0;
    },

    // Setext heading
    function (parser: Parser, container: Node) {
      let match;
      if (
        !parser.indented &&
        container.type === "paragraph" &&
        (match = parser.currentLine
          .slice(parser.nextNonspace)
          .match(reSetextHeadingLine))
      ) {
        parser.closeUnmatchedBlocks();
        // resolve reference link definitiosn
        let pos;
        while (
          peek(container._string_content, 0) === C_OPEN_BRACKET &&
          (pos = parser.inlineParser.parseReference(
            container._string_content as string,
            parser.refmap
          ))
        ) {
          container._string_content = (container._string_content as string).slice(pos);
        }
        if ((container._string_content as string).length > 0) {
          let heading = new Node("heading", container.sourcepos);
          heading.level = match[0][0] === "=" ? 1 : 2;
          heading._string_content = container._string_content;
          container.insertAfter(heading);
          container.unlink();
          parser.tip = heading;
          parser.advanceOffset(parser.currentLine.length - parser.offset, false);
          return 2;
        }
        return 0;
      }
      return 0;
    },

    // thematic break
    function (parser: Parser) {
      if (
        !parser.indented &&
        reThematicBreak.test(parser.currentLine.slice(parser.nextNonspace))
      ) {
        parser.closeUnmatchedBlocks();
        parser.addChild("thematic_break", parser.nextNonspace);
        parser.advanceOffset(parser.currentLine.length - parser.offset, false);
        return 2;
      }
      return 0;
    },

    // list item
    function (parser: Parser, container: Node) {
      let data;

      if (
        (!parser.indented || container.type === "list") &&
        (data = parseListMarker(parser, container))
      ) {
        parser.closeUnmatchedBlocks();

        // add the list if needed
        if (
          parser.tip.type !== "list" ||
          !listsMatch(container._listData, data)
        ) {
          container = parser.addChild("list", parser.nextNonspace);
          container._listData = data;
        }

        // add the list item
        container = parser.addChild("item", parser.nextNonspace);
        container._listData = data;
        return 1;
      }
      return 0;
    },

    // indented code block
    function (parser: Parser) {
      if (parser.indented && parser.tip.type !== "paragraph" && !parser.blank) {
        // indented code
        parser.advanceOffset(CODE_INDENT, true);
        parser.closeUnmatchedBlocks();
        parser.addChild("code_block", parser.offset);
        return 2;
      }
      return 0;
    }
  ];

  advanceOffset(count: number, columns?: boolean) {
    let currentLine = this.currentLine;
    let charsToTab, charsToAdvance;
    let c;
    while (count > 0 && (c = currentLine[this.offset])) {
      if (c === "\t") {
        charsToTab = 4 - (this.column % 4);
        if (columns) {
          this.partiallyConsumedTab = charsToTab > count;
          charsToAdvance = charsToTab > count ? count : charsToTab;
          this.column += charsToAdvance;
          this.offset += this.partiallyConsumedTab ? 0 : 1;
          count -= charsToAdvance;
        } else {
          this.partiallyConsumedTab = false;
          this.column += charsToTab;
          this.offset += 1;
          count -= 1;
        }
      } else {
        this.partiallyConsumedTab = false;
        this.offset += 1;
        this.column += 1; // assume ascii; block starts are ascii
        count -= 1;
      }
    }
  };

  advanceNextNonspace() {
    this.offset = this.nextNonspace;
    this.column = this.nextNonspaceColumn;
    this.partiallyConsumedTab = false;
  };

  findNextNonspace() {
    let currentLine = this.currentLine;
    let i = this.offset;
    let cols = this.column;
    let c;

    while ((c = currentLine.charAt(i)) !== "") {
      if (c === " ") {
        i++;
        cols++;
      } else if (c === "\t") {
        i++;
        cols += 4 - (cols % 4);
      } else {
        break;
      }
    }
    this.blank = c === "\n" || c === "\r" || c === "";
    this.nextNonspace = i;
    this.nextNonspaceColumn = cols;
    this.indent = this.nextNonspaceColumn - this.column;
    this.indented = this.indent >= CODE_INDENT;
  };

  // Analyze a line of text and update the document appropriately.
  // We parse markdown text by calling this on each line of input,
  // then finalizing the document.
  incorporateLine(ln: string) {
    let all_matched = true;
    let t;

    let container = this.doc;
    this.oldtip = this.tip;
    this.offset = 0;
    this.column = 0;
    this.blank = false;
    this.partiallyConsumedTab = false;
    this.lineNumber += 1;

    // replace NUL characters for security
    if (ln.indexOf("\u0000") !== -1) {
      ln = ln.replace(/\0/g, "\uFFFD");
    }

    this.currentLine = ln;

    // For each containing block, try to parse the associated line start.
    // Bail out on failure: container will point to the last matching block.
    // Set all_matched to false if not all containers match.
    let lastChild;
    while ((lastChild = container._lastChild) && lastChild._open) {
      container = lastChild;

      this.findNextNonspace();

      switch (this.blocks[container.type].continue(this, container)) {
        case 0: // we've matched, keep going
          break;
        case 1: // we've failed to match a block
          all_matched = false;
          break;
        case 2: // we've hit end of line for fenced code close and can return
          return;
        default:
          /* eslint-disable */
          throw "continue returned illegal value, must be 0, 1, or 2";
        /* eslint-enable */
      }
      if (!all_matched) {
        container = container._parent as Node; // back up to last matching block
        break;
      }
    }

    this.allClosed = container === this.oldtip;
    this.lastMatchedContainer = container;

    let matchedLeaf =
      container.type !== "paragraph" && this.blocks[container.type].acceptsLines;
    let starts = this.blockStarts;
    let startsLen = starts.length;
    // Unless last matched container is a code block, try new container starts,
    // adding children to the last matched container:
    while (!matchedLeaf) {
      this.findNextNonspace();

      // this is a little performance optimization:
      if (!this.indented && !reMaybeSpecial.test(ln.slice(this.nextNonspace))) {
        this.advanceNextNonspace();
        break;
      }

      let i = 0;
      while (i < startsLen) {
        let res = starts[i](this, container);
        if (res === 1) {
          container = this.tip;
          break;
        } else if (res === 2) {
          container = this.tip;
          matchedLeaf = true;
          break;
        } else {
          i++;
        }
      }

      if (i === startsLen) {
        // nothing matched
        this.advanceNextNonspace();
        break;
      }
    }

    // What remains at the offset is a text line.  Add the text to the
    // appropriate container.

    // First check for a lazy paragraph continuation:
    if (!this.allClosed && !this.blank && this.tip.type === "paragraph") {
      // lazy paragraph continuation
      this.addLine();
    } else {
      // not a lazy continuation

      // finalize any blocks not matched
      this.closeUnmatchedBlocks();
      if (this.blank && container.lastChild) {
        container.lastChild._lastLineBlank = true;
      }

      t = container.type;

      // Block quote lines are never blank as they start with >
      // and we don't count blanks in fenced code for purposes of tight/loose
      // lists or breaking out of lists.  We also don't set _lastLineBlank
      // on an empty list item, or if we just closed a fenced block.
      let lastLineBlank =
        this.blank &&
        !(
          t === "block_quote" ||
          (t === "code_block" && container._isFenced) ||
          (t === "item" &&
            !container._firstChild &&
            container.sourcepos[0][0] === this.lineNumber)
        );

      // propagate lastLineBlank up through parents:
      let cont = container;
      while (cont) {
        cont._lastLineBlank = lastLineBlank;
        cont = cont._parent as Node;
      }

      if (this.blocks[t].acceptsLines) {
        this.addLine();
        // if HtmlBlock, check for end condition
        if (
          t === "html_block" &&
          container._htmlBlockType as number >= 1 &&
          container._htmlBlockType as number <= 5 &&
          reHtmlBlockClose[container._htmlBlockType as number].test(
            this.currentLine.slice(this.offset)
          )
        ) {
          this.lastLineLength = ln.length;
          this.finalize(container, this.lineNumber);
        }
      } else if (this.offset < ln.length && !this.blank) {
        // create paragraph container for line
        container = this.addChild("paragraph", this.offset);
        this.advanceNextNonspace();
        this.addLine();
      }
    }
    this.lastLineLength = ln.length;
  };

  // Add a line to the block at the tip.  We assume the tip
  // can accept lines -- that check should be done before calling this.
  addLine(): void {
    if (this.partiallyConsumedTab) {
      this.offset += 1; // skip over tab
      // add space characters:
      let charsToTab = 4 - (this.column % 4);
      this.tip._string_content += " ".repeat(charsToTab);
    }
    this.tip._string_content += this.currentLine.slice(this.offset) + "\n";
  };

  // Add block of type tag as a child of the tip.  If the tip can't
  // accept children, close and finalize it and try its parent,
  // and so on til we find a block that can accept children.
  addChild(tag: string, offset: number): Node {
    while (!this.blocks[this.tip.type].canContain(tag)) {
      this.finalize(this.tip, this.lineNumber - 1);
    }

    let column_number = offset + 1; // offset 0 = column 1
    let newBlock = new Node(tag, [
      [this.lineNumber, column_number],
      [0, 0]
    ]);
    newBlock._string_content = "";
    this.tip.appendChild(newBlock);
    this.tip = newBlock;
    return newBlock;
  };

  // Finalize a block.  Close it and do any necessary postprocessing,
  // e.g. creating string_content from strings, setting the 'tight'
  // or 'loose' status of a list, and parsing the beginnings
  // of paragraphs for reference definitions.  Reset the tip to the
  // parent of the closed block.
  finalize (block: Node, lineNumber: number) {
    let above = block._parent;
    block._open = false;
    block.sourcepos[1] = [lineNumber, this.lastLineLength];

    this.blocks[block.type].finalize(this, block);

    this.tip = above as Node;
  };

  // Walk through a block & children recursively, parsing string content
  // into inline content where appropriate.
  processInlines(block: Node) {
    let node: Node, event, t;
    let walker = block.walker();
    this.inlineParser.refmap = this.refmap;
    this.inlineParser.options = this.options;
    while ((event = walker.next())) {
      node = event.node;
      t = node.type;
      if (!event.entering && (t === "paragraph" || t === "heading")) {
        this.inlineParser.parse(node);
      }
    }
  };

  // Finalize and close any unmatched blocks.
  closeUnmatchedBlocks() {
    if (!this.allClosed) {
      // finalize any blocks not matched
      while (this.oldtip !== this.lastMatchedContainer) {
        let parent = this.oldtip._parent;
        this.finalize(this.oldtip, this.lineNumber - 1);
        this.oldtip = parent as Node;
      }
      this.allClosed = true;
    }
  };

  // The main parsing function.  Returns a parsed document AST.
  parse(input: string) {
    this.doc = new Node("document", [
      [1, 1],
      [0, 0]
    ]);
    this.tip = this.doc;
    this.refmap = {};
    this.lineNumber = 0;
    this.lastLineLength = 0;
    this.offset = 0;
    this.column = 0;
    this.lastMatchedContainer = this.doc;
    this.currentLine = "";

    if (this.options.time) {
      console.time("preparing input");
    }

    let lines = input.split(reLineEnding);
    let len = lines.length;
    if (input.charCodeAt(input.length - 1) === C_NEWLINE) {
      // ignore last blank line created by final newline
      len -= 1;
    }
    if (this.options.time) {
      console.timeEnd("preparing input");
    }
    if (this.options.time) {
      console.time("block parsing");
    }
    for (let i = 0; i < len; i++) {
      this.incorporateLine(lines[i]);
    }
    while (this.tip) {
      this.finalize(this.tip, len);
    }
    if (this.options.time) {
      console.timeEnd("block parsing");
    }
    if (this.options.time) {
      console.time("inline parsing");
    }
    this.processInlines(this.doc);
    if (this.options.time) {
      console.timeEnd("inline parsing");
    }
    return this.doc;
  };


  constructor(options?: ParserOptions) {
    this.doc = new Node("document", [
      [1, 1],
      [0, 0]
    ]);
    this.tip = this.doc;
    this.oldtip = this.doc;
    this.currentLine = "";
    this.lineNumber = 0;
    this.offset = 0;
    this.column = 0;
    this.nextNonspace = 0;
    this.nextNonspaceColumn = 0;
    this.indent = 0;
    this.indented = false;
    this.blank = false;
    this.partiallyConsumedTab = false;
    this.allClosed = true;
    this.lastMatchedContainer = this.doc;
    this.refmap = {};
    this.lastLineLength = 0;
    this.inlineParser = new InlineParser(options);
    this.options = options || {}
  };
}
