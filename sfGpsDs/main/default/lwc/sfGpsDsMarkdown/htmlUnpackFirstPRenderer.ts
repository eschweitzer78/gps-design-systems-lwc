"use strict";

import type { Node } from "./node";
import HtmlRenderer from "./htmlRenderer";

class HtmlUnpackFirstPRenderer extends HtmlRenderer {
  pIndex: number;

  paragraph(node: Node, entering: boolean, attribute: string) {
    let grandparent = node.parent.parent,
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

      if (this.pIndex) this.tag("p", attrs);

      this.pIndex++;
    } else {
      this.pIndex--;

      if (this.pIndex) {
        this.tag("/p");
      } else {
        this.pIndex++; // so that it's 0 only once!
      }
      
      this.cr();
    }
  }

  render(ast: Node, attribute: string) {
    this.pIndex = 0;
    return super.render(ast, attribute);
  }
}

export default HtmlUnpackFirstPRenderer;
