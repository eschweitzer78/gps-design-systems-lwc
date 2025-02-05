import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api links;
  @api active;
  @api minimize;

  /* computed */

  get computedShowHeadingLink() {
    return this.minimize && this.links?.children;
  }

  get computedSymbol() {
    return this.active ? "up" : "down";
  }

  get computedShow() {
    return this.links?.children && (!this.minimize || this.active);
  }

  get _children() {
    return isArray(this.links?.children)
      ? this.links.children.map((item, index) => ({
          title: item.title || item.text,
          uri: item.uri || item.url,
          icon: item.icon,
          key: `item-${index + 1}`
        }))
      : null;
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(new CustomEvent("toggle"));
  }
}
