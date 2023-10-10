import { LightningElement, api, track } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

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

export default class SfGpsDsUkGovAccordionSection extends LightningElement {
  static renderMode = "light";

  @api header;
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

  /* computed: _isHidden */

  get _isHidden() {
    return !this._isOpen;
  }

  /* computed: computedClassName */

  get computedClassName() {
    return computeClass({
      "govuk-accordion__section": true,
      "govuk-accordion__section--expanded": this._isOpen,
      [this.className]: this.className
    });
  }

  /* computed: computedChevronClassName */

  get computedChevronClassName() {
    return computeClass({
      "govuk-accordion-nav__chevron": true,
      "govuk-accordion-nav__chevron--down": !this._isOpen
    });
  }

  /* computed: computedAriaLabel */

  get computedAriaLabel() {
    return `${this.title ? this.title + ", " : ""}${
      this._isOpen ? I18N.hideSectionAriaLabel : I18N.showSectionAriaLabel
    }`;
  }

  /* computed: computedHeadingTextId */

  _headingTextId;

  get computedHeadingTextId() {
    if (!this._headingTextId) {
      this._headingTextId = uniqueId(HEADINGTEXTID_PREFIX);
    }

    return this._headingTextId;
  }

  /* computed: contentId */

  _contentId;

  get computedContentId() {
    if (!this._contentId) {
      this._contentId = uniqueId(CONTENTID_PREFIX);
    }

    return this._contentId;
  }

  /* computed: _allowAriaLabelledby */

  get _allowAriaLabelledby() {
    return ALLOW_ARIA_LABELLEDBY;
  }

  /* i18n */

  get i18n() {
    return I18N;
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(new CustomEvent(this._isOpen ? "collapse" : "expand"));
  }
}
