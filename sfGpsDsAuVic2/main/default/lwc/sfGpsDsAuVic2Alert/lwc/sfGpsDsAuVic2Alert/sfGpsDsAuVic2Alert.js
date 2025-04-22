import { LightningElement, api } from "lwc";
import { normaliseBoolean, normaliseString } from "c/sfGpsDsHelpers";
import ResizeHeightMixin from "c/sfGpsDsAuVic2ResizeHeightMixin";

const I18N = {
  closeLabel: "Dismiss alert"
};

const ISDISMISSIBLE_DEFAULT = true;
const ISDISMISSIBLE_FALLBACK = false;

const VARIANT_DEFAULT = "information";
const VARIANT_VALUES = {
  information: "rpl-alert--information",
  warning: "rpl-alert--warning",
  error: "rpl-alert--error"
};

export default class extends ResizeHeightMixin(LightningElement, "alert") {
  @api iconName = "icon-information-circle-filled";
  @api message = "";
  @api linkText = "";
  @api linkUrl = "";
  @api dismissed = false;
  @api alertId;
  @api className;

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
      fallbackValue: VARIANT_DEFAULT,
      validValues: VARIANT_VALUES,
      returnObjectValue: true
    });
  }

  /* api: isDismissible */

  _isDismissibleOriginal = ISDISMISSIBLE_DEFAULT;
  _isDismissible = ISDISMISSIBLE_DEFAULT;

  @api
  get isDismissible() {
    return this._isDismissbleOriginal;
  }

  set isDismissible(value) {
    this._isDismissibleOriginal = value;
    this._isDismissible = normaliseBoolean(value, {
      acceptString: true,
      defaultValue: ISDISMISSIBLE_FALLBACK
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-alert": true,
      [this._variant]: this._variant,
      "rpl-alert--closed": this.dismissed,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    };
  }

  get computedAriaLabelledBy() {
    return `alert-message-${this.alertId || "unidentified"}`;
  }

  get i18n() {
    return I18N;
  }

  get computedHasTextAndUrl() {
    return this.linkText && this.linkUrl;
  }

  /* event management */

  handleClose() {
    this.dispatchEvent(
      new CustomEvent("dismiss", {
        detail: {
          id: this.alertId,
          action: "close",
          label: this.message,
          text: I18N.closeLabel
        },
        bubbles: true
      })
    );
  }

  handleResizeHeight(height) {
    const alertRef = this.refs.alert;

    if (alertRef.style.display !== "none") {
      alertRef.style.setProperty("--local-container-height", `${height}px`);
    }
  }
}
