import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const VARIANT_PRIMARY = "primary";
const VARIANT_SECONDARY = "secondary";
const VARIANT_SUCCESS = "success";
const VARIANT_DANGER = "danger";
const VARIANT_WARNING = "warning";
const VARIANT_INFO = "info";
const VARIANT_LIGHT = "light";

const VARIANT_VALUES = [
  VARIANT_PRIMARY,
  VARIANT_SECONDARY,
  VARIANT_SUCCESS,
  VARIANT_DANGER,
  VARIANT_WARNING,
  VARIANT_INFO,
  VARIANT_LIGHT
];

const VARIANT_DEFAULT = VARIANT_PRIMARY;

const SHOW_DEFAULT = false;
const DISMISSIBLE_DEFAULT = false;

const I18N = {
  closeAriaLabel: "close the alert"
};

export default class SfGpsDsSgGovAlert extends LightningElement {
  @api className;

  /* api: dismissible */

  _show = SHOW_DEFAULT;
  _showOriginal = SHOW_DEFAULT;

  @api
  get show() {
    return this._show;
  }

  set show(value) {
    this._showOriginal = this._show;
    this._show = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOW_DEFAULT
    });

    this.dispatchEvent(new CustomEvent(value ? "sgdsshow" : "sgdshide"));
  }

  /* api: dismissible */

  _dismisible = DISMISSIBLE_DEFAULT;
  _dismissibleOriginal = DISMISSIBLE_DEFAULT;

  @api
  get dismissible() {
    return this._dismissibleOriginal;
  }

  set dismissible(value) {
    this._dismisible = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISMISSIBLE_DEFAULT
    });
  }

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT
    });
  }

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      sgds: true,
      alert: true,
      fade: true,
      show: this._show,
      "alert-dismissible": this.dismissible,
      [this.className]: this.className
    };
  }

  get computedAriaHidden() {
    return !this._show;
  }

  /* methods */

  close() {
    this._show = false;
  }
}
