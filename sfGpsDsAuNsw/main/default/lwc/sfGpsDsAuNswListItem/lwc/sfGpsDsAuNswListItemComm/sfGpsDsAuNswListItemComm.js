import { api } from "lwc";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const DATE_STYLE_DEFAULT = "medium";
const HEADLINE_DEFAULT = {};

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswListItemComm";

export default class extends SfGpsDsLwc {
  @api label;
  @api image;
  @api imageAlt;
  @api isBlock = false;
  @api isReversed = false;
  @api showLink = false;
  @api dateStyle = DATE_STYLE_DEFAULT;
  @api className;

  // This is not exposed in Experience Builder and is used by listItemCollectionComm
  @api useMarkup = false;

  /* api: headline and link, String */

  _headline = HEADLINE_DEFAULT;
  _headlineOriginal;

  @api
  get headline() {
    return this._headlineOriginal;
  }

  set headline(markdown) {
    try {
      this._headlineOriginal = markdown;
      this._headline = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this._headline = HEADLINE_DEFAULT;
      this.addError("HL-MD", "Issue when parsing Headline markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set headline", e);
    }
  }

  /* api: date, String or Date */

  _date;
  _dateOriginal;

  @api
  get date() {
    return this._dateOriginal;
  }

  set date(value) {
    this._dateOriginal = value;

    if (value instanceof Date) {
      this._date = value;
    } else {
      this._date = value ? parseIso8601(value.toString()) : null;
    }
  }

  /* api: copy, String */

  _copyHtml;
  _copyOriginal;

  @api
  get copy() {
    return this._copyOriginal;
  }

  set copy(markdown) {
    try {
      this._copyOriginal = markdown;

      if (markdown) {
        this._copyHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
      } else {
        this._copyHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Copy markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set copy", e);
    }
  }

  /* api: tags */

  _tags;
  _tagsOriginal;

  @api
  get tags() {
    return this._tagsOriginal;
  }

  set tags(markdown) {
    try {
      this._tagsOriginal = markdown;
      this._tags = markdown ? mdEngine.extractLinks(markdown) : null;
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Tags markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set tags", e);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this._copyOriginal) {
      replaceInnerHtml(this.refs.copy, this._copyHtml);
    }
  }
}
