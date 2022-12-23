import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass, isRTL } from "c/sfGpsDsHelpers";

const accordionButtonTextClass = isRTL()
  ? "rpl-accordion__button-text--rtl"
  : "";

export default class SfGpsDsAuVicAccordionItem extends SfGpsDsLwc {
  @api index;
  @api title;
  @api content;

  @api get closed() {
    return !this.isOpen;
  }

  set closed(value) {
    this.isOpen = !value;
  }

  @track isOpen = false;

  get computedClass() {
    return computeClass({
      "rpl-accordion__list-item": true,
      "rpl-accordion__list-item--expanded": this.isOpen
    });
  }

  get computedTitleClass() {
    return computeClass({
      "rpl-accordion__title": true,
      "rpl-accordion__title--expanded": this.isOpen
    });
  }

  get computedButtonClass() {
    return computeClass({
      "rpl-accordion__button": true,
      "rpl-accordion__button--expanded": this.isOpen
    });
  }

  get computedIconClass() {
    return computeClass({
      "rpl-accordion__icon": true,
      "rpl-accordion__icon--expanded": this.isOpen
    });
  }

  get computedAccordionButtonTextClass() {
    return accordionButtonTextClass;
  }

  _contentElement;

  get contentElement() {
    if (!this._contentElement) {
      this._contentElement = this.template.querySelector(
        ".rpl-accordion__content"
      );
    }

    return this._contentElement;
  }

  get computedStyle() {
    let contentElement = this._contentElement;

    return contentElement && this.isOpen
      ? `height: auto; visibility: visible`
      : "";
  }

  get contentId() {
    let element = this.contentElement;

    if (element) {
      return (this._contentId = element.id);
    }

    return null;
  }

  handleClick(event) {
    this.dispatchEvent(new CustomEvent(this.isOpen ? "collapse" : "expand"));
    this.isOpen = !this.isOpen;
  }
}
