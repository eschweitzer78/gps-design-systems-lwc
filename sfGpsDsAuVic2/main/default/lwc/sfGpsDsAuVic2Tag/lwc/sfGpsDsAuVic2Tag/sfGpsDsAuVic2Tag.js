import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const RplTagVariants = ["default", "neutral"]; //, "dark"];
const VARIANT_DEFAULT = RplTagVariants[0];

export default class SfGpsDsAuVic2Tag extends LightningElement {
  _variantOriginal = VARIANT_DEFAULT;
  _variant = VARIANT_DEFAULT;

  @api get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: RplTagVariants,
      fallbackValue: VARIANT_DEFAULT
    });
  }

  @api label;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-tag": true,
      [`rpl-tag--${this.variant}`]: this.variant,
      "rpl-type-label-small": true,
      [this.className]: this.className
    });
  }
}
