import { LightningElement, api } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswDialog extends LightningElement {
  static renderMode = "light";

  @api title;
  @api primaryButtonText;
  @api secondaryButtonText;
  @api bstyle; // one of dark, danger
  @api isDismissible = false;
  @api isOpen = false;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-dialog": true,
      "nsw-dialog--single-action": !this.secondaryButtonText,
      active: this.isOpen,
      [this.className]: this.className
    });
  }

  get computedPrimaryButtonClassName() {
    return computeClass({
      "nsw-button": true,
      "nsw-button--dark": this.bstyle === "dark" || !this.bstyle,
      "nsw-button--danger": this.bstyle === "danger"
    });
  }

  _labelledById;

  get computedAriaLabelledById() {
    if (this._labelledById === undefined) {
      this._labelledById = uniqueId("sf-gps-ds-au-nsw-dialog");
    }

    return this._labelledById;
  }

  handlePrimaryClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent("primaryclick"));
  }

  handleSecondaryClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent("secondaryclick"));
  }

  handleCloseClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent("close"));
  }
}
