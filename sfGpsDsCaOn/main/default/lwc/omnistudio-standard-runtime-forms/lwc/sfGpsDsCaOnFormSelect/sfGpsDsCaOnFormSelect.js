/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormSelect from "c/sfGpsDsFormSelect";
import tmpl from "./sfGpsDsCaOnFormSelect.html";

/**
 * @slot Select
 * @description Ontario Design System Select/Dropdown component for OmniStudio forms.
 *
 * Compliance:
 * - WCAG 2.1 AA / AODA: Focus management for validation errors
 */
export default class SfGpsDsCaOnFormSelect extends SfGpsDsFormSelect {
  /* ========================================
   * PRIVATE STATE - Re-render optimization
   * ======================================== */

  _previousErrorState = null;

  /* ========================================
   * PUBLIC METHODS - AODA Accessibility
   * ======================================== */

  /**
   * Moves focus to this select field.
   * AODA: Focus should move to first error field on validation failure.
   * @public
   */
  focusInput() {
    try {
      const select = this.template.querySelector("select");
      if (select) {
        select.focus();
      }
    } catch {
      // Fail silently
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
   * Optimized: Only updates DOM when error state changes.
   */
  renderedCallback() {
    if (super.renderedCallback) {
      super.renderedCallback();
    }

    // Optimization: Only update DOM when error state changes
    const currentErrorState = Boolean(this.sfGpsDsIsError);
    if (currentErrorState !== this._previousErrorState) {
      this._previousErrorState = currentErrorState;

      // Set data attribute for error state
      if (currentErrorState) {
        this.setAttribute("data-has-error", "true");
      } else {
        this.removeAttribute("data-has-error");
      }
    }
  }
}
