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
  decorateOptions,
  filterByParentValue
} from "c/sfGpsDsCaOnFormUtils";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnNaicsCodePickerOmni";

/**
 * NAICS Code Picker for OmniStudio Custom LWC
 * Uses OmniscriptBaseMixin for proper OmniScript data integration.
 *
 * OmniScript Integration:
 * - Set fieldName property to specify where value is stored in omniJsonData
 * - Uses omniUpdateDataJson() to update OmniScript data
 * - Supports both single field (NAICS code only) and full object output
 */
export default class SfGpsDsCaOnNaicsCodePickerOmni extends OmniscriptBaseMixin(
  LightningElement
) {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api label = "Select NAICS Code";
  @api helpText = "";
  @api required = false;
  @api disabled = false;

  @api optional = false;
  @api errorMessage;

  // OmniScript integration - field names for each level
  /** Field name for storing the selected NAICS code (national industry) */
  @api fieldName = "naicsCode";

  /** Field name for Sector selection */
  @api sectorFieldName = "";

  /** Field name for Sub Sector selection */
  @api subSectorFieldName = "";

  /** Field name for Industry Group selection */
  @api industryGroupFieldName = "";

  /** Field name for Industry selection */
  @api industryFieldName = "";

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
   * Uses omniUpdateDataJson() from OmniscriptBaseMixin for proper integration.
   * Stores each level in its own field if field names are configured.
   */
  _updateOmniScriptData() {
    // Build data object with all configured fields
    const dataUpdate = {};

    // Always store the main NAICS code (national industry) if fieldName is set
    if (this.fieldName) {
      dataUpdate[this.fieldName] = this._nationalIndustry || "";
    }

    // Store each level in its own field if configured
    if (this.sectorFieldName) {
      dataUpdate[this.sectorFieldName] = this._sector || "";
    }

    if (this.subSectorFieldName) {
      dataUpdate[this.subSectorFieldName] = this._subSector || "";
    }

    if (this.industryGroupFieldName) {
      dataUpdate[this.industryGroupFieldName] = this._industryGroup || "";
    }

    if (this.industryFieldName) {
      dataUpdate[this.industryFieldName] = this._industry || "";
    }

    // Only update if we have at least one field configured
    if (Object.keys(dataUpdate).length === 0) {
      if (DEBUG)
        console.log(
          CLASS_NAME,
          "_updateOmniScriptData: no field names configured, skipping"
        );
      return;
    }

    if (DEBUG) {
      console.log(CLASS_NAME, "_updateOmniScriptData", dataUpdate);
    }

    // Use OmniscriptBaseMixin method to update OmniScript data
    this.omniUpdateDataJson(dataUpdate);
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
