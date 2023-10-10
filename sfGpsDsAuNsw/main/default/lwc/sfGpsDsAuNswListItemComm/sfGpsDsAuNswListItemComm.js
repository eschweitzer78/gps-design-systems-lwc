import { LightningElement, api, track } from "lwc";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswListItemComm extends LightningElement {
  @api isBlock = false;
  @api isReversed = false;
  @api showLink = false;
  @api dateStyle = "medium";
  @api label;
  @api image;
  @api imageAlt;
  @api className;

  // This is not exposed in Experience Builder and is used by listItemCollectionComm
  @api useMarkup = false;

  /*
   * headline and link
   */

  @track _headline = { text: null, link: null }; // combined link into headline
  _originalHeadline;

  @api get headline() {
    return this._originalHeadline;
  }

  set headline(markdown) {
    this._originalHeadline = markdown;

    try {
      this._headline = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this._headline = { text: null, link: null };
      this.addError("HL-MD", "Issue when parsing Headline markdown");
    }
  }

  /*
   * date
   */

  @track _date;
  _originalDate;

  @api get date() {
    return this._originalDate;
  }

  set date(date) {
    this._originalDate = date;

    if (date instanceof Date) {
      this._date = date;
    } else {
      this._date = date ? parseIso8601(date.toString()) : null;
    }
  }

  /*
   * copy
   */

  _copy;
  _copyHtml;

  @api get copy() {
    return this._copy;
  }

  set copy(markdown) {
    this._copy = markdown;
    try {
      if (markdown) {
        this._copyHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
      } else {
        this._copyHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Copy markdown");
    }
  }

  /*
   * tags
   */

  @track _links;
  _originalLinks;

  @api get tags() {
    return this._originalLinks;
  }

  set tags(markdown) {
    this._originalLinks = markdown;

    try {
      if (markdown) {
        this._links = mdEngine.extractLinks(markdown);
      } else {
        this._links = null;
      }
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Tags markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this.copy) {
      let element = this.template.querySelector(".nsw-list-item__copy");

      if (element) {
        replaceInnerHtml(element, this._copyHtml);
      }
    }
  }
}
