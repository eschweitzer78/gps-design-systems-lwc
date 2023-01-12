import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicDocumentLinkComm extends SfGpsDsLwc {
  /* api: name, string in link markdown format */

  _nameOriginal;
  @track _name = {};

  @api get name() {
    return this._nameOriginal;
  }

  set name(markdown) {
    this._linkOriginal = markdown;

    try {
      this._name = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._name = {};
    }
  }

  /* api: caption */

  _captionOriginal;
  _captionHtml;

  @api get caption() {
    return this._captionOriginal;
  }

  set caption(markdown) {
    this._captionOriginal = markdown;

    try {
      this._captionHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Caption markdown");
    }
  }

  // @api url; //  replaced by markdown in name
  @api extension; // string
  @api filesize; // number
  @api updated; // string in ISO format
  @api className; // string

  get parsedUpdated() {
    return this.updated ? parseIso8601(this.updated) : null;
  }

  /* lifecycle */

  _rendered;

  renderedCallback() {
    if (!this._rendered) {
      let element = this.template.querySelector(".sfGpsMarkdown");

      if (element) {
        replaceInnerHtml(element, this._captionHtml);
      } else {
        this.addError(
          "CO-PH",
          "Couldn't find internal Caption markdown placeholder"
        );
      }

      this._rendered = true;
    }
  }
}
