import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isRTL, replaceInnerHtml, HtmlSanitizer } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api className;

  /* api: html */

  _htmlSanitized;
  _htmlOriginal;

  @api
  get html() {
    return this._htmlOriginal;
  }

  set html(value) {
    this._htmlOriginal = value;
    this._htmlSanitized = value ? HtmlSanitizer.sanitize(value) : null;
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-markup": true,
      "rpl-markup--rtl": isRTL(),
      [this.className]: this.className
    };
  }

  /* lifecycle */

  renderedCallback() {
    const element = this.refs.inner;

    if (this.html) {
      if (element && this._htmlSanitized) {
        replaceInnerHtml(element, this._htmlSanitized);
      }
    }
  }
}
