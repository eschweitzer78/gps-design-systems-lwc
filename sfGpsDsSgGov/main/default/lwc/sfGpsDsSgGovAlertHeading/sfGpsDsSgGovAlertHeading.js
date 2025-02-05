import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api className;

  /* api: headerTag */

  _headerTagOriginal;
  _headerTag;

  @api
  get headerTag() {
    return this._headerTagOriginal;
  }

  set headerTag(value) {
    this._headerTagOriginal = value;
    this._headerTag = normaliseString(value, {
      validValues: ["h1", "h2", "h3", "h4", "h5", "h6"],
      fallbackValue: "h4"
    });
  }

  /* getters */

  get computedClassName() {
    return {
      [this._headerTag]: this._headerTag,
      [this.className]: this.className
    };
  }
}
