/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const options = {
  default: "",
  critical: "nsw-global-alert--critical",
  light: "nsw-global-alert--light"
};

const buttonStyles = {
  default: "nsw-button nsw-button--white",
  critical: "nsw-button nsw-button--white",
  light: "nsw-button nsw-button--dark"
};

export default class SfGpsDsAuNswGlobalAlert extends LightningElement {
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
      [options[this.as] || options.default]: true,
      [this.className]: this.className
    });
  }

  get computedButtonClassName() {
    return buttonStyles[this.as] || buttonStyles.default;
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
    }

    this.dispatchEvent(new CustomEvent("click"));
  }
  handleCloseClick(event) {
    event.preventDefault();
    this._isClosed = true;
    this.dispatchEvent(new CustomEvent("close"));
  }
}
