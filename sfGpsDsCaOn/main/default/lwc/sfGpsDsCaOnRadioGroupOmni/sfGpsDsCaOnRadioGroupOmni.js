/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnRadioGroupOmni";

/**
 * Ontario Design System RadioGroup for OmniStudio Custom LWC
 * Shadow DOM version for OmniStudio compatibility
 *
 * Usage in OmniScript:
 * - LWC Component Name: sfGpsDsCaOnRadioGroupOmni
 * - Custom Attributes:
 *   - fieldName: Field name in omniJsonData
 *   - optionsJson: JSON array of {value, label} objects
 *   - legend/label: Group label
 *   - required: true/false
 */
export default class SfGpsDsCaOnRadioGroupOmni extends LightningElement {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api legend = "";
  @api label = ""; // Alias for legend
  @api name = "";
  @api hintText = "";
  @api required = false;
  @api optional = false;
  @api disabled = false;
  @api errorMessage = "";
  @api className = "";

  // OmniScript integration
  @api fieldName = "";
  @api optionsJson = "";

  /* ========================================
   * PRIVATE STATE
   * ======================================== */

  @track _value = "";
  @track _options = [];
  @track _isInvalid = false;

  _groupId = `radiogroup-${Math.random().toString(36).substring(2, 11)}`;
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
    this._value = val;
  }

  @api
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value ? [...value] : [];
  }

  @api
  checkValidity() {
    if (this.required && !this._value) {
      return false;
    }
    return true;
  }

  @api
  reportValidity() {
    const isValid = this.checkValidity();
    this._isInvalid = !isValid;
    return isValid;
  }

  @api
  setCustomValidity(message) {
    this._isInvalid = !!message;
  }

  @api
  focus() {
    const firstRadio = this.template.querySelector('input[type="radio"]');
    if (firstRadio) firstRadio.focus();
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");

    // Parse options from JSON
    if (this.optionsJson) {
      this._options = this._parseJson(this.optionsJson);
    }
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get computedLegend() {
    return this.legend || this.label || "";
  }

  get computedFieldsetClassName() {
    let classes = "ontario-fieldset";
    if (this.className) classes += ` ${this.className}`;
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

  get computedName() {
    return this.name || this._groupId;
  }

  get decoratedOptions() {
    return this._options.map((opt, index) => ({
      ...opt,
      id: `${this._groupId}-${index}`,
      checked: opt.value === this._value,
      inputClassName:
        this._isInvalid || this.errorMessage
          ? "ontario-radios__input ontario-radios__input--error"
          : "ontario-radios__input"
    }));
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  _parseJson(input) {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === "object") {
      return input.value !== undefined ? [input] : [];
    }

    if (typeof input === "string") {
      let jsonStr = input;
      // Handle OmniStudio double-escaping
      if (
        jsonStr.includes("\\[") ||
        jsonStr.includes("\\{") ||
        jsonStr.includes('\\"')
      ) {
        jsonStr = jsonStr
          .replace(/\\\[/g, "[")
          .replace(/\\\]/g, "]")
          .replace(/\\\{/g, "{")
          .replace(/\\\}/g, "}")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
      try {
        const parsed = JSON.parse(jsonStr);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        if (DEBUG) console.error(CLASS_NAME, "JSON parse error", e);
        return [];
      }
    }
    return [];
  }

  _updateOmniScriptData() {
    if (!this.fieldName) return;

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "_updateOmniScriptData",
        this.fieldName,
        this._value
      );

    this.dispatchEvent(
      new CustomEvent("omniupdatedata", {
        detail: { [this.fieldName]: this._value },
        bubbles: true,
        composed: true
      })
    );
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

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
