/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormTextarea from "c/sfGpsDsFormTextarea";
import tmpl from "./sfGpsDsCaOnFormTextarea.html";

/**
 * @slot Textarea
 * @description Ontario Design System Textarea component for OmniStudio forms.
 * 
 * Compliance:
 * - WCAG 2.1 AA / AODA: Focus management for validation errors
 */
export default class SfGpsDsCaOnFormTextarea extends SfGpsDsFormTextarea {
  /* ========================================
   * PUBLIC METHODS - AODA Accessibility
   * ======================================== */

  /**
   * Moves focus to this textarea field.
   * AODA: Focus should move to first error field on validation failure.
   * @public
   */
  focusInput() {
    try {
      const textarea = this.template.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    } catch (e) {
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

  renderedCallback() {
    if (super.renderedCallback) {
      super.renderedCallback();
    }

    // Set data attribute for error state
    if (this.sfGpsDsIsError) {
      this.setAttribute("data-has-error", "true");
    } else {
      this.removeAttribute("data-has-error");
    }
  }
}
