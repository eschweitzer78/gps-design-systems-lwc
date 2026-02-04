/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * Licensed under the BSD 3-Clause license.
 */

import { api, track } from "lwc";
import SfGpsDsFormMultiselect from "c/sfGpsDsFormMultiselect";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormMultiselect.html";

const DEBUG = true;
const CLASS_NAME = "SfGpsDsCaOnFormMultiselect";

export default class SfGpsDsCaOnFormMultiselect extends SfGpsDsFormMultiselect {
  _uniqueId = `multiselect-${Math.random().toString(36).substring(2, 11)}`;

  // Flag to track when we're in the middle of applying a value
  // This allows us to return true from validation during value updates
  _isApplyingValue = false;

  // Tracked properties for error display (triggers reactivity)
  @track isError = false;
  @track errorMessage = "";

  /* IDs */
  get hintId() {
    return `${this._uniqueId}-hint`;
  }
  get errorId() {
    return `${this._uniqueId}-error`;
  }

  /* Computed properties */
  get showRequiredFlag() {
    return this._propSetMap?.required === true;
  }
  get showOptionalFlag() {
    return this._propSetMap?.optional === true && !this._propSetMap?.required;
  }
  get computedAriaRequired() {
    return this._propSetMap?.required ? "true" : "false";
  }
  get computedAriaInvalid() {
    return this.sfGpsDsIsError ? "true" : "false";
  }

  /**
   * Returns true if the component is in an error state.
   * Used by the template to show/hide the error container.
   */
  get sfGpsDsIsError() {
    return this.isError || this._sfGpsDsCustomValidation;
  }

