import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCardContentComm extends SfGpsDsLwc {
  @api image;
  @api imageAlt;
  @api focalPointX;
  @api focalPointY;
  @api width;
  @api height;
  @api border = false;
  @api center = false;
  @api type = "default"; // default, simple, inline
  @api className;

  /* link */

  _originalLink;
  @track _link;

  @api get link() {
    return this._originalLink;
  }

  set link(markdown) {
    this._originalLink = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
    }
  }

  /* content */

  _content;
  _contentHtml;

  @api get content() {
    return this._content;
  }

  set content(markdown) {
    this._content = markdown;
    try {
      if (markdown) {
        this._contentHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
      } else {
        this._contentHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* computed */

  get _focalPoint() {
    return this.focalPointX && this.focalPointY
      ? { x: this.focalPointX, y: this.focalPointY }
      : null;
  }

  /* lifecycle */

  renderedCallback() {
    let element;

    if (this.content) {
      if ((element = this.template.querySelector(".sfGpsDsMarkdown"))) {
        replaceInnerHtml(element, this._contentHtml);
      } else {
        this.addError(
          "RC-PHC",
          "Couldn't find internal content markdown placeholder"
        );
      }
    }
  }
}
