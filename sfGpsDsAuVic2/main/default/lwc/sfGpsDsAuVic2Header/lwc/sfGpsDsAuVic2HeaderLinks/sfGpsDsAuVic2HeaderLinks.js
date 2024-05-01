import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEFAULT_TYPE = "link";

export default class extends LightningElement {
  @api title;
  @api items;
  @api type;
  @api moreLink;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-header-links": true,
      "rpl-header-links--link": (this.type || DEFAULT_TYPE) === "link",
      "rpl-header-links--button": (this.type || DEFAULT_TYPE) === "button",
      [this.className]: this.className
    });
  }

  get computedIsLink() {
    return (this.type || DEFAULT_TYPE) === "link";
  }

  get decoratedItems() {
    return (this.items || []).map((item, index) => ({
      ...item,
      key: `item-${index + 1}`
    }));
  }

  handleListClick(event) {
    console.log("handleListClick", event.target.url);
  }

  handleMoreLinkClick() {
    console.log("handleMoreLinkClick", this.moreLink);
  }
}
