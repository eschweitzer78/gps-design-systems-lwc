/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

type HeadingLevel = "h2" | "h3" | "h4";

const HEADINGLEVEL_VALUES: HeadingLevel[] = ["h2", "h3", "h4"];
const HEADINGLEVEL_DEFAULT: HeadingLevel = "h2";

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
  heading?: string;

  // @ts-ignore
  @api
  description?: string;

  // @ts-ignore
  @api
  url?: string;

  // @ts-ignore
  @api
  isExternal?: boolean;

  // @ts-ignore
  @api
  headingLevel?: string;

  // @ts-ignore
  @api
  className?: string;

  /* Computed Properties */

  get normalizedHeadingLevel(): HeadingLevel {
    if (
      this.headingLevel &&
      HEADINGLEVEL_VALUES.includes(this.headingLevel as HeadingLevel)
    ) {
      return this.headingLevel as HeadingLevel;
    }
    return HEADINGLEVEL_DEFAULT;
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

  get computedClassName(): string {
    const classes = ["sfgpsdscaon-link-card"];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  get computedUrl(): string {
    return this.url || "#";
  }

  get computedIsExternal(): boolean {
    return this.isExternal === true;
  }

  get linkTarget(): string {
    return this.computedIsExternal ? "_blank" : "_self";
  }

  get linkRel(): string | undefined {
    return this.computedIsExternal ? "noopener noreferrer" : undefined;
  }

  /* Lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
