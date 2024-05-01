import { api } from "lwc";
import {
  computeClass,
  normaliseString,
  replaceInnerHtml
} from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  RplLinkTypes,
  LINK_TYPE_DEFAULT
} from "c/sfGpsDsAuVic2HeaderConstants";

/**
 * @slot introContent
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api linksTitle;
  @api iconName;
  @api className;

  /* api: links */

  _linksOriginal;
  _links;

  @api get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    this._linksOriginal = markdown;

    try {
      this._links = markdown ? mdEngine.extractLinks(markdown) : null;
    } catch (e) {
      this._links = null;
      this.addError("ML-MD", "Issue when parsing Links markdown");
    }
  }

  /* api: linksType */

  _linksTypeOriginal = LINK_TYPE_DEFAULT;
  _linksType = LINK_TYPE_DEFAULT;

  @api get linksType() {
    return this._linksTypeOriginal;
  }

  set linksType(value) {
    this._linksTypeOriginal = value;
    this._linksType = normaliseString(value, {
      validValues: RplLinkTypes,
      fallbackValue: LINK_TYPE_DEFAULT
    });
  }

  /* api: linksMore */

  _linksMoreOriginal;
  _linksMore;

  @api get linksMore() {
    return this._linksMoreOriginal;
  }

  set linksMore(markdown) {
    this._linksMoreOriginal = markdown;

    try {
      this._linksMore = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this._linksMore = null;
      this.addError("ML-MD", "Issue when parsing Links more markdown");
    }
  }

  /* api: content */

  _contentOriginal;
  _contentHtml;

  @api get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;

    try {
      this._contentHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  get decoratedItems() {
    return (this._links || []).map((item) => ({
      ...item,
      icon: item.icon || "icon-arrow-right"
    }));
  }

  get computedDisplayLinks() {
    return this._links?.length;
  }

  get computedClassName() {
    return computeClass({
      "rpl-header--intro": true,
      [this.className]: this.className
    });
  }

  // eslint-disable-next-line no-unused-vars
  handleItemClick(event) {
    console.log("handleItemClick");
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
  }
}
