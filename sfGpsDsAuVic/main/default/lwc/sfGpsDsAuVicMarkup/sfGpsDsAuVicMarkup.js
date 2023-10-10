import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  isRTL,
  replaceInnerHtml,
  computeClass,
  HtmlSanitizer
} from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicMarkup extends SfGpsDsLwc {
  static renderMode = "light";

  _htmlOriginal;
  _htmlSanitized;

  @api get html() {
    return this._htmlOriginal;
  }

  set html(value) {
    this._htmlOriginal = value;
    this._htmlSanitized = value ? HtmlSanitizer.sanitize(value) : null;
  }

  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-markup": true,
      "rpl-markup--rtl": isRTL(),
      [this.className]: this.className
    });
  }

  renderedCallback() {
    if (this.html) {
      let element = this.querySelector(".rpl-markup__inner");

      if (element && this._htmlSanitized) {
        replaceInnerHtml(element, this._htmlSanitized);
      }
    }
  }
}
