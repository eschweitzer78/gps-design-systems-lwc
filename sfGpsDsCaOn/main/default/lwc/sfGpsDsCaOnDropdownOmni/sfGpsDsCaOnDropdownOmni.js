/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";
import {
  parseOptionsJson,
  generateId,
  computeSelectClassName,
  computeAriaDescribedBy,
  getFlagText,
  decorateOptions,
  createChangeEvent,
  createBlurEvent,
  createFocusEvent
} from "c/sfGpsDsCaOnFormUtils";

/**
 * Ontario Design System Dropdown for OmniStudio Custom LWC
 * Uses OmniscriptBaseMixin for proper OmniScript data integration.
 * Uses shared utilities for logic, provides Shadow DOM rendering.
 *
 * Usage in OmniScript:
 * - LWC Component Name: sfGpsDsCaOnDropdownOmni
 * - Custom Attributes:
 *   - fieldName: Field name in omniJsonData
 *   - optionsJson: JSON array of {value, label} objects
 *   - label: Field label
 *   - required: true/false
 */
export default class SfGpsDsCaOnDropdownOmni extends OmniscriptBaseMixin(
  LightningElement
) {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api label = "";
  @api name = "";
  @api hintText = "";
  @api defaultOptionLabel = "Select";
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

  _inputId = generateId("select");
  _hintId = generateId("hint");
  _errorId = generateId("error");

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
    const select = this.template.querySelector("select");
    return select ? select.checkValidity() : true;
  }

  @api
  reportValidity() {
    const select = this.template.querySelector("select");
    if (select) {
      const isValid = select.checkValidity();
      this._isInvalid = !isValid;
      return isValid;
    }
    return true;
  }

  @api
  setCustomValidity(message) {
    const select = this.template.querySelector("select");
    if (select) {
      select.setCustomValidity(message);
      this._isInvalid = !!message;
    }
  }

  @api
  focus() {
    const select = this.template.querySelector("select");
    if (select) select.focus();
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    // Parse options from JSON using shared mixin
    if (this.optionsJson) {
      this._options = parseOptionsJson(this.optionsJson);
    }
  }

  /* ========================================
   * COMPUTED PROPERTIES (using mixin)
   * ======================================== */

  get computedSelectClassName() {
    return computeSelectClassName(
      this._isInvalid,
      this.errorMessage,
      this.className
    );
  }

  get computedAriaDescribedBy() {
    return computeAriaDescribedBy(
      this.hintText,
      this.errorMessage,
      this._hintId,
      this._errorId
    );
  }

  get computedAriaInvalid() {
    return this._isInvalid || this.errorMessage ? "true" : "false";
  }

  get showFlag() {
    return this.required === true || this.optional === true;
  }

  get flagText() {
    return getFlagText(this.required, this.optional);
  }

  get hasError() {
    return !!this.errorMessage;
  }

  get decoratedOptions() {
    return decorateOptions(this._options, this._value);
  }

  /* ========================================
   * EVENT HANDLERS (using mixin events)
   * ======================================== */

  handleChange(event) {
    this._value = event.target.value;

    // Dispatch change event
    this.dispatchEvent(createChangeEvent(this._value));

    // Update OmniScript data using mixin method
    if (this.fieldName) {
      this.omniUpdateDataJson({
        [this.fieldName]: this._value
      });
    }
  }

  handleBlur() {
    this.reportValidity();
    this.dispatchEvent(createBlurEvent(this._value));
  }

  handleFocus() {
    this.dispatchEvent(createFocusEvent(this._value));
  }
}
