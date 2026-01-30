/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import fetchVFDomainURL from "@salesforce/apex/sfGpsDsCaOnSiteSelectorCtr.fetchVFDomainURL";

/**
 * @slot FormSiteSelectorTool
 * @description OmniStudio Site Selector Tool with ESRI map integration.
 * Provides address search and selection within OmniScript flows.
 *
 * ## LWR/LWS Compatibility
 * - Uses OmniscriptBaseMixin for OmniScript integration
 * - ESRI map in Visualforce iframe
 * - postMessage for secure communication
 *
 * ## OmniScript Configuration
 * - Type: Custom LWC
 * - LWC Name: sfGpsDsCaOnFormSiteSelectorTool
 *
 * ## Custom Properties (set in OmniScript Designer)
 * - label: Field label
 * - helpText: Help text below label
 * - buttonLabel: Label for trigger button
 * - modalTitle: Title for modal header
 * - defaultLatitude: Default map center latitude
 * - defaultLongitude: Default map center longitude
 * - required: Whether field is required
 *
 * ## Output Data Structure
 * The component updates OmniScript JSON with flattened address fields:
 * - streetAddress, city, province, postalCode, country, fullAddress
 * - latitude, longitude
 */
export default class SfGpsDsCaOnFormSiteSelectorTool extends OmniscriptBaseMixin(
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

  /** @type {string} VF page URL */
  @track _vfPageUrl = "";

  /** @type {Object} Current address data */
  @track _addressData = null;

  /** @type {boolean} Whether to show validation error */
  @track showValidation = false;

  /* ========================================
   * COMPUTED PROPERTIES - CONFIGURATION
   * For Custom LWC elements, check @api props first, then jsonDef
   * ======================================== */

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

  /**
   * Get label - checks @api prop first, then jsonDef
   * @returns {string}
   */
  get label() {
    return this.configLabel || this._propSetMap?.label || "Site address";
  }

  /**
   * Get help text - checks @api prop first, then jsonDef
   * @returns {string}
   */
  get helpText() {
    return this.configHelpText || this._propSetMap?.helpText || "";
  }

  /**
   * Whether the field is required - checks @api prop first
   * @returns {boolean}
   */
  get isRequired() {
    if (this.configRequired !== undefined) {
      return Boolean(this.configRequired);
    }
    return Boolean(this._propSetMap?.required);
  }

  /**
   * Button label - checks @api prop first, then jsonDef
   * @returns {string}
   */
  get buttonLabel() {
    return (
      this.configButtonLabel ||
      this._customPropSetMap?.buttonLabel ||
      this._propSetMap?.buttonLabel ||
      "Site selector tool"
    );
  }

  /**
   * Modal title - checks @api prop first, then jsonDef
   * @returns {string}
   */
  get modalTitle() {
    return (
      this.configModalTitle ||
      this._customPropSetMap?.modalTitle ||
      this._propSetMap?.modalTitle ||
      "Site"
    );
  }

  /**
   * Default latitude - checks @api prop first, then jsonDef
   * @returns {number}
   */
  get defaultLatitude() {
    return (
      this.configDefaultLatitude ||
      this._customPropSetMap?.defaultLatitude ||
      this._propSetMap?.defaultLatitude ||
      43.6532
    );
  }

  /**
   * Default longitude - checks @api prop first, then jsonDef
   * @returns {number}
   */
  get defaultLongitude() {
    return (
      this.configDefaultLongitude ||
      this._customPropSetMap?.defaultLongitude ||
      this._propSetMap?.defaultLongitude ||
      -79.3832
    );
  }

  /**
   * VF Page URL with domain
   * Checks @api configVfPageUrl first, then uses fetched URL
   * @returns {string}
   */
  get vfPageUrl() {
    // If full URL is provided via @api, use it directly
    if (this.configVfPageUrl) {
      return this.configVfPageUrl;
    }
    // Otherwise construct from fetched VF domain
    if (this._vfPageUrl) {
      return this._vfPageUrl + "/apex/sfGpsDsCaOnSiteSelectorPage";
    }
    return "";
  }

  /* ========================================
   * COMPUTED PROPERTIES - DISPLAY
   * ======================================== */

  /**
   * Whether address has been selected
   * @returns {boolean}
   */
  get hasSelectedAddress() {
    return this._addressData !== null;
  }

  /**
   * Whether address has NOT been selected (for showing selector)
   * @returns {boolean}
   */
  get hasNoSelectedAddress() {
    return this._addressData === null;
  }

  /**
   * Selected address display text
   * @returns {string}
   */
  get selectedAddressText() {
    if (!this._addressData?.address) return "";
    return this._addressData.address.fullAddress || "";
  }

  /* ========================================
   * COMPUTED PROPERTIES - CSS
   * ======================================== */

  /**
   * Label CSS class
   * @returns {string}
   */
  get computedLabelClassName() {
    return computeClass({
      "ontario-label": true,
      "ontario-label--required": this.isRequired
    });
  }

  /**
   * Container CSS class
   * @returns {string}
   */
  get computedContainerClassName() {
    return "sfgpsdscaon-form-site-selector";
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handles save event from site selector tool
   * @param {CustomEvent} event
   */
  handleSave(event) {
    const { address, coordinates } = event.detail;

    // Store locally
    this._addressData = { address, coordinates };

    // Clear validation error when address is selected
    this.showValidation = false;

    // Set elementValue so OmniScript knows the field has a value
    // OmniScript checks this property for required field validation
    this.elementValue = address?.fullAddress;

    // Update OmniScript data with flattened fields
    this.omniUpdateDataJson({
      streetAddress: address?.streetAddress,
      city: address?.city,
      province: address?.province,
      postalCode: address?.postalCode,
      country: address?.country,
      fullAddress: address?.fullAddress,
      latitude: coordinates?.latitude,
      longitude: coordinates?.longitude
    });

    // Force OmniScript to re-validate and clear any cached validation state
    // Use setTimeout to ensure this runs after the current event loop
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      if (typeof this.omniValidate === "function") {
        this.omniValidate(false); // false = don't show error messages
      }
    }, 0);
  }

  /**
   * Handles clear button click
   * @param {Event} event
   */
  handleClear(event) {
    event.preventDefault();
    this._addressData = null;

    // Clear elementValue so OmniScript knows the field is empty
    this.elementValue = null;

    // Clear OmniScript data
    this.omniUpdateDataJson({
      streetAddress: null,
      city: null,
      province: null,
      postalCode: null,
      country: null,
      fullAddress: null,
      latitude: null,
      longitude: null
    });
  }

  /* ========================================
   * LIFECYCLE METHODS
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

      // If we have saved data with address fields, restore the component state
      if (savedData && (savedData.fullAddress || savedData.latitude)) {
        this._addressData = {
          address: {
            streetAddress: savedData.streetAddress || "",
            city: savedData.city || "",
            province: savedData.province || "",
            postalCode: savedData.postalCode || "",
            country: savedData.country || "",
            fullAddress: savedData.fullAddress || ""
          },
          coordinates: {
            latitude: savedData.latitude,
            longitude: savedData.longitude
          }
        };
        // Restore elementValue so OmniScript knows the field has a value
        this.elementValue = savedData.fullAddress || "";
      }
    } catch {
      // Fail silently - state restoration is best-effort
    }
  }

  /**
   * Loads the Visualforce domain URL
   * @private
   */
  async loadVfDomainUrl() {
    try {
      this._vfPageUrl = await fetchVFDomainURL();
    } catch {
      // VF domain URL fetch failed - component will show placeholder
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
    // If required, must have address data with a full address
    return (
      this._addressData !== null &&
      Boolean(this._addressData?.address?.fullAddress)
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
