/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnBackButton";

export default class SfGpsDsCaOnBackButton extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  url?: string;

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedLabel(): string {
    return this.label || "Back";
  }

  get computedClassName(): string {
    const classes = ["ontario-button", "ontario-button--tertiary", "ontario-back-button"];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  get hasUrl(): boolean {
    return Boolean(this.url);
  }

  /* handlers */

  /**
   * Handles click on back button.
   * If no URL is provided, uses browser history navigation.
   * Uses try/catch for LWS compatibility where window.history may be restricted.
   * @param {Event} event - Click event
   */
  handleClick(event: Event): void {
    if (!this.url) {
      event.preventDefault();
      try {
        // Use history.back() for browser back navigation
        if (typeof window !== "undefined" && window.history && window.history.back) {
          window.history.back();
        }
      } catch (e) {
        // LWS may restrict window.history.back() - fail silently
        console.warn("BackButton: Unable to navigate back - window.history may be restricted");
      }
    }
    // If url is provided, the anchor tag handles navigation
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
