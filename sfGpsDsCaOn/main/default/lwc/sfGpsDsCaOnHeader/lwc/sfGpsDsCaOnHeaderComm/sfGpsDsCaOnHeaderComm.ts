/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnHeaderComm";

export default class SfGpsDsCaOnHeaderComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  type?: string;

  // @ts-ignore
  @api
  applicationHeaderInfoJson?: string;

  get parsedApplicationHeaderInfo(): Record<string, unknown> | undefined {
    if (!this.applicationHeaderInfoJson) return undefined;
    
    try {
      return JSON.parse(this.applicationHeaderInfoJson);
    } catch (e) {
      this.addError("AHI-JP", "Application header info JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  menuItemsJson?: string;

  get parsedMenuItems(): unknown[] | undefined {
    if (!this.menuItemsJson) return undefined;
    
    try {
      const parsed = JSON.parse(this.menuItemsJson);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (e) {
      this.addError("MI-JP", "Menu items JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  languageToggleOptionsJson?: string;

  get parsedLanguageToggleOptions(): Record<string, unknown> | undefined {
    if (!this.languageToggleOptionsJson) return undefined;
    
    try {
      return JSON.parse(this.languageToggleOptionsJson);
    } catch (e) {
      this.addError("LTO-JP", "Language toggle options JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  disableDynamicMenu?: boolean;

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
