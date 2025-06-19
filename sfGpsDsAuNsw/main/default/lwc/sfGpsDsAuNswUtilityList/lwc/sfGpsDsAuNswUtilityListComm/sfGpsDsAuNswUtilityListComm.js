import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, toArray } from "c/sfGpsDsHelpers";
const SHARECONFIG_DEFAULT = [];
const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswUtilityListComm";
export default class sfGpsDsAuNswUtilityListComm extends SfGpsDsLwc {
  // @ts-ignore
  @api
  printLabel;
  // @ts-ignore
  @api
  copyLabel;
  // @ts-ignore
  @api
  shareLabel;
  // @ts-ignore
  @api
  shareUrl;
  // @ts-ignore
  @api
  className;
  /* api: shareConfig */
  _shareConfigOriginal = JSON.stringify(SHARECONFIG_DEFAULT);
  _shareConfig = SHARECONFIG_DEFAULT;
  // @ts-ignore
  @api
  get shareConfig() {
    return this._shareConfigOriginal;
  }
  set shareConfig(value) {
    this._shareConfigOriginal = value;
    let targetValue;
    if (isString(value)) {
      try {
        targetValue = toArray(JSON.parse(value));
      } catch (e) {
        targetValue = SHARECONFIG_DEFAULT;
        this.addError(
          "JS-LI",
          "The share config attribute must be in JSON object format."
        );
        if (DEBUG) console.debug(CLASS_NAME, "set shareConfig", e);
      }
    } else {
      targetValue = SHARECONFIG_DEFAULT;
    }
    this._shareConfig = targetValue;
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
