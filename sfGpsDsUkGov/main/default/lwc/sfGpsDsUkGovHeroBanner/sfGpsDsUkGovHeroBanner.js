/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui @ Salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsUkGovHeroBanner extends LightningElement {
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
      "app-masthead": true,
      "app-masthead--no-links": !this.showLinks,
      "app-masthead--has-logo": this.logo,
      [this.className]: this.className
    });
  }

  get computedTitleClassName() {
    return computeClass({
      "app-masthead__title": true,
      "govuk-heading-xl": true,
      "app-masthead__title--dark": this.theme === "dark"
    });
  }

  get computedDescriptionClassName() {
    return computeClass({
      "app-masthead__description": true,
      "app-masthead__description--dark": this.theme === "dark"
    });
  }

  get computedLinkHeadingClassName() {
    return computeClass({
      "rpl-hero-banner__link-heading": true,
      "rpl-hero-banner__link-heading--dark": this.theme === "dark"
    });
  }

  // @TODO: Use if required later
  // get heroBannerStyles() {
  //   return this.backgroundGraphic
  //     ? `background-image: url(${this.backgroundGraphic})`
  //     : null;
  // }

  // get textLinkSize() {
  //   return this.$breakpoint.m ? "large" : "small";
  // }
}
