import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const SIZE_DEFAULT = "small";
const SIZE_VALUES = {
  small: "",
  medium: "qld__horizontal-rule--md",
  large: "qld__horizontal-rule--lg"
};

export default class extends LightningElement {
  @api className;

  /* api: size */

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

  /* getters */

  get computedClassName() {
    return {
      "qld__horizontal-rule": true,
      [this._size]: this._size,
      [this.className]: this.className
    };
  }
}
