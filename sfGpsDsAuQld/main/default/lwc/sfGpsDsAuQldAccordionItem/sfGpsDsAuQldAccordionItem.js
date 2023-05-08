import { LightningElement, api, track } from "lwc";
import { computeClass, uniqueId, replaceInnerHtml } from "c/sfGpsDsHelpers";

const CONTENTID_PREFIX = "sf-gps-ds-au-qld-accordion-item-content";
const CONTENT_SELECTOR = ".collapsing-section";

export default class SfGpsDsAuQldAccordionItem extends LightningElement {
  static renderMode = "light";

  @api index;
  @api title;
  @api subtitle;
  @api content;
  @api className;

  /* api: closed */

  @track _isOpen = false;

  @api get closed() {
    return !this._isOpen;
  }

  set closed(value) {
    this._isOpen = !value;
  }

  /* computed: computedClassName */

  get computedClassName() {
    return computeClass({
      [this.className]: this.className
    });
  }

  /* computed: computedButtonClassName */

  get computedButtonClassName() {
    return computeClass({
      "acc-heading": true,
      "qg-accordion--closed": !this._isOpen,
      "qg-accordion--open": this._isOpen
    });
  }

  /* computed: computedContentId */

  _contentId;

  get computedContentId() {
    if (!this._contentId) {
      this._contentId = uniqueId(CONTENTID_PREFIX);
    }

    return this._contentId;
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(new CustomEvent(this._isOpen ? "collapse" : "expand"));
  }

  /* lifecycle */

  renderedCallback() {
    if (this.content) {
      let elt = this.querySelector(CONTENT_SELECTOR);

      if (elt) {
        replaceInnerHtml(elt, this.content);
      }
    }
  }
}
