import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

const LINKS_DEFAULT = [];

export default class extends LightningElement {
  static renderMode = "light";

  @api title; // string
  @api className;

  /* api: links */

  _links = LINKS_DEFAULT;
  _linksOriginal = LINKS_DEFAULT;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(value) {
    this._linksOriginal = value;

    if (isArray(value)) {
      this._links = this.links.map((item, index) => ({
        ...item,
        key: `link-${index + 1}`
      }));
    } else {
      this._links = LINKS_DEFAULT;
    }
  }
  /* computed */

  get computedClassName() {
    return {
      "rpl-related-links": true,
      [this.className]: this.className
    };
  }

  get computedHasLinks() {
    return this._links.length > 0;
  }
}
