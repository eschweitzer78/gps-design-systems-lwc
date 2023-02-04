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

  _originalHtml;
  _escapedHtml;

  @api get html() {
    return this._originalHtml;
  }

  set html(value) {
    this._originalHtml = value;
    this._escapedHtml = value ? HtmlSanitizer.sanitize(value) : null;
  }

  @api className;

  get computedClass() {
    return (
      computeClass({
        "rpl-markup": true,
        "rpl-markup--rtl": isRTL()
      }) + (this.className ? " " + this.className : "")
    );
  }

  renderedCallback() {
    let element = this.querySelector(".rpl-markup__inner"); //this.template.querySelector(".rpl-markup__inner");
    if (element) {
      replaceInnerHtml(element, this._escapedHtml);
    } else {
      this.addError("MU-PH", "Couldn't find internal markup placeholder");
    }
  }
}
