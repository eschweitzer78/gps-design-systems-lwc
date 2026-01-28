/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnCoordinateInput";

/**
 * Ontario Design System - Coordinate Input Component
 *
 * A reusable component for entering geographic coordinates in multiple formats:
 * - UTM (Zone, East, North)
 * - Latitude/Longitude (Degrees, Minutes, Seconds)
 * - Latitude/Longitude (Decimal Degrees)
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Uses Ontario form input patterns
 * - WCAG 2.1 AA: Proper labeling, keyboard accessible
 */
export default class SfGpsDsCaOnCoordinateInput extends LightningElement {
  static renderMode = "light";

  /* ========================================
   * PUBLIC PROPERTIES
   * ======================================== */

  /**
   * Coordinate format: 'utm', 'dms', 'decimal'
   */
  @api
  get format() {
    return this._format;
  }
  set format(val) {
    this._format = val || "dms";
    this._resetValues();
  }
  _format = "dms";

  /**
   * Whether the input is required
   */
  @api required = false;

  /**
   * Whether the input is disabled
   */
  @api disabled = false;

  /**
   * Custom CSS class
   */
  @api className;

  /**
   * Error message to display
   */
  @api errorMessage;

  /**
   * Get the current coordinate values
   */
  @api
  getValue() {
    return this._getCoordinateValue();
  }

  /**
   * Set coordinate values programmatically
   */
  @api
  setValue(value) {
    if (!value) {
      this._resetValues();
      return;
    }

    if (this._format === "utm") {
      this._utmZone = value.zone || "";
      this._utmEast = value.east || "";
      this._utmNorth = value.north || "";
    } else if (this._format === "dms") {
      this._latDegrees = value.latDegrees || "";
      this._latMinutes = value.latMinutes || "";
      this._latSeconds = value.latSeconds || "";
      this._lngDegrees = value.lngDegrees || "";
      this._lngMinutes = value.lngMinutes || "";
      this._lngSeconds = value.lngSeconds || "";
    } else if (this._format === "decimal") {
      this._decimalLat = value.latitude || "";
      this._decimalLng = value.longitude || "";
    }
  }

