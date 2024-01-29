"use strict";

import { escapeXml } from "./common.js";
import Renderer from "./renderer.js";

let reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
let reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

let potentiallyUnsafe = function (url) {
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

// Helper function to produce an HTML tag.
// eslint-disable-next-line no-shadow
function tag(name, attrs, selfclosing) {
  if (this.disableTags > 0) {
    return;
  }
  this.buffer += "<" + name;
  if (attrs && attrs.length > 0) {
    let i = 0;
    let attrib;
    while ((attrib = attrs[i]) !== undefined) {
      if (attrib[1] === "" || attrib[1] === attrib[0]) {
        this.buffer += " " + attrib[0];
      } else {
        this.buffer += " " + attrib[0] + '="' + attrib[1] + '"';
      }
      i++;
    }
  }
  if (selfclosing) {
    this.buffer += " /";
  }
  this.buffer += ">";
  this.lastOut = ">";
}

function HtmlRenderer(options) {
  options = options || {};
  // by default, soft breaks are rendered as newlines in HTML
  options.softbreak = options.softbreak || "\n";
  // set to "<br />" to make them hard breaks
  // set to " " if you want to ignore line wrapping in source
  this.esc = options.esc || escapeXml;
  // escape html with a custom function
  // else use escapeXml

  this.disableTags = 0;
  this.lastOut = "\n";
  this.options = options;
}

/* Node methods */

function text(node) {
  this.out(node.literal);
}

function softbreak() {
  this.lit(this.options.softbreak);
}

function linebreak(node, entering, attribute) {
  this.tag("br", entering && attribute ? [[attribute, ""]] : [], true);
  this.cr();
}

function link(node, entering, attribute) {
  // eslint-disable-next-line no-shadow
  let attrs = this.attrs(node);
  if (entering) {
    if (!(this.options.safe && potentiallyUnsafe(node.destination))) {
      attrs.push(["href", this.esc(node.destination)]);
    }
    if (node.title) {
      attrs.push(["title", this.esc(node.title)]);
    }
    if (attribute) {
      attrs.push([attribute, ""]);
    }
    this.tag("a", attrs);
  } else {
    this.tag("/a");
  }
}

function image(node, entering, attribute) {
  if (entering) {
    if (this.disableTags === 0) {
      if (this.options.safe && potentiallyUnsafe(node.destination)) {
        this.lit(`<img ${attribute ? attribute + " " : ""}src="" alt="`);
      } else {
        this.lit(
          `<img ${attribute ? attribute + " " : ""}src="${this.esc(
            node.destination
          )}" alt="`
        );
      }
    }
    this.disableTags += 1;
  } else {
    this.disableTags -= 1;
    if (this.disableTags === 0) {
      if (node.title) {
        this.lit('" title="' + this.esc(node.title));
      }
      this.lit('" />');
    }
  }
}

function emph(node, entering, attribute) {
  this.tag(
    entering ? "em" : "/em",
    entering && attribute ? [[attribute, ""]] : null
  );
}

function strong(node, entering, attribute) {
  this.tag(
    entering ? "strong" : "/strong",
    entering && attribute ? [[attribute, ""]] : null
  );
}

function paragraph(node, entering, attribute) {
  let grandparent = node.parent.parent,
    // eslint-disable-next-line no-shadow
    attrs = this.attrs(node);
  if (grandparent !== null && grandparent.type === "list") {
    if (grandparent.listTight) {
      return;
    }
  }
  if (entering) {
    this.cr();
    if (attribute) {
      attrs.push([attribute, ""]);
    }
    this.tag("p", attrs);
  } else {
    this.tag("/p");
    this.cr();
  }
}

function heading(node, entering, attribute) {
  let tagname = "h" + node.level,
    // eslint-disable-next-line no-shadow
    attrs = this.attrs(node);
  if (entering) {
    this.cr();
    if (attribute) {
      attrs.push([attribute, ""]);
    }
    this.tag(tagname, attrs);
  } else {
    this.tag("/" + tagname);
    this.cr();
  }
}

function code(node, entering, attribute) {
  this.tag("code", attribute ? [[attribute, ""]] : null);
  this.out(node.literal);
  this.tag("/code");
}

function code_block(node, entering, attribute) {
  let info_words = node.info ? node.info.split(/\s+/) : [],
    // eslint-disable-next-line no-shadow
    attrs = this.attrs(node);
  if (info_words.length > 0 && info_words[0].length > 0) {
    attrs.push(["class", "language-" + this.esc(info_words[0])]);
  }
  if (attribute) {
    attrs.push([attribute, ""]);
  }
  this.cr();
  this.tag("pre", attribute ? [[attribute, ""]] : null);
  this.tag("code", attrs);
  this.out(node.literal);
  this.tag("/code");
  this.tag("/pre");
  this.cr();
}

function thematic_break(node, entering, attribute) {
  // eslint-disable-next-line no-shadow
  let attrs = this.attrs(node);
  this.cr();
  if (attribute) {
    attrs.push([attribute, ""]);
  }
  this.tag("hr", attrs, true);
  this.cr();
}

function block_quote(node, entering, attribute) {
  // eslint-disable-next-line no-shadow
  let attrs = this.attrs(node);
  if (entering) {
    this.cr();
    if (attribute) {
      attrs.push([attribute, ""]);
    }
    this.tag("blockquote", attrs);
    this.cr();
  } else {
    this.cr();
    this.tag("/blockquote");
    this.cr();
  }
}

function list(node, entering, attribute) {
  let tagname = node.listType === "bullet" ? "ul" : "ol",
    // eslint-disable-next-line no-shadow
    attrs = this.attrs(node);

  if (entering) {
    let start = node.listStart;
    if (start !== null && start !== 1) {
      attrs.push(["start", start.toString()]);
    }
    this.cr();
    if (attribute) {
      attrs.push([attribute, ""]);
    }
    this.tag(tagname, attrs);
    this.cr();
  } else {
    this.cr();
    this.tag("/" + tagname);
    this.cr();
  }
}

function item(node, entering, attribute) {
  // eslint-disable-next-line no-shadow
  let attrs = this.attrs(node);
  if (entering) {
    if (attribute) {
      attrs.push([attribute, ""]);
    }
    this.tag("li", attrs);
  } else {
    this.tag("/li");
    this.cr();
  }
}

function html_inline(node) {
  if (this.options.safe) {
    this.lit("<!-- raw HTML omitted -->");
  } else {
    this.lit(node.literal);
  }
}

function html_block(node) {
  this.cr();
  if (this.options.safe) {
    this.lit("<!-- raw HTML omitted -->");
  } else {
    this.lit(node.literal);
  }
  this.cr();
}

function custom_inline(node, entering) {
  if (entering && node.onEnter) {
    this.lit(node.onEnter);
  } else if (!entering && node.onExit) {
    this.lit(node.onExit);
  }
}

function custom_block(node, entering) {
  this.cr();
  if (entering && node.onEnter) {
    this.lit(node.onEnter);
  } else if (!entering && node.onExit) {
    this.lit(node.onExit);
  }
  this.cr();
}

/* Helper methods */

function out(s) {
  this.lit(this.esc(s));
}

function attrs(node) {
  //var att = [];
  let att = node.attrs ? node.attrs : []; // ESC
  if (this.options.sourcepos) {
    let pos = node.sourcepos;
    if (pos) {
      att.push([
        "data-sourcepos",
        String(pos[0][0]) +
          ":" +
          String(pos[0][1]) +
          "-" +
          String(pos[1][0]) +
          ":" +
          String(pos[1][1])
      ]);
    }
  }
  return att;
}

// quick browser-compatible inheritance
HtmlRenderer.prototype = Object.create(Renderer.prototype);

HtmlRenderer.prototype.text = text;
HtmlRenderer.prototype.html_inline = html_inline;
HtmlRenderer.prototype.html_block = html_block;
HtmlRenderer.prototype.softbreak = softbreak;
HtmlRenderer.prototype.linebreak = linebreak;
HtmlRenderer.prototype.link = link;
HtmlRenderer.prototype.image = image;
HtmlRenderer.prototype.emph = emph;
HtmlRenderer.prototype.strong = strong;
HtmlRenderer.prototype.paragraph = paragraph;
HtmlRenderer.prototype.heading = heading;
HtmlRenderer.prototype.code = code;
HtmlRenderer.prototype.code_block = code_block;
HtmlRenderer.prototype.thematic_break = thematic_break;
HtmlRenderer.prototype.block_quote = block_quote;
HtmlRenderer.prototype.list = list;
HtmlRenderer.prototype.item = item;
HtmlRenderer.prototype.custom_inline = custom_inline;
HtmlRenderer.prototype.custom_block = custom_block;

HtmlRenderer.prototype.esc = escapeXml;

HtmlRenderer.prototype.out = out;
HtmlRenderer.prototype.tag = tag;
HtmlRenderer.prototype.attrs = attrs;

export default HtmlRenderer;
