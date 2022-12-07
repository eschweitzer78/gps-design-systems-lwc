/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const options = {
  default: "",
  dark: "nsw-hero-banner--dark",
  light: "nsw-hero-banner--light",
  white: "nsw-hero-banner--white"
};

const buttonStyles = {
  default: "",
  dark: "nsw-button nsw-button--white",
  light: "nsw-button nsw-button--dark",
  white: "nsw-button nsw-button--dark"
};

export default class SfGpsDsAuNswHeroBanner extends LightningElement {
  @api title;
  @api subtitle;
  //@api intro; // replaced by default slot
  @api cta;
  @api ctaPreventDefault = false;
  @api cstyle = "dark";
  @api wide;
  @api featured;
  @api image;
  @api links;
  @api linksPreventDefault = false;
  @api className;

  get _links() {
    return this.links
      ? this.links.map((link, index) => ({
          ...link,
          index: link.index ? link.index : `link-${index + 1}`
        }))
      : null;
  }

  get computedClassName() {
    return computeClass({
      "nsw-hero-banner": true,
      "nsw-hero-banner--wide": this.wide,
      "nsw-hero-banner--featured": this.featured,
      [options[this.cstyle] || options.default]: true,
      [this.className]: this.className
    });
  }

  get computedButtonClassName() {
    return buttonStyles[this.cstyle] || buttonStyles.default;
  }

  handleCtaClick(event) {
    if (this.ctaPreventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("click", { detail: event.target.href }));
  }

  handleLinksClick(event) {
    if (this.linksPreventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("click", { detail: event.target.href }));
  }
}
