import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const RplTagVariants = {
  default: "rpl-tag--default",
  neutral: "rpl-tag--neutral"
};
const VARIANT_DEFAULT = "default";

export default class extends LightningElement {
  @api label;
  @api className;

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = RplTagVariants[VARIANT_DEFAULT];

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: RplTagVariants,
      fallbackValue: VARIANT_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-tag": true,
      "rpl-type-label-small": true,
      [this._variant]: this._variant,
      [this.className]: this.className
    };
  }
}
