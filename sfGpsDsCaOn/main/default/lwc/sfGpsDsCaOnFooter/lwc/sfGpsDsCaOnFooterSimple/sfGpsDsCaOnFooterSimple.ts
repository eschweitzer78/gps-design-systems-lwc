/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnFooterSimple";

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterLinks {
  accessibilityLink?: FooterLink;
  privacyLink?: FooterLink;
  contactLink?: FooterLink;
  printerLink?: FooterLink;
}

export default class SfGpsDsCaOnFooterSimple extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api
  footerLinks?: FooterLinks | string;

  // @ts-ignore
  @api
  topMargin?: boolean;
  _topMargin = this.defineBooleanProperty("topMargin", {
    defaultValue: true
  });

  // @ts-ignore
  @api
  language?: string;

  // @ts-ignore
  @api
  assetBasePath?: string;

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get footerLinksJson(): string | undefined {
    if (!this.footerLinks) return undefined;
    if (typeof this.footerLinks === "string") {
      return this.footerLinks;
    }
    return JSON.stringify(this.footerLinks);
  }

  get computedTopMargin(): boolean {
    return this._topMargin.value;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
