import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const MODE_DEFAULT = "default";
const MODE_VIEWALL = "view-all";
const MODE_VALUES = [MODE_DEFAULT, MODE_VIEWALL];

export default class extends LightningElement {
  @api label;
  @api url;
  @api className;

  /* api: mode */

  _mode;
  _modeOriginal;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });
  }

  get computedClassName() {
    return {
      "qld__cta-link": true,
      "qld__cta-link--view-all": this._mode === MODE_VIEWALL,
      [this.className]: this.className
    };
  }
}
