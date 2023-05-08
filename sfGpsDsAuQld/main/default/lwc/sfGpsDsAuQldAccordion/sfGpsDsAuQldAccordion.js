import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEFAULT_CLOSE_STATE = true;

export default class SfGpsDsAuQldAccordion extends LightningElement {
  static renderMode = "light";

  @api showButtons;
  @api cstyle;
  @api className;

  /* api: accordions */

  _originalAccordions;
  @track _accordions;
  _numberOpen;

  @api get accordions() {
    return this._originalAccordions;
  }

  set accordions(value) {
    let numberOpen = 0;
    this._originalAccordions = value;
    this._accordions =
      this._originalAccordions && Array.isArray(this._originalAccordions)
        ? this._originalAccordions.map((item, index) => {
            let closed =
              item.closed === undefined ? DEFAULT_CLOSE_STATE : item.closed;
            numberOpen += closed ? 0 : 1;

            return {
              ...item,
              index: index + 1,
              key: `item-${index + 1}`,
              closed: closed
            };
          })
        : [];

    this._numberOpen = numberOpen;
  }

  // computed: computedClassName

  get computedClassName() {
    return computeClass({
      "qg-accordion": true,
      "qg-accordion-v2": true,
      "qg-dark-accordion": this.cstyle === "dark",
      "qg-light-accordion": this.cstyle === "light",
      [this.className]: this.className
    });
  }

  /* event management */

  handleExpand(event) {
    let index = event.target.index - 1;
    this._accordions[index].closed = false;
    this._numberOpen++;
    this.dispatchEvent(new CustomEvent("expand", { detail: index }));
  }

  handleCollapse(event) {
    let index = event.target.index - 1;
    this._accordions[index].closed = true;
    this._numberOpen--;
    this.dispatchEvent(new CustomEvent("collapse", { detail: index }));
  }

  handleExpandAll() {
    this._numberOpen = this._accordions.length;
    this._accordions = this._accordions.map((item) => ({
      ...item,
      closed: false
    }));

    this.dispatchEvent(new CustomEvent("expandall"));
  }

  handleCollapseAll() {
    this._numberOpen = 0;
    this._accordions = this._accordions.map((item) => ({
      ...item,
      closed: true
    }));

    this.dispatchEvent(new CustomEvent("collapseall"));
  }

  /* computed: computedShowButtons */

  get computedShowButtons() {
    return this.showButtons && this._accordions?.length;
  }

  /* computed: isFullyExpanded */

  get isFullyExpanded() {
    return this._numberOpen && this._numberOpen === this._accordions?.length;
  }

  /* computed: isFullyCollapsed */

  get isFullyCollapsed() {
    return this._numberOpen === 0;
  }
}
