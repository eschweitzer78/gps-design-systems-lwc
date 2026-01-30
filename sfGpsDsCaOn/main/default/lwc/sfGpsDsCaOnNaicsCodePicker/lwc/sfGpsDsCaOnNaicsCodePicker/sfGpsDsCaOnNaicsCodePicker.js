/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnNaicsCodePicker";

/**
 * Ontario Design System - NAICS Code Picker Component
 *
 * A composite component for selecting North American Industry Classification
 * System (NAICS) codes using 5 cascading dropdown levels.
 *
 * Levels:
 * 1. Sector (2-digit)
 * 2. Sub sector (3-digit)
 * 3. Industry group (4-digit)
 * 4. Industry (5-digit)
 * 5. National industry (6-digit)
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Follows dropdown and form patterns
 * - WCAG 2.1 AA: Proper labels, focus management
 */
export default class SfGpsDsCaOnNaicsCodePicker extends LightningElement {
  static renderMode = "light";

  /**
   * Label for the component
   */
  @api label =
    "Select North American Industry Classification System (NAICS) code";

  /**
   * Help text displayed below the label
   */
  @api helpText =
    "The NAICS is a six digit code that represents your business at this facility or site.";

  /**
   * Whether the field is required
   */
  @api required = false;

  /**
   * Whether the field is optional
   */
  @api optional = false;

  /**
   * Whether the component is disabled
   */
  @api disabled = false;

  /**
   * Error message to display
   */
  @api errorMessage;

  /**
   * Additional CSS class
   */
  @api className;

  /**
   * Label for Sector dropdown
   */
  @api sectorLabel = "Sector";

  /**
   * Label for Sub sector dropdown
   */
  @api subSectorLabel = "Sub sector";

  /**
   * Label for Industry group dropdown
   */
  @api industryGroupLabel = "Industry group";

  /**
   * Label for Industry dropdown
   */
  @api industryLabel = "Industry";

  /**
   * Label for National industry dropdown
   */
  @api nationalIndustryLabel = "National industry";

  /**
   * Sector options
   * Format: [{ value: "11", label: "11 Agriculture, forestry, fishing and hunting" }]
   */
  @api
  get sectorOptions() {
    return this._sectorOptions;
  }
  set sectorOptions(val) {
    this._sectorOptions = this._parseOptions(val);
  }
  _sectorOptions = [];

  /**
   * Sub sector options (all, filtered by component based on sector)
   * Format: [{ value: "111", label: "111 Crop production", parentValue: "11" }]
   */
  @api
  get subSectorOptions() {
    return this._subSectorOptions;
  }
  set subSectorOptions(val) {
    this._subSectorOptions = this._parseOptions(val);
  }
  _subSectorOptions = [];

  /**
   * Industry group options
   * Format: [{ value: "1111", label: "1111 Oilseed and grain farming", parentValue: "111" }]
   */
  @api
  get industryGroupOptions() {
    return this._industryGroupOptions;
  }
  set industryGroupOptions(val) {
    this._industryGroupOptions = this._parseOptions(val);
  }
  _industryGroupOptions = [];

  /**
   * Industry options
   * Format: [{ value: "11111", label: "11111 Soybean farming", parentValue: "1111" }]
   */
  @api
  get industryOptions() {
    return this._industryOptions;
  }
  set industryOptions(val) {
    this._industryOptions = this._parseOptions(val);
  }
  _industryOptions = [];

  /**
   * National industry options
   * Format: [{ value: "111110", label: "111110 Soybean farming", parentValue: "11111" }]
   */
  @api
  get nationalIndustryOptions() {
    return this._nationalIndustryOptions;
  }
  set nationalIndustryOptions(val) {
    this._nationalIndustryOptions = this._parseOptions(val);
  }
  _nationalIndustryOptions = [];

  /**
   * Currently selected NAICS code (6-digit)
   */
  @api
  get value() {
    return this._nationalIndustry;
  }
  set value(val) {
    if (val && val !== this._nationalIndustry) {
      this._setValueFromCode(val);
    }
  }

  /* Internal state */
  @track _sector = "";
  @track _subSector = "";
  @track _industryGroup = "";
  @track _industry = "";
  @track _nationalIndustry = "";

  _uniqueId = Math.random().toString(36).substring(2, 9);

  /* Computed properties */

  get computedClassName() {
    return computeClass({
      "sfgpsdscaon-naics-code-picker": true,
      [this.className]: this.className
    });
  }

  get hasError() {
    return Boolean(this.errorMessage);
  }

  get helpTextId() {
    return `naics-help-${this._uniqueId}`;
  }

  get errorId() {
    return `naics-error-${this._uniqueId}`;
  }

  /* Filtered options based on parent selections */

  get filteredSubSectorOptions() {
    if (!this._sector) return [];
    return this._subSectorOptions.filter(
      (opt) => opt.parentValue === this._sector
    );
  }

