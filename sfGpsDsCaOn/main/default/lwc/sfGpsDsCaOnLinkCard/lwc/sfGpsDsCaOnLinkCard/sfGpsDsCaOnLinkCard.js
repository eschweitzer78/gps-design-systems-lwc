/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
const HEADINGLEVEL_VALUES = ["h2", "h3", "h4", "h5", "h6"];
const HEADINGLEVEL_DEFAULT = "h2";
const ISEXTERNAL_DEFAULT = false;
/**
 * Link Card component for Ontario Design System.
 * Based on official Ontario DS Basic Card (accent header / light variant).
 * Displays a card with grey header background, heading, and description.
 * @see https://designsystem.ontario.ca/components/detail/cards.html
 */
export default class SfGpsDsCaOnLinkCard extends SfGpsDsElement {
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
  _isExternal = this.defineBooleanProperty("isExternal", {
    defaultValue: ISEXTERNAL_DEFAULT
  });
  // @ts-ignore
  @api
  headingLevel;
  _headingLevel = this.defineEnumProperty("headingLevel", {
    validValues: HEADINGLEVEL_VALUES,
    defaultValue: HEADINGLEVEL_DEFAULT
  });
  // @ts-ignore
  @api
  className;
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
  get computedClassName() {
    return {
      "sfgpsdscaon-link-card": true,
      [this.className || ""]: !!this.className
    };
  }
  get computedUrl() {
    return this.url || "#";
  }
  get computedLinkTarget() {
    return this._isExternal.value ? "_blank" : "_self";
  }
  get computedLinkRel() {
    return this._isExternal.value ? "noopener noreferrer" : undefined;
  }
  /* Lifecycle */
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