  /**
   * Returns the error message to display.
   * Used by the template for the error message content.
   */
  get sfGpsDsErrorMessage() {
    return this._sfGpsDsCustomValidation || this.errorMessage;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      [this.hintId]: this.mergedHelpText,
      [this.errorId]: this.sfGpsDsIsError
    });
  }

  get computedFieldsetClassName() {
    return computeClass({
      "ontario-fieldset": true,
      "ontario-fieldset--error": this.sfGpsDsIsError
    });
  }

  /**
   * Parses elementValue which can be a semicolon-delimited string or array.
   * @returns {string[]} Array of selected values
   */
  get _selectedValues() {
    if (DEBUG) {
      console.log(CLASS_NAME, "_selectedValues getter called");
      console.log(CLASS_NAME, "  elementValue:", this.elementValue);
      console.log(
        CLASS_NAME,
        "  typeof elementValue:",
        typeof this.elementValue
      );
    }
    if (!this.elementValue) return [];
    if (Array.isArray(this.elementValue)) return this.elementValue;
    if (typeof this.elementValue === "string") {
      return this.elementValue.split(";").filter((v) => v);
    }
    return [this.elementValue.toString()];
  }

  get inlineDecoratedOptions() {
    if (DEBUG) {
      console.log(CLASS_NAME, "inlineDecoratedOptions getter called");
      console.log(CLASS_NAME, "  _realtimeOptions:", this._realtimeOptions);
      console.log(CLASS_NAME, "  _options:", this._options);
    }

    const selected = this._selectedValues;

    if (DEBUG) console.log(CLASS_NAME, "  selected values:", selected);

    return (this._realtimeOptions || []).map((opt, index) => {
      // OmniScript convention: opt.name is the identifier/value to store,
      // opt.value is the display label
      const optValue = opt.name || opt.value || opt.label;
      const optLabel = opt.value || opt.label || opt.name;

      if (DEBUG && index === 0) {
        console.log(CLASS_NAME, "  first option raw:", opt);
        console.log(CLASS_NAME, "  first option optValue:", optValue);
        console.log(CLASS_NAME, "  first option optLabel:", optLabel);
      }

      return {
        ...opt,
        value: optValue,
        label: optLabel,
        id: `${this._uniqueId}-opt-${index}`,
        checked: selected.includes(optValue)
      };
    });
  }

  /* Event handlers */

  /**
   * Handles change events from the native checkbox elements.
   * Aggregates selected values and updates OmniScript data.
   * Follows the same pattern as sfGpsDsCaOnFormSelect.
   * @param {Event} event - The change event from a checkbox element
   */
  handleCheckboxChange(event) {
    if (DEBUG) console.log(CLASS_NAME, "handleCheckboxChange called");

    const checkbox = event.target;
    const value = checkbox.value;
    const checked = checkbox.checked;

    if (DEBUG) {
      console.log(CLASS_NAME, "  checkbox value:", value);
      console.log(CLASS_NAME, "  checkbox checked:", checked);
      console.log(
        CLASS_NAME,
        "  current elementValue before:",
        this.elementValue
      );
    }

    // Get current selected values as array
    let currentValues = [...this._selectedValues];

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "  currentValues before modification:",
        currentValues
      );

    if (checked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value);
      }
    } else {
      currentValues = currentValues.filter((v) => v !== value);
    }

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "  currentValues after modification:",
        currentValues
      );

    // Update OmniScript data - use semicolon-delimited string format
    // This follows the same pattern as sfGpsDsCaOnFormSelect.handleChange
    const valueString = currentValues.join(";");

    if (DEBUG) {
      console.log(CLASS_NAME, "  valueString to apply:", valueString);
      console.log(CLASS_NAME, "  calling applyCallResp...");
      console.log(
        CLASS_NAME,
        "  applyCallResp exists:",
        typeof this.applyCallResp
      );
    }

    // Set flag to allow value to be applied without validation blocking it
    this._isApplyingValue = true;

    // Update the validation input's value BEFORE calling applyCallResp
    const validationInput = this.template.querySelector(
      "input.sfgpsdscaon-validation-input"
    );
    if (validationInput) {
      validationInput.value = valueString;
      if (DEBUG)
        console.log(CLASS_NAME, "  validationInput.value set to:", valueString);
    }

    this.applyCallResp(valueString);

    // Clear the flag
    this._isApplyingValue = false;

    if (DEBUG) {
      console.log(CLASS_NAME, "  applyCallResp called");
      console.log(
        CLASS_NAME,
        "  elementValue after applyCallResp:",
        this.elementValue
      );
    }
  }

  /**
   * Handles blur events from checkbox elements.
   * Triggers validation when a checkbox loses focus.
   */
  handleBlur() {
    this.reportValidity();
  }

  /* Validation */

  /**
   * Helper to check if multiselect has any selected values.
   * @returns {boolean} True if at least one option is selected
   */
  _hasSelection() {
    const val = this.elementValue;
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "string") return val.trim().length > 0;
    return true;
  }

  /**
   * Checks if the multiselect is valid.
   * Returns true during value updates to prevent blocking applyCallResp.
   * @returns {boolean} True if valid or if applying value, false otherwise
   */
  @api checkValidity() {
    // During value updates, always return true to allow the value to be applied
    if (this._isApplyingValue) {
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "checkValidity: returning true (applying value)"
        );
      return true;
    }

    const isRequired = this._propSetMap?.required === true;
    const hasValue = this._hasSelection();
    const valid = !isRequired || hasValue;

    if (DEBUG) {
      console.log(CLASS_NAME, "checkValidity called");
      console.log(CLASS_NAME, "  isRequired:", isRequired);
      console.log(CLASS_NAME, "  hasValue:", hasValue);
      console.log(CLASS_NAME, "  valid:", valid);
    }

    // Set isValid to dispatch validation event to OmniScript
    this.isValid = valid;

    return valid;
  }

  /**
   * Reports validity and updates the error state.
   * Returns true during value updates to prevent blocking applyCallResp.
   * @returns {boolean} True if valid or if applying value, false otherwise
   */
  @api reportValidity() {
    // During value updates, always return true to allow the value to be applied
    if (this._isApplyingValue) {
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "reportValidity: returning true (applying value)"
        );
      return true;
    }

    const valid = this.checkValidity();

    if (DEBUG) {
      console.log(CLASS_NAME, "reportValidity called");
      console.log(CLASS_NAME, "  valid:", valid);
    }

    // Update error display state - this is what sfGpsDsIsError uses
    this.isError = !valid;
    this._showValidation = !valid;

    // Set error message when invalid
    if (!valid) {
      this.errorMessage =
        this.mergedMessageWhenValueMissing ||
        this._messageWhenValueMissing ||
        "This field is required";
    } else {
      this.errorMessage = "";
    }

    if (DEBUG) {
      console.log(CLASS_NAME, "  isError:", this.isError);
      console.log(CLASS_NAME, "  errorMessage:", this.errorMessage);
    }

    return valid;
  }

  /* Lifecycle */

  /**
   * Initialize component variables.
   * Sets the input selector for the parent validation framework.
   */
  initCompVariables() {
    if (DEBUG) console.log(CLASS_NAME, "initCompVariables called");
    super.initCompVariables();
    // Set the selector so the parent class can find our validation input
    // Uses a visually hidden text input (not type="hidden") for Constraint Validation API support
    this._inputSelector = "input.sfgpsdscaon-validation-input[data-omni-input]";
    if (DEBUG) {
      console.log(CLASS_NAME, "  _inputSelector set to:", this._inputSelector);
      console.log(CLASS_NAME, "  jsonDef:", this.jsonDef);
      console.log(CLASS_NAME, "  _propSetMap:", this._propSetMap);
    }
  }

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback called");
    if (super.connectedCallback) super.connectedCallback();
    this._readOnlyClass = "sfgpsdscaon-read-only";
    this.classList.add("caon-scope");
    if (DEBUG) {
      console.log(CLASS_NAME, "  connectedCallback complete");
      console.log(CLASS_NAME, "  elementValue:", this.elementValue);
      console.log(CLASS_NAME, "  _realtimeOptions:", this._realtimeOptions);
    }
  }

  _hasRendered = false;

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    // On first render, check validity to set initial validation state
    // This ensures OmniScript knows if the field is initially invalid
    if (!this._hasRendered) {
      this._hasRendered = true;

      // Defer to allow DOM to settle
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      Promise.resolve().then(() => {
        // Check validity without showing errors (user hasn't interacted yet)
        // This dispatches the VALID/INVALID event to OmniScript
        this.checkValidity();

        if (DEBUG) {
          console.log(CLASS_NAME, "renderedCallback: initial validity checked");
          console.log(CLASS_NAME, "  isValid:", this.isValid);
        }
      });
    }
  }
}
