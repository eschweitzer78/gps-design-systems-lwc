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
/**
 * Link Card component for Ontario Design System.
 * Based on official Ontario DS Basic Card (accent header / light variant).
 * Displays a card with grey header background, heading, and description.
 * @see https://designsystem.ontario.ca/components/detail/cards.html
 */
export default class SfGpsDsCaOnLinkCard extends SfGpsDsLwc {
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
  isExternal;
  // @ts-ignore
  @api
  headingLevel;
  // @ts-ignore
  @api
  className;
  /* Computed Properties */
  get normalizedHeadingLevel() {
    if (this.headingLevel && HEADINGLEVEL_VALUES.includes(this.headingLevel)) {
      return this.headingLevel;
    }
    return HEADINGLEVEL_DEFAULT;
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
  get computedClassName() {
    const classes = ["sfgpsdscaon-link-card"];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }
  get computedUrl() {
    return this.url || "#";
  }
  get computedIsExternal() {
    return this.isExternal === true;
  }
  get linkTarget() {
    return this.computedIsExternal ? "_blank" : "_self";
  }
  get linkRel() {
    return this.computedIsExternal ? "noopener noreferrer" : undefined;
  }
  /* Lifecycle */
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
