/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const HEADINGLEVEL_VALUES = ["h2", "h3", "h4"];
const HEADINGLEVEL_DEFAULT = "h2";
const IMAGESIZE_VALUES = ["large", "small"];
const IMAGESIZE_DEFAULT = "large";
/**
 * Feature Card component for Ontario Design System.
 * Displays a horizontal card with image on left, heading and description on right.
 * Based on official Ontario DS horizontal card component.
 * @see https://designsystem.ontario.ca/components/detail/cards.html
 */
export default class SfGpsDsCaOnFeatureCard extends SfGpsDsLwc {
  static renderMode = "light";
  // @ts-ignore
  @api
  heading;
  // @ts-ignore
  @api
  description;
  // @ts-ignore
  @api
  url;
  // @ts-ignore
  @api
  image;
  // @ts-ignore
  @api
  imageAltText;
  // @ts-ignore
  @api
  headingLevel;
  // @ts-ignore
  @api
  imageSize;
  // @ts-ignore
  @api
  className;
  /* Computed Properties */
  get normalizedImageSize() {
    if (this.imageSize && IMAGESIZE_VALUES.includes(this.imageSize)) {
      return this.imageSize;
    }
    return IMAGESIZE_DEFAULT;
  }
  get computedClassName() {
    const classes = ["sfgpsdscaon-feature-card"];
    // Add small image modifier
    if (this.normalizedImageSize === "small") {
      classes.push("sfgpsdscaon-feature-card--small-image");
    }
    // Add no-description modifier
    if (!this.description) {
      classes.push("sfgpsdscaon-feature-card--no-description");
    }
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }
  get computedTextContainerClass() {
    return "sfgpsdscaon-feature-card__text-container";
  }
  get computedImageAlt() {
    if (this.imageAltText) {
      return this.imageAltText;
    }
    return this.heading ? `${this.heading}` : "";
  }
  get computedAriaLabel() {
    const parts = [this.heading];
    if (this.description) {
      parts.push(this.description);
    }
    return parts.join(". ");
  }
  get normalizedHeadingLevel() {
    if (this.headingLevel && HEADINGLEVEL_VALUES.includes(this.headingLevel)) {
      return this.headingLevel;
    }
    return HEADINGLEVEL_DEFAULT;
  }
  get computedUrl() {
    return this.url || "#";
  }
  get isH2() {
    return this.normalizedHeadingLevel === "h2";
  }
  get isH3() {
    return this.normalizedHeadingLevel === "h3";
  }
  get isH4() {
    return this.normalizedHeadingLevel === "h4";
  }
  /* Lifecycle */
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
