import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Chip extends LightningElement {
  static renderMode = "light";

  @api variant = "default";
  @api items;
  @api label = "";
  @api url = "#";
  @api index = 0;
  @api preventDefault;
  @api className;

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-chip": true,
      "rpl-chip--default": this.variant === "default",
      "rpl-chip--reverse": this.variant === "reverse",
      "rpl-type-label": true,
      "rpl-u-focusable-block": true,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
  }
  /* event management */

  handleClick(event) {
    const index = event.target.index;

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          value: this.items ? this.items[index].url : this.url,
          text: this.items ? this.items[index].text : this.label,
          index: index + 1
        }
      })
    );
  }
}
