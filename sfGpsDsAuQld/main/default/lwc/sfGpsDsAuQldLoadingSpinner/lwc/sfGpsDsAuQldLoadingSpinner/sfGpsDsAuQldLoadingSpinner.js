import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const MODE_DEFAULT = "default";
const MODE_LANDSCAPE = "landscape";
const MODE_MINIMAL = "minimal";
const MODE_VALUES = [MODE_DEFAULT, MODE_LANDSCAPE, MODE_MINIMAL];

export default class extends LightningElement {
  @api label = "Loading...";
  @api className;

  _mode = MODE_DEFAULT;
  _modeOriginal = MODE_DEFAULT;

  @api get mode() {
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
    return computeClass({
      qld__loading_spinner: true,
      "qld__loading_spinner--landscape": this.mode === MODE_LANDSCAPE,
      "qld__loading_spinner--icon_only": this.mode === MODE_MINIMAL,
      [this.className]: this.className
    });
  }
}
