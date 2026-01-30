/*
 * Copyright (c) 2026, Shannon Schupbach and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import { formatUserError, getMessage } from "c/sfGpsDsCaOnUserMessages";
import { LABELS } from "c/sfGpsDsCaOnLabels";
import { MapSelectorMixin } from "c/sfGpsDsCaOnMapSelectorMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnDischargePointSelector";

/**
 * Ontario Design System - Discharge Point Selector Component
 *
 * A modal-based component for selecting discharge point locations using
 * coordinate entry (UTM, DMS, Decimal) or map interaction.
 *
 * ## Features
 * - Coordinate input in multiple formats (UTM, DMS, Decimal Degrees)
 * - Interactive ESRI map with point placement
 * - Drop point mode for manual pin placement
 * - Layer control for environmental zones
 * - Returns structured coordinate and location data
 *
 * ## LWR/LWS Compatibility
 * - Uses Light DOM for Experience Cloud
 * - No eval() or dynamic code execution
 * - ESRI map runs in Visualforce iframe
 * - postMessage for secure cross-origin communication
 *
 * ## Architecture
 * - Extends MapSelectorMixin for shared modal/map functionality
 * - Main component contains modal and two-panel layout
 * - Left panel: coordinate/address input controls
 * - Right panel: ESRI map in Visualforce iframe
 */
