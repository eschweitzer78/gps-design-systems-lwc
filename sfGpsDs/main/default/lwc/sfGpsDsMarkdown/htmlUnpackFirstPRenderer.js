"use strict";

import HtmlRenderer from "./htmlRenderer.js";

function HtmlUnpackFirstPRenderer(options) {
  let ctr = HtmlRenderer.bind(this);
  ctr(options);
}

function paragraph(node, entering, attribute) {
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

function render(ast, attribute) {
  this.pIndex = 0;
  return this.parentRender(ast, attribute);
}

// quick browser-compatible inheritance
HtmlUnpackFirstPRenderer.prototype = Object.create(HtmlRenderer.prototype);
HtmlUnpackFirstPRenderer.prototype.paragraph = paragraph;
HtmlUnpackFirstPRenderer.prototype.parentRender =
  HtmlUnpackFirstPRenderer.prototype.render;
HtmlUnpackFirstPRenderer.prototype.render = render;

export default HtmlUnpackFirstPRenderer;
