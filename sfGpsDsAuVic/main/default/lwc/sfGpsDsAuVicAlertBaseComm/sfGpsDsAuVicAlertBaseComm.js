import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicAlertBaseComm extends SfGpsDsLwc {
  _contentOriginal;
  _contentHtml;

  @api get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;

    try {
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  @api backgroundColor;
  @api iconSymbol;
  @api iconColor;
  @api closeIconColor;
  @api className;

  renderedCallback() {
    console.log("renderedCallback");

    if (this.content) {
      let element = this.template.querySelector(".sfGpsMarkdown");
      if (element) {
        replaceInnerHtml(element, this._contentHtml);
      } else {
        this.addError(
          "CO-PH",
          "Couldn't find internal content markup placeholder"
        );
      }
    }
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
