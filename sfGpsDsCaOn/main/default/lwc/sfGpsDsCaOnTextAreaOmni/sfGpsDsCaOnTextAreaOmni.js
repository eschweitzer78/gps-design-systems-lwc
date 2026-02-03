/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnTextAreaOmni";

/**
 * Ontario Design System TextArea for OmniStudio Custom LWC
 * Uses OmniscriptBaseMixin for proper OmniScript data integration.
 *
 * Usage in OmniScript:
 * - LWC Component Name: sfGpsDsCaOnTextAreaOmni
 * - Custom Attributes:
 *   - fieldName: Field name in omniJsonData
 *   - label: Field label
 *   - required: true/false
 *   - hintText: Optional hint text
 *   - rows: Number of visible rows (default 4)
 *   - maxLength: Maximum character length
 *   - placeholder: Placeholder text
 */
export default class SfGpsDsCaOnTextAreaOmni extends OmniscriptBaseMixin(
  LightningElement
) {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api label = "";
  @api name = "";
  @api hintText = "";
  @api required = false;
  @api optional = false;
  @api disabled = false;
  @api errorMessage = "";
  @api rows = 4;
  @api maxLength;
  @api placeholder = "";
  @api className = "";

  // OmniScript integration
  @api fieldName = "";

  /* ========================================
   * PRIVATE STATE
   * ======================================== */

  @track _value = "";
  @track _isInvalid = false;

  _inputId = `textarea-${Math.random().toString(36).substring(2, 11)}`;
  _hintId = `hint-${Math.random().toString(36).substring(2, 11)}`;
  _errorId = `error-${Math.random().toString(36).substring(2, 11)}`;

  /* ========================================
   * PUBLIC API
   * ======================================== */

  @api
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val || "";
  }

  @api
  checkValidity() {
    const textarea = this.template.querySelector("textarea");
    return textarea ? textarea.checkValidity() : true;
  }

  @api
  reportValidity() {
    const textarea = this.template.querySelector("textarea");
    if (textarea) {
      const isValid = textarea.checkValidity();
      this._isInvalid = !isValid;
      return isValid;
    }
    return true;
  }

  @api
  setCustomValidity(message) {
    const textarea = this.template.querySelector("textarea");
    if (textarea) {
      textarea.setCustomValidity(message);
      this._isInvalid = !!message;
    }
  }

  @api
  focus() {
    const textarea = this.template.querySelector("textarea");
    if (textarea) textarea.focus();
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get computedTextAreaClassName() {
    let classes = "ontario-input ontario-textarea";
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-input__error";
    }
    if (this.className) {
      classes += ` ${this.className}`;
    }
    return classes;
  }

  get computedAriaDescribedBy() {
    const ids = [];
    if (this.hintText) ids.push(this._hintId);
    if (this.errorMessage) ids.push(this._errorId);
    return ids.length > 0 ? ids.join(" ") : null;
  }

  get computedAriaInvalid() {
    return this._isInvalid || this.errorMessage ? "true" : "false";
  }

  get showFlag() {
    return this.required === true || this.optional === true;
  }

  get flagText() {
    if (this.required) return "required";
    if (this.optional) return "optional";
    return "";
  }

  get hasError() {
    return !!this.errorMessage;
  }

  get computedRows() {
    return this.rows || 4;
  }

  get computedMaxLength() {
    return this.maxLength ? Number(this.maxLength) : null;
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  _updateOmniScriptData() {
    if (!this.fieldName) return;

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "_updateOmniScriptData",
        this.fieldName,
        this._value
      );

    // Use OmniscriptBaseMixin method to update OmniScript data
    this.omniUpdateDataJson({
      [this.fieldName]: this._value
    });
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleInput(event) {
    this._value = event.target.value;

    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this._value },
        bubbles: true,
        composed: true
      })
    );

    this._updateOmniScriptData();
  }

  handleChange(event) {
    this._value = event.target.value;

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this._value },
        bubbles: true,
        composed: true
      })
    );

    this._updateOmniScriptData();
  }

  handleBlur() {
    this.reportValidity();
    this.dispatchEvent(
      new CustomEvent("blur", {
        detail: { value: this._value },
        bubbles: true,
        composed: true
      })
    );
  }

  handleFocus() {
    this.dispatchEvent(
      new CustomEvent("focus", {
        detail: { value: this._value },
        bubbles: true,
        composed: true
      })
    );
  }
}
