/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * Licensed under the BSD 3-Clause license.
 */

import SfGpsDsFormTextarea from "c/sfGpsDsFormTextarea";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormTextarea.html";

export default class SfGpsDsCaOnFormTextarea extends SfGpsDsFormTextarea {
  _uniqueId = `textarea-${Math.random().toString(36).substring(2, 11)}`;

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

  get computedRows() {
    return this._propSetMap?.rows || 5;
  }

  get computedInputClassName() {
    return computeClass({
      "ontario-textarea": true,
      "ontario-textarea__error": this.sfGpsDsIsError
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

  focusInput() {
    try {
      const textarea = this.template.querySelector("textarea");
      if (textarea) textarea.focus();
    } catch {
      /* fail silently */
    }
  }

  render() {
    return tmpl;
  }
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    this.classList.add("caon-scope");
  }
}
