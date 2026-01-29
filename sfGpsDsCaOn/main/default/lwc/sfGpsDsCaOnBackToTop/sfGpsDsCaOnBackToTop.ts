/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @description Ontario Design System Back to Top button component.
 * Provides a floating button that appears after scrolling and allows users
 * to quickly return to the top of the page.
 *
 * ## LWS Compatibility
 * - Uses window.scrollTo with try/catch (allowed in LWS with restrictions)
 * - Dispatches 'backtotop' event for parent-managed focus (instead of document.querySelector)
 * - All window APIs are wrapped in try/catch for graceful degradation
 *
 * ## Focus Management
 * This component dispatches a 'backtotop' event after scrolling. Parent components
 * should listen for this event and manage focus appropriately:
 *
 * ```javascript
 * handleBackToTop(event) {
 *   const skipLink = this.template.querySelector('#skip-to-content');
 *   if (skipLink) skipLink.focus();
 * }
 * ```
 *
 * ## Compliance
 * - **LWR**: Uses Light DOM for Experience Cloud compatibility
 * - **LWS**: No document.querySelector, window APIs wrapped in try/catch
 * - **Ontario DS**: Follows Ontario Design System back-to-top pattern
 * - **WCAG 2.1 AA**: Dispatches event for focus management (WCAG 2.4.3)
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
   * Scrolls the page to the top and dispatches event for focus management.
   * Uses try/catch for LWS compatibility where window APIs may be restricted.
   *
   * LWS Note: Cannot use document.querySelector to find focus targets.
   * Instead, dispatches 'backtotop' event for parent-managed focus.
   *
   * AODA/WCAG 2.4.3: Focus management after programmatic scrolling.
   */
  handleClick(): void {
    try {
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        // LWS: Dispatch event for parent to manage focus
        // Parent components should listen and focus appropriate element
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.dispatchBackToTopEvent();
        }, 500);
      }
    } catch (e) {
      // LWS may restrict window.scrollTo - fail silently
      console.warn("BackToTop: Unable to scroll - window.scrollTo may be restricted");
    }
  }

  /**
   * Dispatches the backtotop event for parent focus management.
   * LWS-compatible: Uses bubbling event instead of document.querySelector.
   *
   * Parent components should listen for this event and manage focus:
   * ```javascript
   * handleBackToTop(event) {
   *   const skipLink = this.template.querySelector('#skip-to-content');
   *   if (skipLink) skipLink.focus();
   * }
   * ```
   * @private
   */
  private dispatchBackToTopEvent(): void {
    this.dispatchEvent(
      new CustomEvent("backtotop", {
        bubbles: true,
        composed: true,
        detail: {
          // Suggested focus targets for parent reference
          suggestedTargets: [
            "#skip-to-content",
            "#main-content",
            "#main",
            "[role='main']",
            "main",
            "h1"
          ]
        }
      })
    );
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
