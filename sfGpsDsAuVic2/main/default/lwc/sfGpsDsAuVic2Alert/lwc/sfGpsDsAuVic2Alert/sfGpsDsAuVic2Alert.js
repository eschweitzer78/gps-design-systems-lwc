import { LightningElement, api } from "lwc";
import { normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";
import ResizeHeightMixin from "c/sfGpsDsAuVic2ResizeHeightMixin";

const CLOSE_LABEL = "Dismiss alert";

export default class SfGpsDsAuVic2Alert extends ResizeHeightMixin(
  LightningElement,
  "alert"
) {
  @api variant = "information";
  @api iconName = "icon-information-circle-filled";
  @api message = "";
  @api linkText = "";
  @api linkUrl = "";
  @api dismissed = false;
  @api alertId;

  _isDismissbleOriginal = true;
  _isDismissible = true;

  @api get isDismissible() {
    return this._isDismissbleOriginal;
  }

  set isDismissible(value) {
    this._isDismissibleOriginal = value;
    this._isDismissible = normaliseBoolean(value, {
      acceptString: true,
      defaultValue: false
    });
  }

  @api className;

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-alert": true,
      "rpl-alert--information":
        (this.variant || "information") === "information",
      "rpl-alert--warning": this.variant === "warning",
      "rpl-alert--error": this.variant === "error",
      "rpl-alert--closed": this.dismissed,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
  }

  get computedAriaLabelledBy() {
    return `alert-message-${this.alertId}`;
  }

  get closeLabel() {
    return CLOSE_LABEL;
  }

  get hasTextAndUrl() {
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
          text: CLOSE_LABEL
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
