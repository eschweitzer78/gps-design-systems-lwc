import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api primary;
  @api secondary;
  @api variant;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-header-actions": true,
      [this.className]: this.className
    });
  }

  get computedPrimaryUrl() {
    return this.primary?.url;
  }

  get computedPrimaryText() {
    return this.primary?.text;
  }

  handlePrimaryClick() {
    this.dispatchItemClick("primary", this.primary.url);
  }

  handleSecondaryClick() {
    this.dispatchItemClick("secondary", this.secondary.url);
  }

  dispatchItemClick(type, url) {
    this.dispatchEvent(
      new CustomEvent("itemclick", {
        detail: {
          type,
          url
        }
      })
    );
  }
}
