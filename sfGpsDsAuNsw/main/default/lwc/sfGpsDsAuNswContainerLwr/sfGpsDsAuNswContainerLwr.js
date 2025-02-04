import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseString, isString } from "c/sfGpsDsHelpers";

const MODE_VALUES = {
  default: "",
  flush: "nsw-container--flush"
};
const MODE_DEFAULT = "default";

/**
 * @slot Container
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api containerClassName;

  /* api: mode, picklist */

  _mode = MODE_VALUES[MODE_DEFAULT];
  _modeOriginal = MODE_DEFAULT;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(
      isString(value) ? value.toLowerCase() : value,
      {
        validValues: MODE_VALUES,
        fallbackValue: MODE_DEFAULT,
        returnObjectValue: true
      }
    );
  }

  /* computed */

  get computedContainerClassName() {
    return {
      "nsw-container": true,
      [this._mode]: this._mode,
      [this.containerClassName]: this.containerClassName
    };
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
