import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsAuVicBreakpointMixin from "c/sfGpsDsAuVicBreakpointMixin";

export default class SfGpsDsAuVicHeroBanner extends SfGpsDsAuVicBreakpointMixin(
  LightningElement
) {
  static renderMode = "light";

  @api title;
  @api introText;
  @api linkHeading;
  @api links;
  @api moreLink;
  @api theme = "light";

  /* api showLinks bool */
  _showLinks = true;

  @api get showLinks() {
    return this._showLinks;
  }

  set showLinks(value) {
    this._showLinks = value;
  }

  @api logo;
  @api backgroundGraphic;
  @api className;

  get showLinkList() {
    return this.links || this.moreLink;
  }

  get computedClassName() {
    return computeClass({
      "rpl-hero-banner": true,
      "rpl-hero-banner--no-links": !this.showLinks,
      "rpl-hero-banner--has-logo": this.logo,
      [this.className]: this.className
    });
  }

  get computedTitleClassName() {
    return computeClass({
      "rpl-hero-banner__title": true,
      "rpl-hero-banner__title--dark": this.theme === "dark"
    });
  }

  get computedDescriptionClassName() {
    return computeClass({
      "rpl-hero-banner__description": true,
      "rpl-hero-banner__description--dark": this.theme === "dark"
    });
  }

  get computedLinkHeadingClassName() {
    return computeClass({
      "rpl-hero-banner__link-heading": true,
      "rpl-hero-banner__link-heading--dark": this.theme === "dark"
    });
  }

  get heroBannerStyles() {
    return this.backgroundGraphic
      ? `background-image: url(${this.backgroundGraphic})`
      : null;
  }

  get textLinkSize() {
    return this.$breakpoint.m ? "large" : "small";
  }

  connectedCallback() {
    this.breakpointConnectedCallback();
  }

  disconnectedCallback() {
    this.breakpointDisconnectedCallback();
  }
}
