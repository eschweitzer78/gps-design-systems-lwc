/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * Licensed under the BSD 3-Clause license.
 */

import SfGpsDsFormTime from "c/sfGpsDsFormTime";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormTime.html";

export default class SfGpsDsCaOnFormTime extends SfGpsDsFormTime {
  _uniqueId = `time-${Math.random().toString(36).substring(2, 11)}`;

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

  render() {
    return tmpl;
  }
  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    this.classList.add("caon-scope");
  }
}