  get filteredIndustryGroupOptions() {
    if (!this._subSector) return [];
    return this._industryGroupOptions.filter(
      (opt) => opt.parentValue === this._subSector
    );
  }

  get filteredIndustryOptions() {
    if (!this._industryGroup) return [];
    return this._industryOptions.filter(
      (opt) => opt.parentValue === this._industryGroup
    );
  }

  get filteredNationalIndustryOptions() {
    if (!this._industry) return [];
    return this._nationalIndustryOptions.filter(
      (opt) => opt.parentValue === this._industry
    );
  }

  /* Selection state */

  get hasSelection() {
    return Boolean(this._nationalIndustry);
  }

  get selectedCodeDisplay() {
    if (!this._nationalIndustry) return "";
    const opt = this._nationalIndustryOptions.find(
      (o) => o.value === this._nationalIndustry
    );
    return opt ? opt.label : this._nationalIndustry;
  }

  /* Disabled states for cascading */

  get isSubSectorDisabled() {
    return this.disabled || !this._sector;
  }

  get isIndustryGroupDisabled() {
    return this.disabled || !this._subSector;
  }

  get isIndustryDisabled() {
    return this.disabled || !this._industryGroup;
  }

  get isNationalIndustryDisabled() {
    return this.disabled || !this._industry;
  }

  /* Methods */

  _parseOptions(val) {
    if (!val) return [];
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        console.error(CLASS_NAME, "Error parsing options JSON", e);
        return [];
      }
    }
    return Array.isArray(val) ? val : [];
  }

  _setValueFromCode(code) {
    // Derive parent values from the 6-digit code
    if (code && code.length === 6) {
      this._sector = code.substring(0, 2);
      this._subSector = code.substring(0, 3);
      this._industryGroup = code.substring(0, 4);
      this._industry = code.substring(0, 5);
      this._nationalIndustry = code;
    }
  }

  _dispatchChange() {
    const detail = {
      value: this._nationalIndustry,
      sector: this._sector,
      subSector: this._subSector,
      industryGroup: this._industryGroup,
      industry: this._industry,
      nationalIndustry: this._nationalIndustry,
      label: this.selectedCodeDisplay
    };

    if (DEBUG) console.log(CLASS_NAME, "_dispatchChange", detail);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        composed: true
      })
    );
  }

  /* Event handlers */

  handleSectorChange(event) {
    const newValue = event.detail?.value || event.target?.value || "";
    if (DEBUG) console.log(CLASS_NAME, "handleSectorChange", newValue);

    this._sector = newValue;
    // Clear dependent selections
    this._subSector = "";
    this._industryGroup = "";
    this._industry = "";
    this._nationalIndustry = "";

    this._dispatchChange();
  }

  handleSubSectorChange(event) {
    const newValue = event.detail?.value || event.target?.value || "";
    if (DEBUG) console.log(CLASS_NAME, "handleSubSectorChange", newValue);

    this._subSector = newValue;
    // Clear dependent selections
    this._industryGroup = "";
    this._industry = "";
    this._nationalIndustry = "";

    this._dispatchChange();
  }

  handleIndustryGroupChange(event) {
    const newValue = event.detail?.value || event.target?.value || "";
    if (DEBUG) console.log(CLASS_NAME, "handleIndustryGroupChange", newValue);

    this._industryGroup = newValue;
    // Clear dependent selections
    this._industry = "";
    this._nationalIndustry = "";

    this._dispatchChange();
  }

  handleIndustryChange(event) {
    const newValue = event.detail?.value || event.target?.value || "";
    if (DEBUG) console.log(CLASS_NAME, "handleIndustryChange", newValue);

    this._industry = newValue;
    // Clear dependent selections
    this._nationalIndustry = "";

    this._dispatchChange();
  }

  handleNationalIndustryChange(event) {
    const newValue = event.detail?.value || event.target?.value || "";
    if (DEBUG)
      console.log(CLASS_NAME, "handleNationalIndustryChange", newValue);

    this._nationalIndustry = newValue;

    this._dispatchChange();
  }

  handleClearSelection(event) {
    event.preventDefault();
    if (DEBUG) console.log(CLASS_NAME, "handleClearSelection");

    this._sector = "";
    this._subSector = "";
    this._industryGroup = "";
    this._industry = "";
    this._nationalIndustry = "";

    this._dispatchChange();

    this.dispatchEvent(
      new CustomEvent("clear", {
        bubbles: true,
        composed: true
      })
    );
  }

  /* Public methods */

  @api
  clear() {
    this._sector = "";
    this._subSector = "";
    this._industryGroup = "";
    this._industry = "";
    this._nationalIndustry = "";
    this._dispatchChange();
  }

  @api
  checkValidity() {
    if (this.required && !this._nationalIndustry) {
      return false;
    }
    return true;
  }

  @api
  reportValidity() {
    return this.checkValidity();
  }

  /* Lifecycle */

  connectedCallback() {
    this.classList.add("caon-scope");
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }
}
