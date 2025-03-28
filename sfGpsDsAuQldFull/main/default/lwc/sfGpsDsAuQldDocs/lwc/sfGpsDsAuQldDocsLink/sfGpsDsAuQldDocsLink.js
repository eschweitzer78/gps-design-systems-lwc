import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const ISEXTERNAL_DEFAULT = false;
const ISSMALL_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api url;
  @api iconPosition = "start";

  /* api: isExternal */

  _isExternal = ISEXTERNAL_DEFAULT;
  _isExternalOriginal = ISEXTERNAL_DEFAULT;

  @api
  get isExternal() {
    return this._isExternalOriginal;
  }

  set isExternal(value) {
    this._isExternalOriginal = value;
    this._isExternal = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISEXTERNAL_DEFAULT
    });
  }

  /* api: isSmall */

  _isSmall = ISSMALL_DEFAULT;
  _isSmallOriginal = ISSMALL_DEFAULT;

  @api
  get isSmall() {
    return this._isSmallOriginal;
  }

  set isSmall(value) {
    this._isSmallOriginal = value;
    this._isSmall = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISSMALL_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "docs-link": true
    };
  }

  get computedShowIconStart() {
    return this._isExternal && this.iconPosition === "start";
  }

  get computedShowIconEnd() {
    return this._isExternal && this.iconPosition === "end";
  }
}
