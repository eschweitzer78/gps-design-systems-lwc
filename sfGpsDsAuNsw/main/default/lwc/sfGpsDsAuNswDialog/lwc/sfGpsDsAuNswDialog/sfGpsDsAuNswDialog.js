import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean, uniqueId } from "c/sfGpsDsHelpers";

const BSTYLE_DEFAULT = "dark";
const BSTYLE_VALUES = {
  dark: "nsw-button--dark",
  danger: "nsw-button--danger"
};

const ISDISMISSIBLE_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api primaryButtonText;
  @api secondaryButtonText;
  @api isOpen = false;
  @api className;

  /* api: bstyle */

  _bstyle = BSTYLE_VALUES[BSTYLE_DEFAULT];
  _bstyleOriginal = BSTYLE_DEFAULT;

  @api
  get bstyle() {
    return this._bstylOriginal;
  }

  set bstyle(value) {
    this._bstyleOriginal = value;
    this._bstyle = normaliseString(value, {
      validValues: BSTYLE_VALUES,
      fallbackValue: BSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: isDismissible */

  _isDismissible = ISDISMISSIBLE_DEFAULT;
  _isDismissibleOriginal = ISDISMISSIBLE_DEFAULT;

  @api
  get isDismissible() {
    return this._isDismissibleOriginal;
  }

  set isDismissible(value) {
    this._isDismissibleOriginal = value;
    this._isDismissible = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISDISMISSIBLE_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-dialog": true,
      "nsw-dialog--single-action": !this.secondaryButtonText,
      active: this.isOpen,
      [this.className]: this.className
    };
  }

  get computedPrimaryButtonClassName() {
    return {
      "nsw-button": true,
      [this._bstyle]: this._bstyle
    };
  }

  _labelledById;

  get computedAriaLabelledById() {
    if (this._labelledById === undefined) {
      this._labelledById = uniqueId("sf-gps-ds-au-nsw-dialog");
    }

    return this._labelledById;
  }

  /* event management */

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
