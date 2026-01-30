/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import fetchVFDomainURL from "@salesforce/apex/sfGpsDsCaOnSiteSelectorCtr.fetchVFDomainURL";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormDischargePointSelector";

/**
 * OmniStudio Discharge Point Selector Wrapper
 *
 * Integrates the Discharge Point Selector component into OmniScripts.
 * Maps coordinate data to OmniScript fields.
 *
 * Compliance:
 * - LWR/LWS: Compatible (uses same patterns as Site Selector)
 * - OmniStudio: Extends OmniscriptBaseMixin
 */
export default class SfGpsDsCaOnFormDischargePointSelector extends OmniscriptBaseMixin(
  LightningElement
) {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * For Custom LWC elements, OmniStudio passes config via @api properties
   * ======================================== */

  /** @type {string} Field label - passed from OmniScript */
  @api configLabel;

  /** @type {string} Help text - passed from OmniScript */
  @api configHelpText;

  /** @type {boolean} Whether field is required - passed from OmniScript */
  @api configRequired;

  /** @type {string} Button label - passed from OmniScript */
  @api configButtonLabel;

  /** @type {string} Modal title - passed from OmniScript */
  @api configModalTitle;

  /** @type {number} Default latitude - passed from OmniScript */
  @api configDefaultLatitude;

  /** @type {number} Default longitude - passed from OmniScript */
  @api configDefaultLongitude;

  /** @type {string} VF page URL path - passed from OmniScript */
  @api configVfPageUrl;

  /* ========================================
   * PRIVATE PROPERTIES
   * ======================================== */

  @track _vfPageUrl = "";
  @track _coordinateData = null;

  /* ========================================
   * COMPUTED PROPERTIES - CONFIGURATION
   * Checks @api props first, then jsonDef
   * ======================================== */

  get label() {
    return (
      this.configLabel || this._propSetMap?.label || "Discharge point location"
    );
  }

  get helpText() {
    return this.configHelpText || this._propSetMap?.helpText || "";
  }

  get isRequired() {
    if (this.configRequired !== undefined) {
      return Boolean(this.configRequired);
    }
    return Boolean(this._propSetMap?.required);
  }

  get buttonLabel() {
    return (
      this.configButtonLabel ||
      this._customPropSetMap?.buttonLabel ||
      this._propSetMap?.buttonLabel ||
      "Add discharge point"
    );
  }

  get modalTitle() {
    return (
      this.configModalTitle ||
      this._customPropSetMap?.modalTitle ||
      this._propSetMap?.modalTitle ||
      "Source"
    );
  }

  get defaultLatitude() {
    return (
      this.configDefaultLatitude ||
      this._customPropSetMap?.defaultLatitude ||
      this._propSetMap?.defaultLatitude ||
      43.6532
    );
  }

  get defaultLongitude() {
    return (
      this.configDefaultLongitude ||
      this._customPropSetMap?.defaultLongitude ||
      this._propSetMap?.defaultLongitude ||
      -79.3832
    );
  }

  get vfPageUrl() {
    // If full URL is provided via @api, use it directly
    if (this.configVfPageUrl) {
      return this.configVfPageUrl;
    }
    // Otherwise use fetched or configured URL
    return (
      this._vfPageUrl ||
      this._customPropSetMap?.vfPageUrl ||
      this._propSetMap?.vfPageUrl ||
      ""
    );
  }

  /**
   * Access standard OmniStudio properties from jsonDef.propSetMap
   * @returns {Object}
   */
  get _propSetMap() {
    return this.jsonDef?.propSetMap || {};
  }

  /**
   * Access custom properties added via JSON Editor.
   * OmniStudio nests custom propSetMap inside the standard propSetMap.
   * Path: jsonDef.propSetMap.propSetMap.customProperty
   * @returns {Object}
   */
  get _customPropSetMap() {
    return this.jsonDef?.propSetMap?.propSetMap || {};
  }

  /* ========================================
   * STATE COMPUTED PROPERTIES
   * ======================================== */

  get hasSelectedCoordinates() {
    return this._coordinateData !== null;
  }

  get hasNoSelectedCoordinates() {
    return this._coordinateData === null;
  }

  get selectedCoordinatesText() {
    if (!this._coordinateData) return "";
    const lat = this._coordinateData.latitude?.toFixed(6) || "";
    const lng = this._coordinateData.longitude?.toFixed(6) || "";
    return `${lat}, ${lng}`;
  }

  get computedLabelClassName() {
    return computeClass({
      "ontario-label": true,
      "ontario-label--required": this.isRequired
    });
  }

  get computedContainerClassName() {
    return computeClass({
      "sfgpsdscaon-form-discharge-selector": true,
      "sfgpsdscaon-form-discharge-selector--has-value":
        this.hasSelectedCoordinates
    });
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleContinue(event) {
    const { coordinates } = event.detail;

    if (DEBUG) console.log(CLASS_NAME, "handleContinue", coordinates);

    this._coordinateData = coordinates;

    // Set elementValue so OmniScript knows the field has a value
    // OmniScript checks this property for required field validation
    this.elementValue = `${coordinates.latitude}, ${coordinates.longitude}`;

    // Update OmniScript data
    this.omniUpdateDataJson({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      utmZone: coordinates.utmZone || null,
      utmEast: coordinates.utmEast || null,
      utmNorth: coordinates.utmNorth || null
    });

    // Force OmniScript to re-validate and clear any cached validation state
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      if (typeof this.omniValidate === "function") {
        this.omniValidate(false);
      }
    }, 0);
  }

  handleClear(event) {
    event.preventDefault();
    event.stopPropagation();

    this._coordinateData = null;

    // Clear elementValue so OmniScript knows the field is empty
    this.elementValue = null;

    // Clear OmniScript data
    this.omniUpdateDataJson({
      latitude: null,
      longitude: null,
      utmZone: null,
      utmEast: null,
      utmNorth: null
    });
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  /**
   * Component connected to DOM.
   * Restores saved state from OmniScript JSON data.
   */
  connectedCallback() {
    this.classList.add("caon-scope");
    // Add data-omni-input to the HOST element so OmniScript can find and validate it
    // This ensures OmniScript calls our @api checkValidity() directly
    this.setAttribute("data-omni-input", "");
    // Fetch VF domain URL (if not provided via @api)
    if (!this.configVfPageUrl) {
      this.loadVfDomainUrl();
    }
    // Restore saved state from OmniScript JSON
    this.restoreSavedState();

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this._propSetMap);
  }

  /**
   * Restores component state from OmniScript JSON data.
   * Called on connectedCallback to handle "Previous" button navigation.
   * @private
   */
  restoreSavedState() {
    try {
      // Get the saved data from OmniScript JSON using the element's path
      const jsonPath = this.omniJsonDef?.JSONPath;
      if (!jsonPath || !this.omniJsonData) return;

      // Parse the JSON path to get the saved value
      const pathParts = jsonPath.split(":");
      let savedData = this.omniJsonData;

      for (const part of pathParts) {
        if (savedData && typeof savedData === "object") {
          savedData = savedData[part];
        } else {
          savedData = null;
          break;
        }
      }

      // If we have saved data with coordinate fields, restore the component state
      if (
        savedData &&
        (savedData.latitude != null || savedData.longitude != null)
      ) {
        this._coordinateData = {
          latitude: savedData.latitude,
          longitude: savedData.longitude,
          utmZone: savedData.utmZone || null,
          utmEast: savedData.utmEast || null,
          utmNorth: savedData.utmNorth || null
        };
        // Restore elementValue so OmniScript knows the field has a value
        this.elementValue = `${savedData.latitude}, ${savedData.longitude}`;

        if (DEBUG)
          console.log(CLASS_NAME, "restoreSavedState", this._coordinateData);
      }
    } catch (e) {
      if (DEBUG) console.error(CLASS_NAME, "restoreSavedState error", e);
      // Fail silently - state restoration is best-effort
    }
  }

  async loadVfDomainUrl() {
    try {
      const domain = await fetchVFDomainURL();
      if (domain) {
        this._vfPageUrl = `${domain}/apex/sfGpsDsCaOnSiteSelectorPage`;
      }
    } catch (e) {
      if (DEBUG) console.error(CLASS_NAME, "loadVfDomainUrl error", e);
    }
  }

  /* ========================================
   * VALIDATION METHODS - OmniScript Integration
   * ======================================== */

  /**
   * Checks if the component is valid.
   * Required for OmniScript "Next" button validation.
   * @returns {boolean} True if valid (not required OR has value)
   */
  @api
  checkValidity() {
    // If not required, always valid
    if (!this.isRequired) {
      return true;
    }
    // If required, must have coordinate data
    return (
      this._coordinateData !== null &&
      this._coordinateData.latitude != null &&
      this._coordinateData.longitude != null
    );
  }

  /**
   * Reports validity and shows validation messages.
   * Required for OmniScript step validation.
   * @returns {boolean} True if valid
   */
  @api
  reportValidity() {
    const isValid = this.checkValidity();
    this.showValidation = !isValid;
    return isValid;
  }

  /**
   * Sets a custom validity message.
   * @param {string} message - Custom error message
   */
  @api
  setCustomValidity(message) {
    this._customValidityMessage = message;
    this.showValidation = Boolean(message);
  }
}
