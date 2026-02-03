/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import {
  parseOptionsJson,
  decorateOptions,
  filterByParentValue
} from "c/sfGpsDsCaOnFormUtils";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnNaicsCodePickerOmni";

/**
 * NAICS Code Picker for OmniStudio Custom LWC
 * Simplified version without Light DOM for OmniStudio compatibility
 *
 * OmniScript Integration:
 * - Set fieldName property to specify where value is stored in omniJsonData
 * - Component dispatches 'omniupdatedata' event to update OmniScript data
 * - Supports both single field (NAICS code only) and full object output
 */
export default class SfGpsDsCaOnNaicsCodePickerOmni extends LightningElement {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api label = "Select NAICS Code";
  @api helpText = "";
  @api required = false;
  @api disabled = false;

  @api optional = false;
  @api errorMessage;

  // OmniScript integration
  /** Field name for storing the selected NAICS code in omniJsonData */
  @api fieldName = "naicsCode";

  /** If true, stores full object with all levels; if false, stores just the code */
  @api storeFullObject = false;

  @api sectorLabel = "Sector";
  @api subSectorLabel = "Sub sector";
  @api industryGroupLabel = "Industry group";
  @api industryLabel = "Industry";
  @api nationalIndustryLabel = "National industry";

  @api sectorOptionsJson;
  @api subSectorOptionsJson;
  @api industryGroupOptionsJson;
  @api industryOptionsJson;
  @api nationalIndustryOptionsJson;

  /* ========================================
   * PRIVATE STATE
   * ======================================== */

  @track _sector = "";
  @track _subSector = "";
  @track _industryGroup = "";
  @track _industry = "";
  @track _nationalIndustry = "";

  _sectorOptions = [];
  _subSectorOptions = [];
  _industryGroupOptions = [];
  _industryOptions = [];
  _nationalIndustryOptions = [];

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    if (DEBUG) {
      console.log(CLASS_NAME, "connectedCallback", {
        label: this.label,
        sectorOptionsJson: this.sectorOptionsJson?.substring(0, 50)
      });
    }

    // Parse options using shared utility
    this._sectorOptions = parseOptionsJson(this.sectorOptionsJson);
    this._subSectorOptions = parseOptionsJson(this.subSectorOptionsJson);
    this._industryGroupOptions = parseOptionsJson(
      this.industryGroupOptionsJson
    );
    this._industryOptions = parseOptionsJson(this.industryOptionsJson);
    this._nationalIndustryOptions = parseOptionsJson(
      this.nationalIndustryOptionsJson
    );

    if (DEBUG) {
      console.log(CLASS_NAME, "parsed options", {
        sectors: this._sectorOptions.length,
        subSectors: this._subSectorOptions.length
      });
    }
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get sectorOptions() {
    return this._sectorOptions;
  }

  get sectorOptionsWithSelected() {
    return decorateOptions(this._sectorOptions, this._sector);
  }

  get subSectorOptions() {
    return filterByParentValue(this._subSectorOptions, this._sector);
  }

  get subSectorOptionsWithSelected() {
    return decorateOptions(this.subSectorOptions, this._subSector);
  }

  get industryGroupOptions() {
    return filterByParentValue(this._industryGroupOptions, this._subSector);
  }

  get industryGroupOptionsWithSelected() {
    return decorateOptions(this.industryGroupOptions, this._industryGroup);
  }

  get industryOptions() {
    return filterByParentValue(this._industryOptions, this._industryGroup);
  }

  get industryOptionsWithSelected() {
    return decorateOptions(this.industryOptions, this._industry);
  }

  get nationalIndustryOptions() {
    return filterByParentValue(this._nationalIndustryOptions, this._industry);
  }

  get nationalIndustryOptionsWithSelected() {
    return decorateOptions(
      this.nationalIndustryOptions,
      this._nationalIndustry
    );
  }

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

  get value() {
    return this._nationalIndustry;
  }

  get hasValue() {
    return Boolean(this._nationalIndustry);
  }

  get hasError() {
    return Boolean(this.errorMessage);
  }

  /* ========================================
   * PRIVATE METHODS (using shared utilities)
   * ======================================== */

  _dispatchChange() {
    const detail = {
      value: this._nationalIndustry,
      sector: this._sector,
      subSector: this._subSector,
      industryGroup: this._industryGroup,
      industry: this._industry
    };

    if (DEBUG) console.log(CLASS_NAME, "dispatchChange", detail);

    // Dispatch standard change event
    this.dispatchEvent(
      new CustomEvent("change", {
        detail,
        bubbles: true,
        composed: true
      })
    );

    // Dispatch OmniScript data update event
    this._updateOmniScriptData(detail);
  }

  /**
   * Updates OmniScript JSON data with the current selection.
   * Uses the omniupdatedata event that OmniScript listens for.
   * @param {Object} detail - The selection details
   */
  _updateOmniScriptData() {
    if (!this.fieldName) {
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "_updateOmniScriptData: no fieldName, skipping"
        );
      return;
    }

    // Determine what value to store
    let dataValue;
    if (this.storeFullObject) {
      // Store full object with all levels
      dataValue = {
        naicsCode: this._nationalIndustry,
        sector: this._sector,
        subSector: this._subSector,
        industryGroup: this._industryGroup,
        industry: this._industry,
        nationalIndustry: this._nationalIndustry
      };
    } else {
      // Store just the NAICS code
      dataValue = this._nationalIndustry || "";
    }

    if (DEBUG) {
      console.log(CLASS_NAME, "_updateOmniScriptData", {
        fieldName: this.fieldName,
        value: dataValue
      });
    }

    // Dispatch omniupdatedata event for OmniScript integration
    // This event format is recognized by OmniScript runtime
    this.dispatchEvent(
      new CustomEvent("omniupdatedata", {
        detail: {
          [this.fieldName]: dataValue
        },
        bubbles: true,
        composed: true
      })
    );

    // Also dispatch omnivaluechange for additional integration patterns
    this.dispatchEvent(
      new CustomEvent("omnivaluechange", {
        detail: {
          name: this.fieldName,
          value: dataValue
        },
        bubbles: true,
        composed: true
      })
    );
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleSectorChange(event) {
    this._sector = event.target.value;
    this._subSector = "";
    this._industryGroup = "";
    this._industry = "";
    this._nationalIndustry = "";
    this._dispatchChange();
  }

  handleSubSectorChange(event) {
    this._subSector = event.target.value;
    this._industryGroup = "";
    this._industry = "";
    this._nationalIndustry = "";
    this._dispatchChange();
  }

  handleIndustryGroupChange(event) {
    this._industryGroup = event.target.value;
    this._industry = "";
    this._nationalIndustry = "";
    this._dispatchChange();
  }

  handleIndustryChange(event) {
    this._industry = event.target.value;
    this._nationalIndustry = "";
    this._dispatchChange();
  }

  handleNationalIndustryChange(event) {
    this._nationalIndustry = event.target.value;
    this._dispatchChange();
  }
}
