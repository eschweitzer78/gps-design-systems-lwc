import { LightningElement, api, track } from "lwc";
import { computeClass, isRTL } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicAnchorLinks extends LightningElement {
  static renderMode = "light";

  @api title; // string

  /* api: links [{text: string, url: string, type: string with h3 being indent, use h2 otherwise }] */

  _linksOriginal;
  @track _links;

  @api get links() {
    return this._linksOriginal;
  }

  set links(value) {
    this._linksOriginal = value;

    if (!Array.isArray(value)) {
      this._links = null;
      return;
    }

    this._links = value.map((item, index) => ({
      ...item,
      key: `link-${index + 1}`,
      link: { text: item.text, url: item.url },
      showIndent: item.type === "h3",
      className: computeClass({
        "rpl-anchor-links__item": true,
        "rpl-anchor-links__item--indent": item.type === "h3"
      })
    }));
  }

  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-anchor-links": true,
      "rpl-anchor-links--rtl": isRTL(),
      [this.className]: this.className
    });
  }

  handleClick(event) {
    let index = event.currentTarget.dataset.ndx;
    let href = event.currentTarget.getAttribute("href");

    this.dispatchEvent(
      new CustomEvent("openpanel", {
        detail: {
          url: href,
          index: index
        }
      })
    );
  }
}
