/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormSelect from "c/sfGpsDsFormSelect";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";
import tmpl from "./sfGpsDsCaOnFormNaicsCodePicker.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormNaicsCodePicker";

/**
 * @slot NaicsCodePicker
 * @description Ontario Design System NAICS Code Picker for OmniStudio forms.
 *
 * Displays a NAICS code picker with 5 cascading dropdown levels:
 * 1. Sector (2-digit)
 * 2. Sub sector (3-digit)
 * 3. Industry group (4-digit)
 * 4. Industry (5-digit)
 * 5. National industry (6-digit)
 *
 * Options Format (via Custom Properties):
 * Set the following properties in Custom Properties:
 * - sectorOptionsJson: [{ "value": "11", "label": "11 Agriculture..." }]
 * - subSectorOptionsJson: [{ "value": "111", "label": "111 Crop production", "parentValue": "11" }]
 * - industryGroupOptionsJson: [{ "value": "1111", "label": "1111 Oilseed...", "parentValue": "111" }]
 * - industryOptionsJson: [{ "value": "11111", "label": "11111 Soybean...", "parentValue": "1111" }]
 * - nationalIndustryOptionsJson: [{ "value": "111110", "label": "111110 Soybean farming", "parentValue": "11111" }]
 *
 * The component saves the final 6-digit NAICS code as the element value.
 *
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses sfGpsDsCaOnNaicsCodePicker component
 * - WCAG 2.1 AA: Proper fieldset/legend, keyboard navigation
 */
export default class SfGpsDsCaOnFormNaicsCodePicker extends SfGpsDsFormSelect {
  /**
   * Access custom properties added via JSON Editor.
   * OmniStudio nests custom propSetMap inside the standard propSetMap.
   * Path: jsonDef.propSetMap.propSetMap.customProperty
   * @returns {Object}
   */
  get _customPropSetMap() {
    return this.jsonDef?.propSetMap?.propSetMap || {};
  }

  /* computed */

  get mergedLabel() {
    return omniGetMergedField(
      this,
      this._propSetMap?.label ||
        "Select North American Industry Classification System (NAICS) code"
    );
  }

  get mergedHelpText() {
    return omniGetMergedField(
      this,
      this._propSetMap?.helpText ||
        "The NAICS is a six digit code that represents your business at this facility or site."
    );
  }

  get sfGpsDsErrorMessage() {
    return this.sfGpsDsIsError ? this.mergedMessageWhenValueMissing : "";
  }

  get mergedMessageWhenValueMissing() {
    return omniGetMergedField(
      this,
      this._messageWhenValueMissing || "Please select a NAICS code"
    );
  }

  /* Dropdown labels - check custom propSetMap first */

  get sectorLabel() {
    return (
      this._customPropSetMap?.sectorLabel ||
      this._propSetMap?.sectorLabel ||
      "Sector"
    );
  }

  get subSectorLabel() {
    return (
      this._customPropSetMap?.subSectorLabel ||
      this._propSetMap?.subSectorLabel ||
      "Sub sector"
    );
  }

  get industryGroupLabel() {
    return (
      this._customPropSetMap?.industryGroupLabel ||
      this._propSetMap?.industryGroupLabel ||
      "Industry group"
    );
  }

  get industryLabel() {
    return (
      this._customPropSetMap?.industryLabel ||
      this._propSetMap?.industryLabel ||
      "Industry"
    );
  }

  get nationalIndustryLabel() {
    return (
      this._customPropSetMap?.nationalIndustryLabel ||
      this._propSetMap?.nationalIndustryLabel ||
      "National industry"
    );
  }

  /* Options from Custom Properties - check custom propSetMap first */

  get sectorOptions() {
    return this._parseOptionsJson(
      this._customPropSetMap?.sectorOptionsJson ||
        this._propSetMap?.sectorOptionsJson
    );
  }

  get subSectorOptions() {
    return this._parseOptionsJson(
      this._customPropSetMap?.subSectorOptionsJson ||
        this._propSetMap?.subSectorOptionsJson
    );
  }

  get industryGroupOptions() {
    return this._parseOptionsJson(
      this._customPropSetMap?.industryGroupOptionsJson ||
        this._propSetMap?.industryGroupOptionsJson
    );
  }

  get industryOptions() {
    return this._parseOptionsJson(
      this._customPropSetMap?.industryOptionsJson ||
        this._propSetMap?.industryOptionsJson
    );
  }

  get nationalIndustryOptions() {
    return this._parseOptionsJson(
      this._customPropSetMap?.nationalIndustryOptionsJson ||
        this._propSetMap?.nationalIndustryOptionsJson
    );
  }

  /* methods */

  _parseOptionsJson(json) {
    if (!json) return [];
    if (typeof json === "string") {
      try {
        return JSON.parse(json);
      } catch (e) {
        if (DEBUG) console.error(CLASS_NAME, "Error parsing options JSON", e);
        return [];
      }
    }
    return Array.isArray(json) ? json : [];
  }

  /* event handlers */

  handleChange(event) {
    const { value, label } = event.detail;

    if (DEBUG) console.log(CLASS_NAME, "handleChange", value, label);

    // Update the OmniStudio element value with the 6-digit NAICS code
    this.applyCallResp(value, false, false, true);
  }

  handleClear() {
    if (DEBUG) console.log(CLASS_NAME, "handleClear");

    // Clear the OmniStudio element value
    this.applyCallResp("", false, false, true);
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

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this._propSetMap);
  }
}
