import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";
import SfGpsDsAuVicBreakpointMixin from "c/sfGpsDsAuVicBreakpointMixin";

const SHOWLINKS_DEFAULT = true;

export default class extends SfGpsDsAuVicBreakpointMixin(LightningElement) {
  static renderMode = "light";

  @api title;
  @api introText;
  @api linkHeading;
  @api links;
  @api moreLink;
  @api theme = "light";
  @api logo;
  @api backgroundGraphic;
  @api className;

  /* api: showLinks bool */

  _showLinks = SHOWLINKS_DEFAULT;
  _showLinksOriginal = SHOWLINKS_DEFAULT;

  @api
  get showLinks() {
    return this._showLinksOriginal;
  }

  set showLinks(value) {
    this._showLinksOriginal = value;
    this._showLinks = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWLINKS_DEFAULT
    });
  }

  /* computed */

  get computedShowLinkList() {
    return this.links || this.moreLink;
  }

  get computedClassName() {
    return {
      "rpl-hero-banner": true,
      "rpl-hero-banner--no-links": !this._showLinks,
      "rpl-hero-banner--has-logo": this.logo,
      [this.className]: this.className
    };
  }

  get computedTitleClassName() {
    return {
      "rpl-hero-banner__title": true,
      "rpl-hero-banner__title--dark": this.theme === "dark"
    };
  }

  get computedDescriptionClassName() {
    return {
      "rpl-hero-banner__description": true,
      "rpl-hero-banner__description--dark": this.theme === "dark"
    };
  }

  get computedLinkHeadingClassName() {
    return {
      "rpl-hero-banner__link-heading": true,
      "rpl-hero-banner__link-heading--dark": this.theme === "dark"
    };
  }

  get computedHeroBannerStyles() {
    return this.backgroundGraphic
      ? `background-image: url(${this.backgroundGraphic})`
      : null;
  }

  get computedTextLinkSize() {
    return this.$breakpoint.m ? "large" : "small";
  }

  /* lifecycle */

  connectedCallback() {
    this.breakpointConnectedCallback();
  }

  disconnectedCallback() {
    this.breakpointDisconnectedCallback();
  }
}
