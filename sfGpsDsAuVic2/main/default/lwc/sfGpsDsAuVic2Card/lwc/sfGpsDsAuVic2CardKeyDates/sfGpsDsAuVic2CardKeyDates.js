import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api el = "div";
  @api title = "Key calendar dates";
  @api url;
  @api items = [];
  @api ctaTitle;
  @api preventDefault;
  @api className;

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-card--key-dates": true,
      [this.className]: this.className
    });
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          value: this.url,
          text: this.ctaTitle,
          label: this.title,
          type: "key-dates"
        }
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    this.classList.add("sf-gps-ds-au-vic2-grid");
  }
}
