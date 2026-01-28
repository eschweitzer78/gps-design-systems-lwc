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

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnButtonComm";

// NavigationMixin page reference type
interface PageReference {
  type: string;
  attributes?: Record<string, string>;
}

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
  htmlType?: string;

  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  url?: string;

  // @ts-ignore
  @api 
  type?: string;

  // @ts-ignore
  @api 
  className?: string;

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
