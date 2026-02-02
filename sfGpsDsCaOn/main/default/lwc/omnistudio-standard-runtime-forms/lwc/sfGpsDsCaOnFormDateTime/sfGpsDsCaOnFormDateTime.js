/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDateTime from "c/sfGpsDsFormDateTime";
import tmpl from "./sfGpsDsCaOnFormDateTime.html";

/**
 * @slot DateTime
 * @description Ontario Design System DateTime input for OmniStudio forms.
 * Combines date and time inputs with Ontario DS styling.
 *
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario date and input styling
 * - WCAG 2.1 AA: Proper labeling, error messaging, keyboard support
 */
export default class SfGpsDsCaOnFormDateTime extends SfGpsDsFormDateTime {
  /* computed */

  get _inputId() {
    return `datetime-${this._name}`;
  }

  get _dateId() {
    return `date-${this._name}`;
  }

  get _timeId() {
    return `time-${this._name}`;
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
    let classes = "ontario-input sfgpsdscaon-datetime__input";
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
