/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, track } from "lwc";
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
   * PRIVATE PROPERTIES
   * ======================================== */

  /** @type {string} VF page URL */
  @track _vfPageUrl = "";

  /** @type {Object} Current address data */
  @track _addressData = null;

  /* ========================================
   * COMPUTED PROPERTIES - CONFIGURATION
   * ======================================== */

  /**
   * Get label from OmniScript properties
   * @returns {string}
   */
  get label() {
    return this.omniJsonDef?.propSetMap?.label || "Site address";
  }

  /**
   * Get help text from OmniScript properties
   * @returns {string}
   */
  get helpText() {
    return this.omniJsonDef?.propSetMap?.helpText || "";
  }

  /**
   * Whether the field is required
   * @returns {boolean}
   */
  get isRequired() {
    return Boolean(this.omniJsonDef?.propSetMap?.required);
  }

  /**
   * Button label from properties
   * @returns {string}
   */
  get buttonLabel() {
    return this.omniJsonDef?.propSetMap?.buttonLabel || "Site selector tool";
  }

  /**
   * Modal title from properties
   * @returns {string}
   */
  get modalTitle() {
    return this.omniJsonDef?.propSetMap?.modalTitle || "Site";
  }

  /**
   * Default latitude from properties
   * @returns {number}
   */
  get defaultLatitude() {
    return this.omniJsonDef?.propSetMap?.defaultLatitude || 43.6532;
  }

  /**
   * Default longitude from properties
   * @returns {number}
   */
  get defaultLongitude() {
    return this.omniJsonDef?.propSetMap?.defaultLongitude || -79.3832;
  }

  /**
   * VF Page URL with domain
   * @returns {string}
   */
  get vfPageUrl() {
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
  }

  /**
   * Handles clear button click
   * @param {Event} event
   */
  handleClear(event) {
    event.preventDefault();
    this._addressData = null;

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
    // Fetch VF domain URL
    this.loadVfDomainUrl();
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
   * @api
   */
  checkValidity() {
    // If not required, always valid
    if (!this.isRequired) {
      return true;
    }
    // If required, must have address data
    return (
      this._addressData !== null &&
      Boolean(this._addressData?.address?.fullAddress)
    );
  }

  /**
   * Reports validity and shows validation messages.
   * Required for OmniScript step validation.
   * @returns {boolean} True if valid
   * @api
   */
  reportValidity() {
    const isValid = this.checkValidity();
    this.showValidation = !isValid;
    return isValid;
  }

  /**
   * Sets a custom validity message.
   * @param {string} message - Custom error message
   * @api
   */
  setCustomValidity(message) {
    this._customValidityMessage = message;
    this.showValidation = Boolean(message);
  }
}
