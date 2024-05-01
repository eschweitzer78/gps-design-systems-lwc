import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2VerticalNavLink extends LightningElement {
  @api text;
  @api href;
  @api active;
  @api showChildIcon;
  @api className;

  get computedClass() {
    return computeClass({
      "rpl-vertical-nav__item": true,
      "rpl-vertical-nav__item--active": this.active,
      "rpl-vertical-nav__link": true,
      "rpl-u-focusable-block": true,
      [this.className]: this.className
    });
  }

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("itemclick", {
        detail: {
          action: "click",
          text: this.text,
          value: this.href
        }
      })
    );
  }
}