export default class SfGpsDsCaOnDischargePointSelector extends MapSelectorMixin(
  LightningElement
) {
  static renderMode = "light";

  /* ========================================
   * PUBLIC PROPERTIES
   * ======================================== */

  /**
   * Button label to open the selector
   */
  @api buttonLabel = "Add discharge point";

  /**
   * Button icon name
   */
  @api buttonIcon = "location";

  /**
   * Modal title
   */
  @api modalTitle = "Source";

  /**
   * Default latitude for map center
   */
  @api defaultLatitude = 43.6532; // Toronto

  /**
   * Default longitude for map center
   */
  @api defaultLongitude = -79.3832; // Toronto

  /**
   * Visualforce page URL for the ESRI map
   */
  @api vfPageUrl;

  /**
   * Custom CSS class
   */
  @api className;

  /**
   * Search method options
   */
  @api
  get searchMethodOptions() {
    return this._searchMethodOptions;
  }
  set searchMethodOptions(val) {
    try {
      this._searchMethodOptions =
        typeof val === "string" ? JSON.parse(val) : val || [];
    } catch {
      this._searchMethodOptions = [];
    }
  }
  _searchMethodOptions = [
    { value: "coordinates", label: "Coordinates (latitude/longitude or UTM)" },
    { value: "address", label: "Address" }
  ];

  /**
   * Coordinate format options
   */
  @api
  get coordinateFormatOptions() {
    return this._coordinateFormatOptions;
  }
  set coordinateFormatOptions(val) {
    try {
      this._coordinateFormatOptions =
        typeof val === "string" ? JSON.parse(val) : val || [];
    } catch {
      this._coordinateFormatOptions = [];
    }
  }
  _coordinateFormatOptions = [
    { value: "utm", label: "UTM" },
    { value: "dms", label: "Latitude/Longitude (degree, minutes, seconds)" },
    { value: "decimal", label: "Latitude/Longitude (decimal degrees)" }
  ];

  /* ========================================
   * PRIVATE PROPERTIES (Component-specific)
   * ======================================== */

  @track _searchMethod = "coordinates";
  @track _coordinateFormat = "dms";
  @track _addressSearchValue = "";
  @track _coordinates = null;
  @track _pointPlaced = false;

  /* ========================================
   * MIXIN CONFIGURATION OVERRIDES
   * ======================================== */

  /**
   * Tab order for keyboard navigation
   * @returns {string[]}
   */
  get tabOrder() {
    return ["search", "droppoint", "layers"];
  }

  /**
   * CSS selector for the map iframe
   * @returns {string}
   */
  get iframeSelector() {
    return ".sfgpsdscaon-discharge-selector__map-iframe";
  }

  /**
   * Debug mode flag
   * @returns {boolean}
   */
  get debugMode() {
    return DEBUG;
  }

  /**
   * Component name for debug logging
   * @returns {string}
   */
  get componentName() {
    return CLASS_NAME;
  }

  /**
   * Gets the map mode for a given tab.
   * Maps "droppoint" tab to "sitepoint" mode for the map.
   * @param {string} tabId - Tab identifier
   * @returns {string} Map mode
   * @protected
   */
  _getMapModeForTab(tabId) {
    return tabId === "droppoint" ? "sitepoint" : tabId;
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get computedContainerClassName() {
    return computeClass({
      "sfgpsdscaon-discharge-selector": true,
      [this.className]: this.className
    });
  }

  get isSearchTabActive() {
    return this._activeTab === "search";
  }

  get isDropPointTabActive() {
    return this._activeTab === "droppoint";
  }

  get isLayersTabActive() {
    return this._activeTab === "layers";
  }

  get searchTabClassName() {
    return computeClass({
      "sfgpsdscaon-discharge-selector__tab": true,
      "sfgpsdscaon-discharge-selector__tab--active": this.isSearchTabActive
    });
  }

  get dropPointTabClassName() {
    return computeClass({
      "sfgpsdscaon-discharge-selector__tab": true,
      "sfgpsdscaon-discharge-selector__tab--active": this.isDropPointTabActive
    });
  }

  get layersTabClassName() {
    return computeClass({
      "sfgpsdscaon-discharge-selector__tab": true,
      "sfgpsdscaon-discharge-selector__tab--active": this.isLayersTabActive
    });
  }

  /**
   * Tabindex for Search tab (roving tabindex pattern)
   * @returns {string}
   */
  get searchTabTabIndex() {
    return this.isSearchTabActive ? "0" : "-1";
  }

  /**
   * Tabindex for Drop Point tab (roving tabindex pattern)
   * @returns {string}
   */
  get dropPointTabTabIndex() {
    return this.isDropPointTabActive ? "0" : "-1";
  }

  /**
   * Tabindex for Layers tab (roving tabindex pattern)
   * @returns {string}
   */
  get layersTabTabIndex() {
    return this.isLayersTabActive ? "0" : "-1";
  }

  /**
   * Screen reader announcement text for coordinate updates
   * @returns {string}
   */
  get coordinateAnnouncementText() {
    if (!this._coordinates) return "";
    return `Coordinates selected: ${this.coordinateDisplayText}`;
  }

  get isCoordinatesMethod() {
    return this._searchMethod === "coordinates";
  }

  get isAddressMethod() {
    return this._searchMethod === "address";
  }

  get hasCoordinates() {
    return this._coordinates !== null;
  }

  get hasNoCoordinates() {
    return this._coordinates === null;
  }

  get isContinueDisabled() {
    return !this._pointPlaced;
  }

  get computedVfPageUrl() {
    if (!this.vfPageUrl) return "";
    const separator = this.vfPageUrl.includes("?") ? "&" : "?";
    return `${this.vfPageUrl}${separator}lat=${this.defaultLatitude}&lng=${this.defaultLongitude}&mode=discharge`;
  }

  get hasVfPageUrl() {
    return Boolean(this.computedVfPageUrl);
  }

  get hasNoVfPageUrl() {
    return !this.computedVfPageUrl;
  }

  /* ========================================
   * I18N LABEL GETTERS
   * ======================================== */

  /** @returns {string} Search button label */
  get labelSearch() {
    return LABELS.Common.Search;
  }

  /** @returns {string} Continue button label */
  get labelContinue() {
    return LABELS.Common.Continue;
  }

  /** @returns {string} Required indicator */
  get labelRequired() {
    return LABELS.Common.Required;
  }

  /** @returns {string} Search tab label */
  get labelTabSearch() {
    return LABELS.SiteSelector.TabSearch;
  }

  /** @returns {string} Pin drop tab label */
  get labelTabPinDrop() {
    return LABELS.DischargePoint.TabPinDrop;
  }

  /** @returns {string} Map layers tab label */
  get labelTabLayers() {
    return LABELS.SiteSelector.TabLayers;
  }

  /** @returns {string} Search method label */
  get labelSearchMethod() {
    return LABELS.DischargePoint.SearchMethod;
  }

  /** @returns {string} Loading label */
  get labelLoading() {
    return LABELS.Common.Loading;
  }

  /** @returns {string} Enter address label */
  get labelEnterAddress() {
    return LABELS.SiteSelector.Address;
  }

  /** @returns {string} Selected coordinates label */
  get labelSelectedCoordinates() {
    return "Selected coordinates:";
  }

  /** @returns {string} UTM conversion error */
  get labelUTMConversionError() {
    return LABELS.DischargePoint.UTMConversionError;
  }

  get coordinateDisplayText() {
    if (!this._coordinates) return "";
    if (this._coordinates.utmZone) {
      return `UTM Zone ${this._coordinates.utmZone}, E: ${this._coordinates.utmEast}, N: ${this._coordinates.utmNorth}`;
    }
    return `${this._coordinates.latitude?.toFixed(6)}, ${this._coordinates.longitude?.toFixed(6)}`;
  }

  /* ========================================
   * PUBLIC METHODS
   * ======================================== */

  @api
  open() {
    this.openModal();
  }

  @api
  close() {
    this.closeModal();
    this._resetState();
  }

  @api
  getCoordinateData() {
    return this._coordinates;
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  _resetState() {
    this._activeTab = "search";
    this._coordinates = null;
    this._errorMessage = "";
    this._pointPlaced = false;
    this._addressSearchValue = "";
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleOpenClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.open();
  }

  handleSearchMethodChange(event) {
    this._searchMethod = event.detail.value || event.target.value;
    this._errorMessage = "";
  }

  handleCoordinateFormatChange(event) {
    this._coordinateFormat = event.detail.value || event.target.value;
    this._errorMessage = "";
  }

  handleCoordinateChange(event) {
    const { decimal } = event.detail;

    if (DEBUG) console.log(CLASS_NAME, "handleCoordinateChange", decimal);

    this._coordinates = decimal;
  }

  handleAddressChange(event) {
    this._addressSearchValue = event.target.value;
  }

  handleSearchClick() {
    this._errorMessage = "";

    if (this._searchMethod === "coordinates") {
      const coordInput = this.template.querySelector(
        "c-sf-gps-ds-ca-on-coordinate-input"
      );
      if (coordInput) {
        const validation = coordInput.validate();
        if (!validation.valid) {
          this._errorMessage = validation.errors.join(". ");
          return;
        }

        const decimal = coordInput.toDecimal();

        if (decimal.requiresConversion) {
          this._errorMessage = this.labelUTMConversionError;
          return;
        }

        if (decimal.latitude && decimal.longitude) {
          this._isSearching = true;
          this.sendMessageToMap({
            title: "goTo",
            detail: {
              latitude: decimal.latitude,
              longitude: decimal.longitude,
              zoom: 15,
              placeMarker: true
            }
          });
        }
      }
    } else if (this._searchMethod === "address") {
      if (this._addressSearchValue.trim()) {
        this._isSearching = true;
        this.sendMessageToMap({
          title: "search",
          detail: { query: this._addressSearchValue }
        });
      }
    }
  }

  handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      this.handleSearchClick();
    }
  }

  handleContinueClick() {
    if (!this._coordinates) return;

    this.dispatchEvent(
      new CustomEvent("continue", {
        detail: {
          coordinates: this._coordinates
        },
        bubbles: true,
        composed: true
      })
    );

    this.close();
  }

  /**
   * Handles map message data (called by mixin)
   * @param {Object} data - Message data from map
   */
  handleMapMessageData(data) {
    if (DEBUG) console.log(CLASS_NAME, "handleMapMessageData", data);

    switch (data.name) {
      case "searchResult":
        this._isSearching = false;
        if (data.error) {
          this._errorMessage = formatUserError(
            data.error,
            getMessage("LOCATION_NOT_FOUND").message
          );
        } else if (data.coordinates) {
          this._coordinates = {
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude
          };
          this._pointPlaced = true;
          this._errorMessage = "";
        }
        break;

      case "pinPlaced":
        this._isSearching = false;
        if (data.coordinates) {
          this._coordinates = {
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude
          };
          this._pointPlaced = true;
          this._errorMessage = "";
        }
        break;

      case "error":
        this._isSearching = false;
        this._errorMessage = formatUserError(
          data.error,
          getMessage("MAP_LOAD_ERROR").message
        );
        break;

      default:
        break;
    }
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    this.classList.add("caon-scope");
    this.setupMessageListener();

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }

  disconnectedCallback() {
    this.cleanupMessageListener();
  }
}
