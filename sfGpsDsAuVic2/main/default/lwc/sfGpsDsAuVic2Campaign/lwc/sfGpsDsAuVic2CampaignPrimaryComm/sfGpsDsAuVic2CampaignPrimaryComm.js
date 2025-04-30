import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2CampaignPrimaryComm";

/**
 * @slot Content
 * @slot Meta
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api image;
  @api className;

  /* api: link */

  _link;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this._link = null;
      this.addError("ML-MD", "Issue when parsing Link markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set link", e);
    }
  }

  /* api: content */

  _contentHtml;
  _contentOriginal;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    try {
      this._contentOriginal = markdown;
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set markdown", e);
    }
  }

  /* api: meta */

  _metaHtml;
  _metaOriginal;

  @api
  get meta() {
    return this._metaOriginal;
  }

  set meta(markdown) {
    try {
      this._metaOriginal = markdown;
      this._metaHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Meta markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set meta", e);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      replaceInnerHtml(this.refs.content, this._contentHtml);
    }

    if (this._metaOriginal) {
      replaceInnerHtml(this.refs.meta, this._metaHtml);
    }
  }
}
