import { LightningElement, api, track } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api section;
  @api isExpandable;
  @api index;
  @api className;

  @api preventDefault;

  @track isExpanded;

  /* computed */

  get items() {
    if (this.section?.url) {
      return [
        {
          text: this.section.text,
          url: this.section.url
        },
        ...(this.section.items || [])
      ];
    }

    return this.section?.items || [];
  }

  get computedClassName() {
    return computeClass({
      "rpl-footer-nav-section": true,
      "rpl-footer-nav-section--expanded": this.isExpanded
    });
  }

  _toggleId;

  get computedToggleId() {
    if (this._toggleId == null) {
      this._toggleId = uniqueId("sf-gps-ds-au-vic2-nav-section-toggle");
    }

    return this._toggleId;
  }

  /* event management */

  handleToggle() {
    this.isExpanded = !this.isExpanded;

    this.dispatchEvent(
      new CustomEvent("expand", {
        detail: {
          id: this.id,
          action: this.isExpanded ? "open" : "close",
          text: this.section?.text,
          index: this.index
        },
        bubble: true
      })
    );
  }

  handleItemClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: event.detail,
        bubble: true
      })
    );
  }
}
