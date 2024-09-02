import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const SIZE_SM = "sm";
const SIZE_MD = "md";
const SIZE_LG = "lg";
const SIZE_XL = "xl";
const SIZE_VALUES = [SIZE_LG, SIZE_MD, SIZE_SM, SIZE_XL];
const SIZE_DEFAULT = SIZE_XL;

export default class SfGpsDsAuNswLoader extends LightningElement {
  @api label;
  @api className;

  _sizeOriginal = SIZE_XL;
  _size = SIZE_XL;

  @api get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: SIZE_VALUES,
      fallbackValue: SIZE_DEFAULT
    });
  }

  get computedSpanClassName() {
    return computeClass({
      "nsw-loader__circle": true,
      "nsw-loader__circle--sm": this.size === SIZE_SM,
      "nsw-loader__circle--md": this.size === SIZE_MD,
      "nsw-loader__circle--lg": this.size === SIZE_LG
    });
  }

  get computedClassName() {
    return computeClass({
      "nsw-loader": true,
      [this.className]: this.className
    });
  }
}
