/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptRange from "c/sfGpsDsOsrtOmniscriptRange";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixin";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";
import tmpl from "./sfGpsDsCaOnFormRange.html";

/**
 * @slot Range
 * @description Ontario Design System Range/Slider input for OmniStudio forms.
 * Extends the base OmniScript Range with Ontario DS styling and validation.
 *
 * This component overrides the standard OmniScript Range element to provide
 * Ontario Design System styling while maintaining full slider functionality.
 *
 * ## Architecture
 * - Extends: SfGpsDsOmniHasValidationMixin(OmniscriptRange)
 * - Input Type: HTML range input styled with Ontario DS
 * - Validation: Min/max range bounds, step validation
 *
 * ## OmniScript Configuration
 * In OmniScript Designer, configure the Range:
 * - Range Low: Minimum value
 * - Range High: Maximum value
 * - Step: Increment step size
 * - Default Value: Initial slider position
 *
 * ## Inherited Properties (from OmniScript)
 * - _propSetMap.rangeLow: Minimum value
 * - _propSetMap.rangeHigh: Maximum value
 * - _propSetMap.step: Step increment
 * - elementValue: Current slider value
 *
 * ## OmniScript Registration
 * Register in your OmniScript LWC override:
 * ```javascript
 * import sfGpsDsCaOnFormRange from "c/sfGpsDsCaOnFormRange";
 *
 * static elementTypeToLwcConstructorMap = {
 *   ...OmniscriptBaseOsrt.elementTypeToLwcConstructorMap,
 *   "Range": sfGpsDsCaOnFormRange,
 * };
 * ```
 *
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Custom slider styling with Ontario colors
 * - WCAG 2.1 AA: Proper labeling, keyboard accessible, aria attributes
 */
export default class SfGpsDsCaOnFormRange extends SfGpsDsOmniHasValidationMixin(
  OmniscriptRange
) {
  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * Gets the merged label with any merge field values replaced.
   * @returns {string} The resolved label text
   */
  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  /**
   * Gets the merged help text with any merge field values replaced.
   * @returns {string} The resolved help text
   */
  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  /**
   * Gets the minimum value for the range.
   * @returns {number} The minimum value
   */
  get minValue() {
    return this._propSetMap.rangeLow || 0;
  }

  /**
   * Gets the maximum value for the range.
   * @returns {number} The maximum value
   */
  get maxValue() {
    return this._propSetMap.rangeHigh || 100;
  }

  /**
   * Gets the step value for the range.
   * @returns {number} The step increment
   */
  get stepValue() {
    return this._propSetMap.step || 1;
  }

  /**
   * Computes the unique ID for the input element.
   * @returns {string} The input ID
   */
  get inputId() {
    return `range-${this._name}`;
  }

  /**
   * Computes the percentage position for the value indicator.
   * @returns {number} The percentage (0-100)
   */
  get valuePercentage() {
    const value = this.elementValue || this.minValue;
    const range = this.maxValue - this.minValue;
    if (range === 0) return 0;
    return ((value - this.minValue) / range) * 100;
  }

  /**
   * Gets the current display value.
   * @returns {number|string} The current value or min value if not set
   */
  get displayValue() {
    return this.elementValue != null ? this.elementValue : this.minValue;
  }

  /**
   * Computes a descriptive value text for screen readers.
   * AODA/WCAG: Provides context for the current value (e.g., "50 out of 100").
   * @returns {string} Descriptive value text
   */
  get computedAriaValueText() {
    const value = this.displayValue;
    const min = this.minValue;
    const max = this.maxValue;
    return `${value} out of ${max}`;
  }

  /**
   * Computes the aria-describedby attribute value.
   * References hint text and error message elements when present.
   * @returns {string|null} Space-separated IDs or null
   */
  get computedAriaDescribedBy() {
    const ids = [];
    if (this.mergedHelpText) {
      ids.push(`hint-${this.inputId}`);
    }
    if (this.sfGpsDsIsError) {
      ids.push(`error-${this.inputId}`);
    }
    return ids.length > 0 ? ids.join(" ") : null;
  }

  /**
   * Computes the accessible label for the range input.
   * Includes current value for screen reader users.
   * @returns {string} The accessible label
   */
  get computedAriaLabel() {
    return `${this.mergedLabel}, slider, current value ${this.displayValue}, minimum ${this.minValue}, maximum ${this.maxValue}`;
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Renders the Ontario-specific template.
   * @returns {Object} The imported HTML template
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes the component when added to DOM.
   * Sets up Ontario DS-specific styling classes.
   */
  connectedCallback() {
    super.connectedCallback();

    // Set read-only styling class for Ontario DS
    this._readOnlyClass = "sfgpsdscaon-read-only";

    // Add Ontario DS scope class for CSS isolation
    this.classList.add("caon-scope");
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handles range input changes.
   * Updates OmniScript data and triggers validation.
   * @param {Event} event - The input change event
   */
  handleRangeChange(event) {
    const value = parseFloat(event.target.value);
    this.applyCallResp(value);
  }

  /**
   * Handles range input for real-time value display.
   * @param {Event} event - The input event
   */
  handleRangeInput(event) {
    // Force re-render for value display
    // eslint-disable-next-line no-self-assign
    this.elementValue = parseFloat(event.target.value);
  }
}
