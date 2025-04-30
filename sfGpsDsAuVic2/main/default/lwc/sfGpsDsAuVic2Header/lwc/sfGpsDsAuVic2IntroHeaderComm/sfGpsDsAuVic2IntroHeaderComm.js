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

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2IntroHeaderComm";

/**
 * @slot introContent
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api linksTitle;
  @api showIcon;
  @api iconName;
  @api className;

  /* api: links */

  _links;
  _linksOriginal;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    try {
      this._linksOriginal = markdown;
      this._links = markdown ? mdEngine.extractLinks(markdown) : null;
    } catch (e) {
      this._links = null;
      this.addError("ML-MD", "Issue when parsing Links markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set links", e);
    }
  }

  /* api: linksType */

  _linksType = LINK_TYPE_DEFAULT;
  _linksTypeOriginal = LINK_TYPE_DEFAULT;

  @api
  get linksType() {
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

  _linksMore;
  _linksMoreOriginal;

  @api
  get linksMore() {
    return this._linksMoreOriginal;
  }

  set linksMore(markdown) {
    try {
      this._linksMoreOriginal = markdown;
      this._linksMore = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this._linksMore = null;
      this.addError("ML-MD", "Issue when parsing Links more markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set linksMore", e);
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
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
    }
  }

  /* computed */

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

  get computedIconName() {
    return this.showIcon ? this.iconName : null;
  }

  // eslint-disable-next-line no-unused-vars
  handleItemClick(event) {
    if (DEBUG) console.debug(CLASS_NAME, "handleItemClick");
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
