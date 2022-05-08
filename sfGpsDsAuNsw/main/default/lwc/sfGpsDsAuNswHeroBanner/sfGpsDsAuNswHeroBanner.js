/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

const options = {
  dark: "nsw-hero-banner--dark",
  light: "nsw-hero-banner--light",
  white: "nsw-hero-banner--white"
};

const buttonStyles = {
  dark: "nsw-button nsw-button--white",
  light: "nsw-button nsw-button--dark",
  white: "nsw-button nsw-button--dark"
};

export default class SfGpsDsAuNswHeroBanner extends LightningElement {
  @api title;
  //@api intro; // replaced by default slot
  @api cta;
  @api cstyle;
  @api wide;
  @api featured;
  @api image;
  @api links;
  @api className;

  get computedClassName() {
    return `nsw-hero-banner ${this.cstyle ? options[this.cstyle] : ""} ${
      this.wide ? "nsw-hero-banner--wide" : ""
    } ${this.featured ? " nsw-hero-banner--featured" : ""}  ${
      this.className ? this.className : ""
    }`;
  }

  get computedButtonClassName() {
    return `${buttonStyles[this.cstyle]}`;
  }
}
