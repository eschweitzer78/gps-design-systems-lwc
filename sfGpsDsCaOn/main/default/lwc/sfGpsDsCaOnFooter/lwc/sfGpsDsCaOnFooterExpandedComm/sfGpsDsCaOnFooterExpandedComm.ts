/*
 * Copyright (c) 2025, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnFooterExpandedComm";

export default class SfGpsDsCaOnFooterExpandedComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  footerLinksJson?: string;

  get parsedFooterLinks(): Record<string, unknown> | undefined {
    if (!this.footerLinksJson) return undefined;
    
    try {
      return JSON.parse(this.footerLinksJson);
    } catch (e) {
      this.addError("FL-JP", "Footer links JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  socialLinksJson?: string;

  get parsedSocialLinks(): Record<string, unknown> | undefined {
    if (!this.socialLinksJson) return undefined;
    
    try {
      return JSON.parse(this.socialLinksJson);
    } catch (e) {
      this.addError("SL-JP", "Social links JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  twoColumnOptionsJson?: string;

  get parsedTwoColumnOptions(): Record<string, unknown> | undefined {
    if (!this.twoColumnOptionsJson) return undefined;
    
    try {
      return JSON.parse(this.twoColumnOptionsJson);
    } catch (e) {
      this.addError("2CO-JP", "Two column options JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  threeColumnOptionsJson?: string;

  get parsedThreeColumnOptions(): Record<string, unknown> | undefined {
    if (!this.threeColumnOptionsJson) return undefined;
    
    try {
      return JSON.parse(this.threeColumnOptionsJson);
    } catch (e) {
      this.addError("3CO-JP", "Three column options JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  topMargin?: boolean;

  // @ts-ignore
  @api
  language?: string;

  // @ts-ignore
  @api
  assetBasePath?: string;

  // @ts-ignore
  @api
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
