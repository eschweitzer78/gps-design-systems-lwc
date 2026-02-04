/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

type HeadingLevel = "h2" | "h3" | "h4";
type ImageSize = "large" | "small";

const HEADINGLEVEL_VALUES: HeadingLevel[] = ["h2", "h3", "h4"];
const HEADINGLEVEL_DEFAULT: HeadingLevel = "h2";

const IMAGESIZE_VALUES: ImageSize[] = ["large", "small"];
const IMAGESIZE_DEFAULT: ImageSize = "large";

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
  heading?: string;

  // @ts-ignore
  @api
  description?: string;

  // @ts-ignore
  @api
  url?: string;

  // @ts-ignore
  @api
  image?: string;

  // @ts-ignore
  @api
  imageAltText?: string;

  // @ts-ignore
  @api
  headingLevel?: string;

  // @ts-ignore
  @api
  imageSize?: string;

  // @ts-ignore
  @api
  className?: string;

  /* Computed Properties */

  get normalizedImageSize(): ImageSize {
    if (this.imageSize && IMAGESIZE_VALUES.includes(this.imageSize as ImageSize)) {
      return this.imageSize as ImageSize;
    }
    return IMAGESIZE_DEFAULT;
  }

  get computedClassName(): string {
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

  get computedTextContainerClass(): string {
    return "sfgpsdscaon-feature-card__text-container";
  }

  get computedImageAlt(): string {
    if (this.imageAltText) {
      return this.imageAltText;
    }
    return this.heading ? `${this.heading}` : "";
  }

  get computedAriaLabel(): string {
    const parts = [this.heading];
    if (this.description) {
      parts.push(this.description);
    }
    return parts.join(". ");
  }

  get normalizedHeadingLevel(): HeadingLevel {
    if (this.headingLevel && HEADINGLEVEL_VALUES.includes(this.headingLevel as HeadingLevel)) {
      return this.headingLevel as HeadingLevel;
    }
    return HEADINGLEVEL_DEFAULT;
  }

  get computedUrl(): string {
    return this.url || "#";
  }

  get isH2(): boolean {
    return this.normalizedHeadingLevel === "h2";
  }

  get isH3(): boolean {
    return this.normalizedHeadingLevel === "h3";
  }

  get isH4(): boolean {
    return this.normalizedHeadingLevel === "h4";
  }

  /* Lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
