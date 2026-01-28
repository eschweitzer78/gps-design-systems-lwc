/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnBackToTop";

export default class SfGpsDsCaOnBackToTop extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  scrollThreshold?: number;
  _scrollThreshold = this.defineIntegerProperty("scrollThreshold", {
    defaultValue: 300
  });

  // @ts-ignore
  @api
  className?: string;

  _isVisible = false;

  private _scrollHandler?: () => void;

  /* getters */

  get computedLabel(): string {
    return this.label || "Top";
  }

  get computedClassName(): string {
    const classes = ["ontario-back-to-top--default"];
    if (this._isVisible) {
      classes.push("active");
    }
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  /* handlers */

  /**
   * Scrolls the page to the top and moves focus for accessibility.
   * Uses try/catch for LWS compatibility where window APIs may be restricted.
   * AODA/WCAG 2.4.3: Focus management after programmatic scrolling.
   */
  handleClick(): void {
    try {
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        
        // AODA: Move focus to top of page after scroll
        // Try common skip link targets, then main content
        this.moveFocusToTop();
      }
    } catch (e) {
      // LWS may restrict window.scrollTo - fail silently
      console.warn("BackToTop: Unable to scroll - window.scrollTo may be restricted");
    }
  }

  /**
   * Moves focus to the top of the page after scrolling.
   * Tries skip link targets first, then main content areas.
   * AODA/WCAG 2.4.3 compliance for focus order.
   */
  private moveFocusToTop(): void {
    try {
      // Common selectors for skip link targets and main content
      const focusTargets = [
        "#skip-to-content",
        "#main-content", 
        "#main",
        "[role='main']",
        "main",
        "h1"
      ];
      
      for (const selector of focusTargets) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          // Make element focusable if not already
          if (!element.hasAttribute("tabindex")) {
            element.setAttribute("tabindex", "-1");
          }
          // Use setTimeout to allow smooth scroll to complete
          setTimeout(() => element.focus(), 500);
          return;
        }
      }
    } catch (e) {
      // LWS may restrict document.querySelector - fail silently
    }
  }

  /**
   * Handles scroll events to show/hide the back-to-top button.
   * Uses try/catch for LWS compatibility where window.scrollY may be restricted.
   */
  private handleScroll = (): void => {
    try {
      if (typeof window !== "undefined") {
        const threshold = this._scrollThreshold.value || 300;
        this._isVisible = (window.scrollY || window.pageYOffset || 0) > threshold;
      }
    } catch (e) {
      // LWS may restrict window.scrollY - keep button hidden
      this._isVisible = false;
    }
  };

  /* lifecycle */

  /**
   * Initializes the component and attaches scroll listener.
   * Uses try/catch for LWS compatibility.
   */
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
    
    try {
      if (typeof window !== "undefined" && window.addEventListener) {
        this._scrollHandler = this.handleScroll.bind(this);
        window.addEventListener("scroll", this._scrollHandler, { passive: true });
        
        // Check initial scroll position
        this.handleScroll();
      }
    } catch (e) {
      // LWS may restrict window.addEventListener - component will remain hidden
      console.warn("BackToTop: Unable to attach scroll listener - may be restricted in LWS");
    }
  }

  /**
   * Cleans up scroll listener on disconnect.
   */
  disconnectedCallback() {
    try {
      if (this._scrollHandler && typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener("scroll", this._scrollHandler);
      }
    } catch (e) {
      // Cleanup may fail in LWS - fail silently
    }
  }
}
