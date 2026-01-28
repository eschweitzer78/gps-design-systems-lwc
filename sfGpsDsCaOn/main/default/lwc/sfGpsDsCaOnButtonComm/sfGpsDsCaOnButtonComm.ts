/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  NavigationMixin 
} from "lightning/navigation";
import {
  computeClass
} from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnButtonComm";

// NavigationMixin page reference type
interface PageReference {
  type: string;
  attributes?: Record<string, string>;
}

/**
 * Icon SVG paths for common button icons.
 * These are Material Design icons used in the Ontario Design System.
 */
const ICON_PATHS: Record<string, string> = {
  add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  remove: "M19 13H5v-2h14v2z",
  edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  delete: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  chevronLeft: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  chevronRight: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  arrowForward: "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z",
  arrowBack: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
  upload: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z",
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  error: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  refresh: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  print: "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z",
  save: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
};

export default 
class SfGpsDsCaOnButtonComm 
extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
  /**
   * Enable Light DOM for LWR compatibility.
   * Required for proper CSS styling in Experience Cloud LWR sites.
   */
  static renderMode = "light";

  // @ts-ignore
  @api 
  ariaLabelText?: string;

  // @ts-ignore
  @api 
  elementId?: string;

  // @ts-ignore
  @api 
  htmlType?: string = "button";

  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  url?: string;

  // @ts-ignore
  @api 
  type?: string = "primary";

  // @ts-ignore
  @api 
  icon?: string;

  // @ts-ignore
  @api 
  iconPosition?: string = "left";

  // @ts-ignore
  @api 
  className?: string;

  /* computed properties */

  get hasIcon(): boolean {
    return Boolean(this.icon);
  }

  get isIconLeft(): boolean {
    return this.iconPosition !== "right";
  }

  get isIconRight(): boolean {
    return this.iconPosition === "right";
  }

  get iconPath(): string | null {
    return this.icon ? (ICON_PATHS[this.icon] || null) : null;
  }

  get useNativeButton(): boolean {
    return Boolean(this.icon);
  }

  get computedButtonClassName(): string {
    return computeClass({
      "ontario-button": true,
      [`ontario-button--${this.type}`]: Boolean(this.type),
      [this.className || ""]: Boolean(this.className)
    });
  }

  /* LWS-safe navigation helper */

  /**
   * Navigate to a URL using NavigationMixin (LWS-safe)
   */
  navigateToUrl(url: string): void {
    const pageRef: PageReference = {
      type: "standard__webPage",
      attributes: {
        url: url
      }
    };

    // @ts-ignore - NavigationMixin method
    this[NavigationMixin.Navigate](pageRef);
  }

  /**
   * Handle hash-based navigation (in-page anchor)
   * LWS-safe: dispatches an event that parent components can handle
   * Also attempts to scroll to the target if it's an anchor link
   */
  handleHashNavigation(hash: string): void {
    const elementId = hash.substring(1); // Remove the # prefix

    // Dispatch event for parent handling - this is the primary mechanism
    // Parent components or the page can listen for this and scroll accordingly
    this.dispatchEvent(new CustomEvent("hashnavigate", {
      detail: { 
        hash: hash, 
        elementId: elementId,
        // Provide a callback for parent to confirm navigation was handled
        handled: false
      },
      bubbles: true,
      composed: true
    }));

    // For in-page anchor links, use NavigationMixin with the hash URL
    // This will update the URL and the browser will handle scrolling
    // to the anchor if it exists on the page
    this.navigateToUrl(hash);
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleClick(_event: MouseEvent): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleClick");

    if (this.url) {
      if (this.url.startsWith("#")) {
        // Hash-based navigation (in-page anchor)
        this.handleHashNavigation(this.url);
      } else {
        // Standard URL navigation using NavigationMixin
        this.navigateToUrl(this.url);
      }
      
      if (DEBUG) console.debug(CLASS_NAME, "< handleClick", this.url);
    } else if (DEBUG) console.debug(CLASS_NAME, "< handleClick");

  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
