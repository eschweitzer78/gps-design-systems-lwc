import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import ResizeHeightMixin from "c/sfGpsDsAuVic2ResizeHeightMixin"

const I18N = {
  closeLabel: "Dismiss alert"
};

const ISDISMISSIBLE_DEFAULT = true;

type Variant = 
  "information" | 
  "warning" | 
  "error";

const VARIANT_DEFAULT: Variant = "information";
const VARIANT_VALUES: Record<Variant, string> = {
  information: "rpl-alert--information",
  warning: "rpl-alert--warning",
  error: "rpl-alert--error"
};

export default 
class SfGpsDsAuVic2Alert
extends ResizeHeightMixin<SfGpsDsElement>(
  SfGpsDsElement, 
  "alert"
) {
  // @ts-ignore
  @api 
  iconName = "icon-information-circle-filled";

  // @ts-ignore
  @api 
  message = "";

  // @ts-ignore
  @api 
  linkText = "";

  // @ts-ignore
  @api 
  linkUrl = "";

  // @ts-ignore
  @api 
  dismissed = false;
  // @ts-ignore
  @api 
  alertId?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* api: variant */

  // @ts-ignore
  @api
  variant?: Variant;
  _variant = this.defineEnumObjectProperty<string, Variant>("variant", {
    validValues: VARIANT_VALUES,
    defaultValue: VARIANT_DEFAULT
  });

  /* api: isDismissible */

  // @ts-ignore
  @api
  isDismissible?: boolean;
  _isDismissible = this.defineBooleanProperty("isDismissible", {
    defaultValue: ISDISMISSIBLE_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "rpl-alert": true,
      [this._variant.value || ""]: !!this._variant.value,
      "rpl-alert--closed": this.dismissed,
      "rpl-u-screen-only": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedAriaLabelledBy() {
    return `alert-message-${this.alertId || "unidentified"}`;
  }

  get i18n() {
    return I18N;
  }

  get computedHasTextAndUrl() {
    return !!this.linkText && !!this.linkUrl;
  }

  /* event management */

  handleClose(_event: MouseEvent): void {
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

  handleResizeHeight(height: number) {
    const alertRef = this.refs.alert;

    if (alertRef && alertRef.style.display !== "none") {
      alertRef.style.setProperty("--local-container-height", `${height}px`);
    }
  }
}
