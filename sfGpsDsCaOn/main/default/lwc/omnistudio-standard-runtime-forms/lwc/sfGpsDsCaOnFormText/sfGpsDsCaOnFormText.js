/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormText from "c/sfGpsDsFormText";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormText.html";

/**
 * @slot Text
 * @description Ontario Design System Text Input component for OmniStudio forms.
 * Renders inline (Shadow DOM) - does not use Light DOM child components.
 *
 * Compliance:
 * - LWR: Compatible (Shadow DOM)
 * - LWS: Compatible
 * - Ontario DS: Uses Ontario form styling
 * - WCAG 2.1 AA / AODA: Focus management, aria attributes
 */
export default class SfGpsDsCaOnFormText extends SfGpsDsFormText {
  _uniqueId = `text-${Math.random().toString(36).substring(2, 11)}`;
  _previousErrorState = null;

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get inputId() {
    return `${this._uniqueId}-input`;
  }

  get hintId() {
    return `${this._uniqueId}-hint`;
  }

  get errorId() {
    return `${this._uniqueId}-error`;
  }

  get showRequiredFlag() {
    return this._propSetMap?.required === true;
  }

  get showOptionalFlag() {
    return this._propSetMap?.optional === true && !this._propSetMap?.required;
  }

  get computedInputClassName() {
    return computeClass({
      "ontario-input": true,
      "ontario-input__error": this.sfGpsDsIsError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      [this.hintId]: this.mergedHelpText,
      [this.errorId]: this.sfGpsDsIsError
    });
  }

  get computedAriaInvalid() {
    return this.sfGpsDsIsError ? "true" : "false";
  }

  get computedAriaRequired() {
    return this._propSetMap?.required ? "true" : "false";
  }

  /* ========================================
   * PUBLIC METHODS - AODA Accessibility
   * ======================================== */

  focusInput() {
    try {
      const input = this.template.querySelector("input");
      if (input) {
        input.focus();
      }
    } catch {
      // Fail silently
    }
  }

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

    const currentErrorState = Boolean(this.sfGpsDsIsError);
    if (currentErrorState !== this._previousErrorState) {
      this._previousErrorState = currentErrorState;
      if (currentErrorState) {
        this.setAttribute("data-has-error", "true");
      } else {
        this.removeAttribute("data-has-error");
      }
    }
  }
}
