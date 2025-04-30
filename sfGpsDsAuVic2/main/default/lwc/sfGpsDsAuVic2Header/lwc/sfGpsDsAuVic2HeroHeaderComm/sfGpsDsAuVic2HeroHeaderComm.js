import { api, track } from "lwc";
import {
  isString,
  isObject,
  normaliseString,
  normaliseBoolean,
  replaceInnerHtml,
  computeClass
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
const LOGO_DEFAULT = {};
const BREADCRUMBS_DEFAULT = false;
const BEHINDNAV_DEFAULT = false;
const FULLWIDTH_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2HeroHeaderComm";

/**
 * @slot heroContent
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api background;
  @api secondaryActionTitle;
  @api linksTitle;
  @api className;

  /* api: breadcrumbs */

  _breadcrumbs = BREADCRUMBS_DEFAULT;
  _breadcrumbsOriginal = BREADCRUMBS_DEFAULT;

  @api
  get breadcrumbs() {
    return this._breadcrumbsOriginal;
  }

  set breadcrumbs(value) {
    this._breadcrumbsOriginal = value;
    this._breadcrumbs = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: BREADCRUMBS_DEFAULT
    });
  }

  /* api: behindNav */

  _behindNav = BEHINDNAV_DEFAULT;
  _behindNavOriginal = BEHINDNAV_DEFAULT;

  @api
  get behindNav() {
    return this._behindNavOriginal;
  }

  set behindNav(value) {
    this._behindNavOriginal = value;
    this._behindNav = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: BEHINDNAV_DEFAULT
    });
  }

  /* api: fullWidth */

  _fullWidth = FULLWIDTH_DEFAULT;
  _fullWidthOriginal = FULLWIDTH_DEFAULT;

  @api
  get fullWidth() {
    return this._fullWidthOriginal;
  }

  set fullWidth(value) {
    this._fullWidthOriginal = FULLWIDTH_DEFAULT;
    this._fullWidth = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FULLWIDTH_DEFAULT
    });
  }

  /* api: logo */

  _logo = LOGO_DEFAULT;
  _logoOriginal = JSON.stringify(LOGO_DEFAULT);

  @api
  get logo() {
    return this._logoOriginal;
  }

  set logo(value) {
    this._logoOriginal = value;

    try {
      this._logo = JSON.parse(value);
    } catch (e) {
      this._logo = {};
      if (DEBUG) console.debug(CLASS_NAME, "set logo", e);
    }
  }

  /* api: cornerTop */

  _cornerTop = CORNER_TOP_DEFAULT;
  _cornerTopOriginal = CORNER_TOP_DEFAULT;

  @api
  get cornerTop() {
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

  _cornerBottom = CORNER_BOTTOM_DEFAULT;
  _cornerBottomOriginal = CORNER_BOTTOM_DEFAULT;

  @api
  get cornerBottom() {
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

  _theme = THEME_DEFAULT;
  _themeOriginal = THEME_DEFAULT;

  @api
  get theme() {
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

  _primaryAction;
  _primaryActionOriginal;

  @api
  get primaryAction() {
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
      if (DEBUG) console.debug(CLASS_NAME, "set primaryAction", e);
    }
  }

  /* api: secondaryAction */

  _secondaryAction;
  _secondaryActionOriginal;

  @api
  get secondaryAction() {
    return this._secondaryActionOriginal;
  }

  set secondaryAction(markdown) {
    try {
      this._secondaryActionOriginal = markdown;
      this._secondaryAction = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this._secondaryAction = null;
      this.addError("ML-MD", "Issue when parsing Secondary action markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set secondaryAction", e);
    }
  }

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
      this._contentHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
    }
  }

  @track hasDefaultSlot;

  /* getters */

  get computedHasBehindSlot() {
    return this.background || this.cornerTop || this.cornerBottom;
  }

  get computedBackground() {
    let background = this.background;

    if (isString(background)) {
      try {
        background = JSON.parse(background);
      } catch (e) {
        this.addError("CO-MD", "Issue when parsing Background details");
        if (DEBUG) console.debug(CLASS_NAME, "get computedBackground", e);
        return null;
      }
    }

    if (!isObject(background)) {
      this.addError("CO-MD", "Issue when parsing Background details");
      return null;
    }

    return {
      ...background,
      priority: "high",
      aspect: this.computedBackImageRatio,
      sizes: "xs:100vw"
    };
  }

  get computedBackImageRatio() {
    return this.computedImageCta
      ? {
          xs: "full",
          s: "ultrawide",
          m: "wide"
        }
      : {
          xs: "wide",
          m: "wide"
        };
  }

  get computedShowHeaderActions() {
    return !!(this._primaryAction || this.secondaryAction);
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
      "rpl-header--behind-nav": this._behindNav,
      "rpl-header--breadcrumbs": this._breadcrumbs,
      "rpl-header--graphic-top": this.cornerTop,
      "rpl-header--graphic-bottom": this.cornerBottom,
      "rpl-header--background": this.background,
      "rpl-header--image-cta": this.computedImageCta,
      [this.className]: this.className
    });
  }

  get computedTitleClassName() {
    return {
      "rpl-header__title": true,
      "rpl-type-h1": !this.computedHighlight,
      "rpl-type-h1-highlight": this.computedHighlight
    };
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

  get computedHasActions() {
    return !!(this._primaryAction || this._secondaryAction);
  }

  get computedImageCta() {
    return !!(this.background && this.computedHasActions);
  }

  get computedActionsVariant() {
    return this.computedImageCta ? "white" : "filled";
  }

  get computedLogoHasSrc() {
    return this._logo?.src;
  }

  get computedLogo() {
    return {
      ...this._logo,
      className: computeClass({
        "rpl-header__logo": true,
        [this._logo?.className]: this._logo?.className
      })
    };
  }

  /* event management */

  handleItemClick() {
    if (DEBUG) console.debug(CLASS_NAME, "handleItemClick");
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
