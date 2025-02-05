import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const SIZE_DEFAULT = "xl";
const SIZE_VALUES = {
  xl: "",
  lg: "nsw-loader__circle--lg",
  md: "nsw-loader__circle--md",
  sm: "nsw-loader__circle--sm"
};

export default class extends LightningElement {
  @api label;
  @api className;

  /* api: size, String */

  _size = SIZE_VALUES[SIZE_DEFAULT];
  _sizeOriginal = SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: SIZE_VALUES,
      fallbackValue: SIZE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedSpanClassName() {
    return {
      "nsw-loader__circle": true,
      [this._size]: this._size
    };
  }

  get computedClassName() {
    return {
      "nsw-loader": true,
      [this.className]: this.className
    };
  }
}
