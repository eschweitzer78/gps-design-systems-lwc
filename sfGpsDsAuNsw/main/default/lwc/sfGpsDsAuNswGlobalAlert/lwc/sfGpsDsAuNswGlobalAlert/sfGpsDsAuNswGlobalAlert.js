/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswGlobalAlert extends LightningElement {
  static renderMode = "light";

  @api title;
  @api copy;
  @api ctaText;
  @api ctaHref;
  @api ctaStyle = "link"; // link or button
  @api ctaPreventDefault = false;
  @api as = "default";
  @api className;
  @track _isClosed;

  get space() {
    return " ";
  }

  get computedClassName() {
    return computeClass({
      "nsw-global-alert": true,
      "nsw-global-alert--light": this.as === "light",
      "nsw-global-alert--critical": this.as === "critical",
      [this.className]: this.className
    });
  }

  get computedButtonClassName() {
    return computeClass({
      "nsw-button": true,
      "nsw-button--dark": this.as === "light",
      "nsw-button--white": this.as === "default" || this.as === "critical"
    });
  }

  get hasCta() {
    return this.ctaText && this.ctaHref;
  }

  get isCtaLinkStyle() {
    return this.ctaStyle === "link";
  }

  get isCtaButtonStyle() {
    return this.ctaStyle === "button";
  }

  handleCtaClick(event) {
    if (this.ctaPreventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.dispatchEvent(new CustomEvent("ctaclick"));
  }

  handleCloseClick(event) {
    event.preventDefault();
    this._isClosed = true;
    this.dispatchEvent(new CustomEvent("close"));
  }
}
