/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormText from "c/sfGpsDsFormText";
import tmpl from "./sfGpsDsCaOnFormText.html";

/**
 * @slot Text
 * @description Ontario Design System Text Input component for OmniStudio forms.
 *
 * Compliance:
 * - LWR: Uses Ontario DS styling
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses Ontario form styling
 * - WCAG 2.1 AA / AODA:
 *   - Focus management for validation errors
 *   - Error messages not reliant on color alone (includes icon)
 *   - aria-invalid and aria-describedby for error association
 */
export default class SfGpsDsCaOnFormText extends SfGpsDsFormText {
  /* ========================================
   * PRIVATE STATE - Re-render optimization
   * ======================================== */

  _previousErrorState = null;

  /* ========================================
   * PUBLIC METHODS - AODA Accessibility
   * ======================================== */

  /**
   * Moves focus to this input field.
   * Called programmatically when validation fails.
   * AODA: Focus should move to first error field on validation failure.
   * @public
   */
  focusInput() {
    try {
      const input = this.template.querySelector("input, textarea");
      if (input) {
        input.focus();
      }
    } catch {
      // Fail silently - focus management is progressive enhancement
    }
  }

  /**
   * Checks if this field has a validation error.
   * @returns {boolean} True if field has error
   * @public
   */
  hasValidationError() {
    return this.sfGpsDsIsError || false;
  }

  /* ========================================
   * LIFECYCLE HOOKS
   * ======================================== */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdscaon-read-only";
    this.classList.add("caon-scope");
  }

  /**
   * Announce error to screen readers when validation state changes.
   * AODA: Error messages should be announced immediately.
   * Optimized: Only updates DOM when error state actually changes.
   */
  renderedCallback() {
    if (super.renderedCallback) {
      super.renderedCallback();
    }

    // Optimization: Only update DOM when error state changes
    const currentErrorState = Boolean(this.sfGpsDsIsError);
    if (currentErrorState !== this._previousErrorState) {
      this._previousErrorState = currentErrorState;

      // Set data attribute for error state (used by Step component)
      if (currentErrorState) {
        this.setAttribute("data-has-error", "true");
      } else {
        this.removeAttribute("data-has-error");
      }
    }
  }
}
