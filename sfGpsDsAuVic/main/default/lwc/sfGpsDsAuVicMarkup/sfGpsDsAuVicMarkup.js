import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  isRTL,
  replaceInnerHtml,
  computeClass,
  HtmlSanitizer
} from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicMarkup extends SfGpsDsLwc {
  _originalHtml;
  _espacedHtml;

  @api set html(value) {
    this._originalHtml = value;
    this._escapedHtml = value ? HtmlSanitizer.sanitize(value) : null;
  }

  @api className;

  get html() {
    return this._originalHtml;
  }

  get computedClass() {
    return (
      computeClass({
        "rpl-markup": true,
        "rpl-markup--rtl": isRTL()
      }) + (this.className ? " " + this.className : "")
    );
  }

  _rendered = false;

  renderedCallback() {
    if (this._rendered == false) {
      let element = this.template.querySelector(".rpl-markup__inner");
      if (element) {
        replaceInnerHtml(element, this._escapedHtml);
      } else {
        this.addError("MU-PH", "Couldn't find internal markup placeholder");
      }

      this._rendered = true;
    }
  }
}
