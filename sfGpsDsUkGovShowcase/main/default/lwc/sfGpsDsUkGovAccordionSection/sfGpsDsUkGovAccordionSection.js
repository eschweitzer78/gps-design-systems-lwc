import { LightningElement, api } from "lwc";
import { uniqueId } from "c/sfGpsDsHelpers";

const CONTENTID_PREFIX = "sf-gps-ds-uk-gov-accordion-section-content";
const HEADINGTEXTID_PREFIX = "sf-gps-ds-uk-gov-accordion-section-heading-text";

const I18N = {
  showSectionLabel: "Show",
  hideSectionLabel: "Hide",
  showSectionAriaLabel: "Show this section",
  hideSectionAriaLabel: "Hide this section"
};

// ALLOW_ARIA_LABELLEDBY prevents the use of aria-labelledby in the section's div as it breaks W3-ARIA conformance even though it's specified by GDS.
const ALLOW_ARIA_LABELLEDBY = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api header;
  @api content;
  @api className;

  /* api: closed */

  _isOpen = false;

  @api
  get closed() {
    return !this._isOpen;
  }

  set closed(value) {
    this._isOpen = !value;
  }

  /* computed */

  get _isHidden() {
    return !this._isOpen;
  }

  get computedClassName() {
    return {
      "govuk-accordion__section": true,
      "govuk-accordion__section--expanded": this._isOpen,
      [this.className]: this.className
    };
  }

  get computedChevronClassName() {
    return {
      "govuk-accordion-nav__chevron": true,
      "govuk-accordion-nav__chevron--down": !this._isOpen
    };
  }

  /* computed: computedAriaLabel */

  get computedAriaLabel() {
    return `${this.title ? this.title + ", " : ""}${
      this._isOpen ? I18N.hideSectionAriaLabel : I18N.showSectionAriaLabel
    }`;
  }

  _headingTextId;

  get computedHeadingTextId() {
    if (!this._headingTextId) {
      this._headingTextId = uniqueId(HEADINGTEXTID_PREFIX);
    }

    return this._headingTextId;
  }

  _contentId;

  get computedContentId() {
    if (!this._contentId) {
      this._contentId = uniqueId(CONTENTID_PREFIX);
    }

    return this._contentId;
  }

  get _allowAriaLabelledby() {
    return ALLOW_ARIA_LABELLEDBY;
  }

  get i18n() {
    return I18N;
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(new CustomEvent(this._isOpen ? "collapse" : "expand"));
  }
}
