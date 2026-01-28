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
  @track _vfPageUrl = "";
  @track _coordinateData = null;

  /* ========================================
   * COMPUTED PROPERTIES FROM OMNISCRIPT
   * ======================================== */

  get label() {
    return this._propSetMap?.label || "Discharge point location";
  }

  get helpText() {
    return this._propSetMap?.helpText || "";
  }

  get isRequired() {
    return this._propSetMap?.required || false;
  }

  get buttonLabel() {
    return this._propSetMap?.buttonLabel || "Add discharge point";
  }

  get modalTitle() {
    return this._propSetMap?.modalTitle || "Source";
  }

  get defaultLatitude() {
    return this._propSetMap?.defaultLatitude || 43.6532;
  }

  get defaultLongitude() {
    return this._propSetMap?.defaultLongitude || -79.3832;
  }

  get vfPageUrl() {
    return this._vfPageUrl || this._propSetMap?.vfPageUrl || "";
  }

  get _propSetMap() {
    return this.omniJsonDef?.propSetMap || {};
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

    // Update OmniScript data
    this.omniUpdateDataJson({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      utmZone: coordinates.utmZone || null,
      utmEast: coordinates.utmEast || null,
      utmNorth: coordinates.utmNorth || null
    });
  }

  handleClear(event) {
    event.preventDefault();
    event.stopPropagation();

    this._coordinateData = null;

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

  connectedCallback() {
    this.classList.add("caon-scope");
    this.loadVfDomainUrl();

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this._propSetMap);
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
}
