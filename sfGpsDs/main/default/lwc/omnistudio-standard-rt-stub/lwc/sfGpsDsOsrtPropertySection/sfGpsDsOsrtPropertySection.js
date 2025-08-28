import { LightningElement, api, track } from "lwc";

export default class VlocityPropertySection extends LightningElement {
  @api title;
  @api isCollapsible;
  @track showSectionContent;
  @api isExpanded;
  @api showCount = false;
  @api count = 0;

  @track _isExpanded;
  get isExpanded() {
    return this._isExpanded;
  }
  set isExpanded(expanded) {
    this._isExpanded = expanded === "true" || expanded === true;
    this.showSectionContent = this.isExpanded;
  }

  renderedCallback() {
    if (this.showSectionContent) {
      this.template
        .querySelector(".section-content-container")
        .classList.add("open");
    }
  }

  expandSection() {
    this.showSectionContent = true;
    this.template
      .querySelector(".section-content-container")
      .classList.add("open");
  }

  collapseSection() {
    this.showSectionContent = false;
    this.template
      .querySelector(".section-content-container")
      .classList.remove("open");
  }

  get showExpandButton() {
    return this.isCollapsible && !this.showSectionContent;
  }

  get showCollapseButton() {
    return this.isCollapsible && this.showSectionContent;
  }

  get countDisplay() {
    return Number.isInteger(this.count) ? ` (${this.count}) ` : "";
  }
}
