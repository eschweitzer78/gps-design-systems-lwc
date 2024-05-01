import { api, track } from "lwc";
import {
  computeClass,
  normaliseString,
  normaliseBoolean,
  replaceInnerHtml
} from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  RplHeaderThemes,
  THEME_DEFAULT,
  RplLinkTypes,
  LINK_TYPE_DEFAULT
} from "c/sfGpsDsAuVic2HeaderConstants";

const CORNER_TOP_DEFAULT = true;
const CORNER_BOTTOM_DEFAULT = true;

/**
 * @slot heroContent
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api logo;
  @api background;
  @api secondaryActionTitle;
  @api linksTitle;
  @api breadcrumbs = false;
  @api behindNav = false;
  @api fullWidth = false;
  @api className;

  /* api: cornerTop */

  _cornerTopOriginal = CORNER_TOP_DEFAULT;
  _cornerTop = CORNER_TOP_DEFAULT;

  @api get cornerTop() {
    return this._cornerTopOriginal;
  }

  set cornerTop(value) {
    this._cornerTopOriginal = value;
    this._cornerTop = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: CORNER_BOTTOM_DEFAULT
    });
  }

  @api cornerTopImage;

  /* api: cornerBottom */

  _cornerBottomOriginal = CORNER_BOTTOM_DEFAULT;
  _cornerBottom = CORNER_BOTTOM_DEFAULT;

  @api get cornerBottom() {
    return this._cornerBottomOriginal;
  }

  set cornerBottom(value) {
    this._cornerBottomOriginal = value;
    this._cornerBottom = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: CORNER_BOTTOM_DEFAULT
    });
  }

  @api cornerBottomImage;

  /* api: theme */

  _themeOriginal = THEME_DEFAULT;
  _theme = THEME_DEFAULT;

  @api get theme() {
    return this._themeOriginal;
  }

  set theme(value) {
    this._themeOriginal = value;
    this._value = normaliseString(value, {
      validValues: RplHeaderThemes,
      fallbackValue: THEME_DEFAULT
    });
  }

  /* api: primaryAction */

  _primaryActionOriginal;
  _primaryAction;

  @api get primaryAction() {
    return this._primaryActionOriginal;
  }

  set primaryAction(markdown) {
    this._primaryActionOriginal = markdown;

    try {
      this._primaryAction = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this._primaryAction = null;
      this.addError("ML-MD", "Issue when parsing Primary action markdown");
    }
  }

  /* api: secondaryAction */

  _secondaryActionOriginal;
  _secondaryAction;

  @api get secondaryAction() {
    return this._secondaryActionOriginal;
  }

  set secondaryAction(markdown) {
    this._secondaryActionOriginal = markdown;

    try {
      this._secondaryAction = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this._secondaryAction = null;
      this.addError("ML-MD", "Issue when parsing Secondary action markdown");
    }
  }

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

  @track hasDefaultSlot;

  /* getters */

  get computedHasBehindSlot() {
    return this.background || this.cornerTop || this.cornerBottom;
  }

  get computedBackground() {
    let background = this.background;

    if (typeof background === "string") {
      try {
        background = JSON.parse(background);
      } catch (e) {
        this.addError("CO-MD", "Issue when parsing Background details");
        return null;
      }
    }

    if (typeof background !== "object") {
      this.addError("CO-MD", "Issue when parsing Background details");
      return null;
    }

    return {
      ...background,
      priority: "high",
      aspect: {
        xs: "wide",
        m: "wide"
      },
      sizes: "xs:100vw"
    };
  }

  get computedShowHeaderActions() {
    return (this._primaryAction || this.secondaryAction) && !this.background;
  }

  get computedShowHeaderLinks() {
    return this._links?.length && !this.background;
  }

  get computedHighlight() {
    return this.theme === "reverse" || this.theme === "neutral";
  }

  get computedClassName() {
    return computeClass({
      "rpl-header--hero": true,
      [`rpl-header--${this.theme}`]: this._theme,
      "rpl-header--behind-nav": this.behindNav,
      "rpl-header--breadcrumbs": this.breadcrumbs,
      "rpl-header--graphic-top": this.cornerTop,
      "rpl-header--graphic-bottom": this.cornerBottom,
      "rpl-header--background": this.background,
      [this.className]: this.className
    });
  }

  get computedTitleClassName() {
    return computeClass({
      "rpl-header__title": true,
      "rpl-type-h1": !this.computedHighlight,
      "rpl-type-h1-highlight": this.computedHighlight
    });
  }

  get computedContentClasses() {
    if (!this.hasDefaultSlot && !this.content) return null;

    return this.computedHighlight
      ? "rpl-type-p-large-highlight"
      : "rpl-type-p-large";
  }

  get decoratedItems() {
    return (this._links || []).map((item) => ({
      ...item,
      icon: item.icon || "icon-arrow-right"
    }));
  }

  get decoratedSecondaryAction() {
    return this._secondaryAction || this.secondaryActionTitle
      ? {
          title: this.secondaryActionTitle,
          text: this._secondaryAction?.text,
          url: this._secondaryAction?.url
        }
      : null;
  }

  /* event management */

  handleItemClick() {
    console.log("handleItemClick");
  }

  handleSlotChange(event) {
    const an = event.target.assignedNodes();
    let emptyNode = true;

    /* 
      Try and determine if it's an empty design node...
      very imperfect as further edits won't be detected, but at least it's good on reload 
    */

    if (an.length) {
      if (an[0].tagName?.startsWith("WEBRUNTIMEDESIGN")) {
        if (an[0].querySelector(".actualNode")) {
          emptyNode = false;
        }
      } else {
        emptyNode = false;
      }
    }

    this.hasDefaultSlot = !emptyNode;
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = false;
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      replaceInnerHtml(this.refs.content, this._contentHtml);
    }
  }
}
