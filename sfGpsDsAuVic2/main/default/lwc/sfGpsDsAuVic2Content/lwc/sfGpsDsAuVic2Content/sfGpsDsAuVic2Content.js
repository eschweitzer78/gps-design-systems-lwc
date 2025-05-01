import { api, LightningElement } from "lwc";
import { replaceInnerHtml, HtmlSanitizer } from "c/sfGpsDsHelpers";
import defaultPlugIns from "c/sfGpsDsAuVic2HtmlPlugIns";

export default class extends LightningElement {
  @api className;

  /* api: html */

  _html;
  _originalHtml;

  @api
  get html() {
    return this._originalHtml;
  }

  set html(value) {
    this._originalHtml = value;

    try {
      this._html = value ? HtmlSanitizer.sanitize(value, defaultPlugIns) : null;
    } catch (e) {
      this._html = null;
      console.debug(e);
    }
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-content": true,
      [this.className]: this.className
    };
  }

  renderedCallback() {
    if (this._html) {
      replaceInnerHtml(this.refs.content, this._html);
    }
  }
}
