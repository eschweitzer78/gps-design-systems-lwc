"use strict";

import { 
  escapeXml 
} from "./common";
import Renderer from "./renderer";
import type { 
  Node 
} from "./node";

const reUnsafeProtocol = /^javascript:|vbscript:|file:|data:/i;
const reSafeDataProtocol = /^data:image\/(?:png|gif|jpeg|webp)/i;

function potentiallyUnsafe(
  url: string
): boolean {
  return reUnsafeProtocol.test(url) && !reSafeDataProtocol.test(url);
};

interface HtmlRendererOptions {
  softbreak?: string,
  esc?: { [key: string]: string },
  safe?: boolean;
  sourcepos?: boolean;
}

class HtmlRenderer extends Renderer {
  esc: any;
  disableTags: number;
  options: HtmlRendererOptions

  constructor(options?: HtmlRendererOptions) {
    super();

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
  text(
    node: Node
  ) {
    this.out(node.literal);
  }

  softbreak() {
    this.lit(this.options.softbreak as string);
  }

  linebreak(
    _node: Node, 
    entering: boolean, 
    attribute: string
  ) {
    this.tag("br", entering && attribute ? [[attribute, ""]] : [], true);
    this.cr();
  }

  link(
    node: Node, 
    entering: boolean, 
    attribute: string
  ) {
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

  image(
    node: Node, 
    entering: boolean, 
    attribute: string
  ) {
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


  emph(
    _node: Node, 
    entering: boolean,
    attribute: string
  ) {
    this.tag(
      entering ? "em" : "/em",
      entering && attribute ? [[attribute, ""]] : undefined
    );
  }

  strong(
    _node: Node, 
    entering: boolean, 
    attribute: string
  ) {
    this.tag(
      entering ? "strong" : "/strong",
      entering && attribute ? [[attribute, ""]] : undefined
    );
  }

  paragraph(
    node: Node, 
    entering: boolean, 
    attribute: string
  ) {
    const grandparent = (node.parent as Node).parent,
      // eslint-disable-next-line no-shadow
      attrs = this.attrs(node);
    if (
      grandparent != null && 
      (grandparent as Node).type === "list"
    ) {
      if ((grandparent as Node).listTight) {
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

  heading(
    node: Node, 
    entering: boolean, 
    attribute: string
  ) {
    const tagname = "h" + node.level,
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

  code(
    node: Node, 
    _entering: boolean, 
    attribute: string
  ) {
    this.tag("code", attribute ? [[attribute, ""]] : undefined);
    this.out(node.literal);
    this.tag("/code");
  }

  code_block(
    node: Node, 
    _entering: boolean, 
    attribute: string
  ) {
    const info_words = node.info 
      ? node.info.split(/\s+/) 
      : [],
      // eslint-disable-next-line no-shadow
      attrs = this.attrs(node);

    if (info_words.length > 0 && info_words[0].length > 0) {
      attrs.push(["class", "language-" + this.esc(info_words[0])]);
    }

    if (attribute) {
      attrs.push([attribute, ""]);
    }

    this.cr();
    this.tag("pre", attribute ? [[attribute, ""]] : undefined);
    this.tag("code", attrs);
    this.out(node.literal);
    this.tag("/code");
    this.tag("/pre");
    this.cr();
  }

  thematic_break(
    node: Node, 
    _entering: boolean, 
    attribute: string
  ) {
    // eslint-disable-next-line no-shadow
    let attrs = this.attrs(node);
    this.cr();

    if (attribute) {
      attrs.push([attribute, ""]);
    }

    this.tag("hr", attrs, true);
    this.cr();
  }

  block_quote(
    node: Node, 
    entering: boolean, 
    attribute: string
  ) {
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

  list(
    node: Node, 
    entering: boolean, 
    attribute: string
  ) {
    let tagname = node.listType === "bullet" ? "ul" : "ol",
      // eslint-disable-next-line no-shadow
      attrs = this.attrs(node);

    if (entering) {
      let start = node.listStart;

      if (start != null && start !== 1) {
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

  item(
    node: Node, 
    entering: boolean, 
    attribute: string
  ) {
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

  html_inline(
    node: Node
  ) {
    if (this.options.safe) {
      this.lit("<!-- raw HTML omitted -->");
    } else {
      this.lit(node.literal);
    }
  }

  html_block(
    node: Node
  ) {
    this.cr();

    if (this.options.safe) {
      this.lit("<!-- raw HTML omitted -->");
    } else {
      this.lit(node.literal);
    }

    this.cr();
  }

  custom_inline(
    node: Node, 
    entering: boolean
  ) {
    if (entering && node.onEnter) {
      this.lit(node.onEnter);
    } else if (!entering && node.onExit) {
      this.lit(node.onExit);
    }
  }

  custom_block(
    node: Node, 
    entering: boolean
  ) {
    this.cr();

    if (entering && node.onEnter) {
      this.lit(node.onEnter);
    } else if (!entering && node.onExit) {
      this.lit(node.onExit);
    }

    this.cr();
  }

  // Helper function to produce an HTML tag.
  // eslint-disable-next-line no-shadow

  tag(
    name: string, 
    attrs?: string[][], 
    selfclosing?: boolean
  ) {
    if (this.disableTags > 0) {
      return;
    }

    this.buffer += "<" + name;

    if (attrs && attrs.length > 0) {
      let i = 0;
      let attrib: string[];

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

  out(
    s: string
  ) {
    this.lit(this.esc(s));
  }

  attrs(
    node: Node
  ): string[][] {
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
} 

HtmlRenderer.prototype.esc = escapeXml;

export default HtmlRenderer;
