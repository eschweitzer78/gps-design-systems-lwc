import { LightningElement, api } from "lwc";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api url;
  @api iconPosition = "start";

  /* api: isExternal */

  _isExternalOriginal;
  _isExternal;

  @api get isExternal() {
    return this._isExternalOriginal;
  }

  set isExternal(value) {
    this._isExternalOriginal = value;
    this._isExternal = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: isSmall */

  _isSmallOriginal;
  _isSmall;

  @api get isSmall() {
    return this._isSmallOriginal;
  }

  set isSmall(value) {
    this._isSmallOriginal = value;
    this._isSmall = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* computed */

  get computedClassName() {
    return computeClass({
      "docs-link": true,
      "rpl-type-p": !this.isSmall,
      "rpl-type-p-small": this.isSmall
    });
  }

  get computedShowIconStart() {
    return this._isExternal && this.iconPosition === "start";
  }

  get computedShowIconEnd() {
    return this._isExternal && this.iconPosition === "end";
  }
}
