import { LightningElement, api, track } from "lwc";
import { computeClass, isRTL, uniqueId } from "c/sfGpsDsHelpers";

const CONTENTID_PREFIX = "sf-gps-ds-au-vic-accordion-item-content";

const buttonTextClass = isRTL()
  ? "rpl-accordion__button-text--rtl"
  : "rpl-accordion__button-text";

export default class SfGpsDsAuVicAccordionItem extends LightningElement {
  static renderMode = "light";

  @api index;
  @api title;
  @api type = "default"; // one of default, numbered
  @api content;

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
      "rpl-accordion__list-item": true,
      "rpl-accordion__list-item--expanded": this._isOpen
    });
  }

  get computedTitleClassName() {
    return computeClass({
      "rpl-accordion__title": true,
      "rpl-accordion__title--expanded": this._isOpen
    });
  }

  get computedButtonClassName() {
    return computeClass({
      "rpl-accordion__button": true,
      "rpl-accordion__button--expanded": this._isOpen
    });
  }

  get computedIconClassName() {
    return computeClass({
      "rpl-accordion__icon": true,
      "rpl-accordion__icon--expanded": this._isOpen
    });
  }

  get computedButtonTextClassName() {
    return buttonTextClass;
  }

  _contentElement;

  get contentElement() {
    if (!this._contentElement) {
      this._contentElement = this.querySelector(".rpl-accordion__content");
    }

    return this._contentElement;
  }

  get computedStyle() {
    return this.contentElement && this._isOpen
      ? `height: auto; visibility: visible`
      : "";
  }

  /* computed: contentId */

  _contentId;

  get computedContentId() {
    if (!this._contentId) {
      this._contentId = uniqueId(CONTENTID_PREFIX);
    }

    return this._contentId;
  }
  /* computed: isNumbered */

  get isNumbered() {
    return this.type === "numbered";
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(new CustomEvent(this._isOpen ? "collapse" : "expand"));
  }
}
