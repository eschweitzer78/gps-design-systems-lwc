/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswHeroBanner extends LightningElement {
  static renderMode = "light";

  @api title;
  @api subtitle;
  //@api intro; // replaced by default slot
  @api cta;
  @api ctaPreventDefault = false;
  @api cstyle = "dark";
  @api bstyle = "default";
  @api wide;
  @api featured;
  @api lines;
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
      "nsw-hero-banner--dark": this.cstyle === "dark",
      "nsw-hero-banner--light": this.cstyle === "light",
      "nsw-hero-banner--white": this.cstyle === "white",
      "nsw-hero-banner--off-white": this.cstyle === "off-white",
      "nsw-hero-banner--lines": this.lines,
      [this.className]: this.className
    });
  }

  get computedButtonClassName() {
    return computeClass({
      "nsw-button": true,
      "nsw-button--white": this.cstyle === "dark",
      "nsw-button--dark": ["light", "white", "off-white"].includes(this.cstyle)
    });
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
