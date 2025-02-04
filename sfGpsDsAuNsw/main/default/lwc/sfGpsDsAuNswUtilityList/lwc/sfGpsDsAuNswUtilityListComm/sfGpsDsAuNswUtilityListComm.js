import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, toArray } from "c/sfGpsDsHelpers";

const SHARECONFIG_DEFAULT = {};

export default class extends SfGpsDsLwc {
  @api printLabel;
  @api copyLabel;
  @api shareLabel;
  @api shareUrl;
  @api className;

  /* api: shareConfig */

  _shareConfigOriginal = SHARECONFIG_DEFAULT;
  _shareConfig = SHARECONFIG_DEFAULT;

  @api
  get shareConfig() {
    return this._shareConfigOriginal;
  }

  set shareConfig(value) {
    this._shareConfigOriginal = value;

    if (isString(value)) {
      try {
        value = toArray(JSON.parse(value));
      } catch (e) {
        value = SHARECONFIG_DEFAULT;
        this.addError(
          "JS-LI",
          "The share config attribute must be in JSON object format."
        );
      }
    } else {
      value = SHARECONFIG_DEFAULT;
    }
    this._shareConfig = value;
  }

  /* computed */

  get computedShareUrl() {
    return this.shareUrl || window.location.href;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
