import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const SIZE_SM = "small";
const SIZE_MD = "medium";
const SIZE_LG = "large";
const SIZE_VALUES = [SIZE_SM, SIZE_MD, SIZE_LG];
const SIZE_DEFAULT = SIZE_SM;

export default class extends LightningElement {
  @api className;

  /* api: size */

  _size;
  _sizeOriginal;

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

  /* getters */

  get computedClassName() {
    return computeClass({
      "qld__horizontal-rule": true,
      "qld__horizontal-rule--md": this._size === SIZE_MD,
      "qld__horizontal-rule--lg": this._size === SIZE_LG,
      [this.className]: this.className
    });
  }
}
