/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * Licensed under the BSD 3-Clause license.
 */

import { api, track } from "lwc";
import SfGpsDsFormMultiselect from "c/sfGpsDsFormMultiselect";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormSelectableCards.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormSelectableCards";

export default class SfGpsDsCaOnFormSelectableCards extends SfGpsDsFormMultiselect {
  _uniqueId = `selectable-cards-${Math.random().toString(36).substring(2, 11)}`;

  // Flag to track when we're in the middle of applying a value
  // This allows us to return true from validation during value updates
  _isApplyingValue = false;

  // Tracked properties for error display (triggers reactivity)
  @track isError = false;
  @track errorMessage = "";

  @api configRequired;
  @api configErrorMessage;
  @api configOptionsJson;

  @track _expandedIndices = {};

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
      "sfgpsdscaon-selectable-card-group": true,
      "sfgpsdscaon-selectable-card-group--error": this.sfGpsDsIsError
    });
  }

  get inlineDecoratedOptions() {
    const selected = this._selectedValues;

    // Get extended options from configOptionsJson or nested propSetMap
    const nestedPropSetMap = this.jsonDef?.propSetMap?.propSetMap;
    const extendedOptionsJson =
      this.configOptionsJson || nestedPropSetMap?.optionsJson;
    let extendedOptions = {};

    if (extendedOptionsJson) {
      try {
        const parsed =
          typeof extendedOptionsJson === "string"
            ? JSON.parse(extendedOptionsJson)
            : extendedOptionsJson;
        if (Array.isArray(parsed)) {
          parsed.forEach((opt) => {
            extendedOptions[opt.value] = opt;
          });
        }
      } catch (e) {
        console.error("Error parsing optionsJson", e);
      }
    }

    return (this._realtimeOptions || []).map((opt, index) => {
      const optValue = opt.value || opt.name || opt.label;
      const optLabel = opt.label || opt.value || opt.name;
      const extended = extendedOptions[optValue] || {};
      const isChecked = selected.includes(optValue);
      const isExpanded = this._expandedIndices[index] || false;

      return {
        value: optValue,
        label: extended.label || optLabel,
        description: extended.description || "",
        linkLabel: extended.linkLabel || "",
        linkUrl: extended.linkUrl || "",
        badge: extended.badge || "",
        badgeVariant: extended.badgeVariant || "info",
        expandedContent: extended.expandedContent || "",
        checked: isChecked,
        isExpanded: isExpanded,
        expandButtonLabel: isExpanded ? "View less" : "View more",
        key: `opt-${index}-${optValue}`,
        id: `${this._uniqueId}-opt-${index}`,
        index: index,
        cardClassName: computeClass({
          "sfgpsdscaon-selectable-card": true,
          "sfgpsdscaon-selectable-card--checked": isChecked
        }),
        badgeClassName: computeClass({
          "sfgpsdscaon-selectable-card__badge": true,
          [`sfgpsdscaon-selectable-card__badge--${extended.badgeVariant || "info"}`]: true
        })
      };
    });
  }

  /**
   * Parses elementValue which can be a semicolon-delimited string or array.
   * @returns {string[]} Array of selected values
   */
  get _selectedValues() {
    if (!this.elementValue) return [];
    if (Array.isArray(this.elementValue)) return this.elementValue;
    if (typeof this.elementValue === "string") {
      return this.elementValue.split(";").filter((v) => v);
    }
    return [this.elementValue.toString()];
  }

  /* Event handlers */
  handleCardCheckboxChange(event) {
    if (DEBUG) console.log(CLASS_NAME, "handleCardCheckboxChange called");

    const checkbox = event.target;
    const value = checkbox.value;
    const checked = checkbox.checked;

    if (DEBUG) {
      console.log(CLASS_NAME, "  checkbox value:", value);
      console.log(CLASS_NAME, "  checkbox checked:", checked);
    }

    // Get current selected values as array
    let currentValues = [...this._selectedValues];

    if (checked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value);
      }
    } else {
      currentValues = currentValues.filter((v) => v !== value);
    }

    // OmniScript expects semicolon-delimited string for multiselect values
    const valueString = currentValues.join(";");

    if (DEBUG) {
      console.log(CLASS_NAME, "  valueString to apply:", valueString);
    }

    // Set flag to allow value to be applied without validation blocking it
    this._isApplyingValue = true;

    this.applyCallResp(valueString);

    // Clear the flag
    this._isApplyingValue = false;

    if (DEBUG) {
      console.log(
        CLASS_NAME,
        "  elementValue after applyCallResp:",
        this.elementValue
      );
    }
  }

  /**
   * Handles blur events from card checkboxes.
   * Triggers validation when focus leaves.
   */
  handleBlur() {
    this.reportValidity();
  }

  handleExpandClick(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10);
    this._expandedIndices = {
      ...this._expandedIndices,
      [index]: !this._expandedIndices[index]
    };
  }

  /* Validation */

  /**
   * Helper to check if selectable cards has any selected values.
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
   * Checks if the component is valid.
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
    this._inputSelector = "input[data-omni-input]";
    if (DEBUG) {
      console.log(CLASS_NAME, "  _inputSelector set to:", this._inputSelector);
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