  /**
   * Validate the input
   */
  @api
  validate() {
    const value = this._getCoordinateValue();
    const errors = [];

    if (this._format === "utm") {
      if (this.required && (!value.zone || !value.east || !value.north)) {
        errors.push("All UTM fields are required");
      }
      if (
        value.zone &&
        (isNaN(value.zone) || value.zone < 1 || value.zone > 60)
      ) {
        errors.push("UTM Zone must be between 1 and 60");
      }
    } else if (this._format === "dms") {
      if (this.required) {
        if (!value.latDegrees || !value.lngDegrees) {
          errors.push("Latitude and Longitude degrees are required");
        }
      }
      if (
        value.latDegrees &&
        (value.latDegrees < -90 || value.latDegrees > 90)
      ) {
        errors.push("Latitude degrees must be between -90 and 90");
      }
      if (
        value.lngDegrees &&
        (value.lngDegrees < -180 || value.lngDegrees > 180)
      ) {
        errors.push("Longitude degrees must be between -180 and 180");
      }
    } else if (this._format === "decimal") {
      if (this.required && (!value.latitude || !value.longitude)) {
        errors.push("Latitude and Longitude are required");
      }
      if (value.latitude && (value.latitude < -90 || value.latitude > 90)) {
        errors.push("Latitude must be between -90 and 90");
      }
      if (
        value.longitude &&
        (value.longitude < -180 || value.longitude > 180)
      ) {
        errors.push("Longitude must be between -180 and 180");
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Convert current coordinates to decimal format
   */
  @api
  toDecimal() {
    const value = this._getCoordinateValue();

    if (this._format === "decimal") {
      return {
        latitude: parseFloat(value.latitude) || null,
        longitude: parseFloat(value.longitude) || null
      };
    }

    if (this._format === "dms") {
      const lat = this._dmsToDecimal(
        parseFloat(value.latDegrees) || 0,
        parseFloat(value.latMinutes) || 0,
        parseFloat(value.latSeconds) || 0
      );
      const lng = this._dmsToDecimal(
        parseFloat(value.lngDegrees) || 0,
        parseFloat(value.lngMinutes) || 0,
        parseFloat(value.lngSeconds) || 0
      );
      return { latitude: lat, longitude: lng };
    }

    if (this._format === "utm") {
      // UTM to decimal conversion requires external library or server-side processing
      // Return raw UTM values for now - conversion should happen server-side
      return {
        utmZone: parseInt(value.zone, 10) || null,
        utmEast: parseFloat(value.east) || null,
        utmNorth: parseFloat(value.north) || null,
        requiresConversion: true
      };
    }

    return null;
  }

  /* ========================================
   * PRIVATE PROPERTIES
   * ======================================== */

  // UTM fields
  @track _utmZone = "";
  @track _utmEast = "";
  @track _utmNorth = "";

  // DMS fields
  @track _latDegrees = "";
  @track _latMinutes = "";
  @track _latSeconds = "";
  @track _lngDegrees = "";
  @track _lngMinutes = "";
  @track _lngSeconds = "";

  // Decimal fields
  @track _decimalLat = "";
  @track _decimalLng = "";

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get computedContainerClassName() {
    return computeClass({
      "sfgpsdscaon-coordinate-input": true,
      "sfgpsdscaon-coordinate-input--error": Boolean(this.errorMessage),
      [this.className]: this.className
    });
  }

  get isUtmFormat() {
    return this._format === "utm";
  }

  get isDmsFormat() {
    return this._format === "dms";
  }

  get isDecimalFormat() {
    return this._format === "decimal";
  }

  get hasError() {
    return Boolean(this.errorMessage);
  }

  get latitudeHint() {
    return "For example: 50° 04' 23.82\"";
  }

  get longitudeHint() {
    return "For example: -85° 49' 49.64\"";
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  _resetValues() {
    this._utmZone = "";
    this._utmEast = "";
    this._utmNorth = "";
    this._latDegrees = "";
    this._latMinutes = "";
    this._latSeconds = "";
    this._lngDegrees = "";
    this._lngMinutes = "";
    this._lngSeconds = "";
    this._decimalLat = "";
    this._decimalLng = "";
  }

  _getCoordinateValue() {
    if (this._format === "utm") {
      return {
        zone: this._utmZone,
        east: this._utmEast,
        north: this._utmNorth
      };
    }

    if (this._format === "dms") {
      return {
        latDegrees: this._latDegrees,
        latMinutes: this._latMinutes,
        latSeconds: this._latSeconds,
        lngDegrees: this._lngDegrees,
        lngMinutes: this._lngMinutes,
        lngSeconds: this._lngSeconds
      };
    }

    if (this._format === "decimal") {
      return {
        latitude: this._decimalLat,
        longitude: this._decimalLng
      };
    }

    return null;
  }

  _dmsToDecimal(degrees, minutes, seconds) {
    const sign = degrees < 0 ? -1 : 1;
    return sign * (Math.abs(degrees) + minutes / 60 + seconds / 3600);
  }

  _dispatchChangeEvent() {
    const value = this._getCoordinateValue();
    const decimal = this.toDecimal();

    if (DEBUG) console.log(CLASS_NAME, "dispatchChangeEvent", value, decimal);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value: value,
          decimal: decimal,
          format: this._format
        },
        bubbles: true,
        composed: true
      })
    );
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  // UTM handlers
  handleUtmZoneChange(event) {
    this._utmZone = event.target.value;
    this._dispatchChangeEvent();
  }

  handleUtmEastChange(event) {
    this._utmEast = event.target.value;
    this._dispatchChangeEvent();
  }

  handleUtmNorthChange(event) {
    this._utmNorth = event.target.value;
    this._dispatchChangeEvent();
  }

  // DMS handlers
  handleLatDegreesChange(event) {
    this._latDegrees = event.target.value;
    this._dispatchChangeEvent();
  }

  handleLatMinutesChange(event) {
    this._latMinutes = event.target.value;
    this._dispatchChangeEvent();
  }

  handleLatSecondsChange(event) {
    this._latSeconds = event.target.value;
    this._dispatchChangeEvent();
  }

  handleLngDegreesChange(event) {
    this._lngDegrees = event.target.value;
    this._dispatchChangeEvent();
  }

  handleLngMinutesChange(event) {
    this._lngMinutes = event.target.value;
    this._dispatchChangeEvent();
  }

  handleLngSecondsChange(event) {
    this._lngSeconds = event.target.value;
    this._dispatchChangeEvent();
  }

  // Decimal handlers
  handleDecimalLatChange(event) {
    this._decimalLat = event.target.value;
    this._dispatchChangeEvent();
  }

  handleDecimalLngChange(event) {
    this._decimalLng = event.target.value;
    this._dispatchChangeEvent();
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    this.classList.add("caon-scope");

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this._format);
  }
}
