/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormCurrency from "c/sfGpsDsFormCurrency";
import tmpl from "./sfGpsDsCaOnFormCurrency.html";

/**
 * @slot Currency
 * @description Ontario Design System Currency input for OmniStudio forms.
 * Uses number input with CAD currency formatting.
 *
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-input styling with currency prefix
 * - WCAG 2.1 AA: Proper labeling, error messaging, keyboard support
 */
export default class SfGpsDsCaOnFormCurrency extends SfGpsDsFormCurrency {
  /* computed */

  get _inputId() {
    return `currency-${this._name}`;
  }

  get _hintId() {
    return `hint-${this._name}`;
  }

  get _errorId() {
    return `error-${this._name}`;
  }

  get hasError() {
    return !!this.sfGpsDsErrorMessage;
  }

  get computedInputClassName() {
    let classes = "ontario-input sfgpsdscaon-currency__input";
    if (this.hasError) {
      classes += " ontario-input__error";
    }
    return classes;
  }

  get computedAriaDescribedBy() {
    const ids = [];
    if (this.mergedHelpText) ids.push(this._hintId);
    if (this.hasError) ids.push(this._errorId);
    return ids.length > 0 ? ids.join(" ") : null;
  }

  get showFlag() {
    return this._propSetMap?.required || this._propSetMap?.optional;
  }

  get flagText() {
    if (this._propSetMap?.required) return "required";
    if (this._propSetMap?.optional) return "optional";
    return "";
  }

  get currencySymbol() {
    // Default to CAD for Ontario
    return "$";
  }

  /* lifecycle */

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
}
