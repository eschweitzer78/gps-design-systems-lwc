import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const MODE_DEFAULT = "default";
const MODE_VALUES = {
  default: "",
  landscape: "qld__loading_spinner--landscape",
  minimal: "qld__loading_spinner--icon_only"
};

export default class extends LightningElement {
  @api label = "Loading...";
  @api className;

  /* api: mode */

  _mode = MODE_VALUES[MODE_DEFAULT];
  _modeOriginal = MODE_DEFAULT;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedClassName() {
    return {
      qld__loading_spinner: true,
      [this._mode]: this._mode,
      [this.className]: this.className
    };
  }
}
