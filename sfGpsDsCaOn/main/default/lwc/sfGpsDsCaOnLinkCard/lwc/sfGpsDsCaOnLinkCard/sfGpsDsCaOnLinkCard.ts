/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import type { HeadingLevel } from "c/sfGpsDsCaOnLinkCard";

const HEADINGLEVEL_VALUES: HeadingLevel[] = [
  "h2", "h3", "h4", "h5", "h6"
];
const HEADINGLEVEL_DEFAULT: HeadingLevel = "h2";

const ISEXTERNAL_DEFAULT = false;

/**
 * Link Card component for Ontario Design System.
 * Based on official Ontario DS Basic Card (accent header / light variant).
 * Displays a card with grey header background, heading, and description.
 * @see https://designsystem.ontario.ca/components/detail/cards.html
 */
export default 
class SfGpsDsCaOnLinkCard 
extends SfGpsDsElement {
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
  _isExternal = this.defineBooleanProperty("isExternal", {
    defaultValue: ISEXTERNAL_DEFAULT
  })

  // @ts-ignore
  @api
  headingLevel?: string;
  _headingLevel = this.defineEnumProperty<HeadingLevel>("headingLevel", {
    validValues: HEADINGLEVEL_VALUES,
    defaultValue: HEADINGLEVEL_DEFAULT
  });

  // @ts-ignore
  @api
  className?: string;

  /* Computed Properties */

  get isH2() {
    return this._headingLevel.value === "h2";
  }

  get isH3() {
    return this._headingLevel.value === "h3";
  }

  get isH4() {
    return this._headingLevel.value === "h4";
  }

  get isH5() {
    return this._headingLevel.value === "h5";
  }

  get isH6() {
    return this._headingLevel.value === "h6";
  }

  get computedClassName(): any {
    return {
      "sfgpsdscaon-link-card": true,
      [this.className || ""]: !!this.className
    }
  }

  get computedUrl(): string {
    return this.url || "#";
  }

  get computedLinkTarget(): string {
    return this._isExternal.value ? "_blank" : "_self";
  }

  get computedLinkRel(): string | undefined {
    return this._isExternal.value ? "noopener noreferrer" : undefined;
  }

  /* Lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
