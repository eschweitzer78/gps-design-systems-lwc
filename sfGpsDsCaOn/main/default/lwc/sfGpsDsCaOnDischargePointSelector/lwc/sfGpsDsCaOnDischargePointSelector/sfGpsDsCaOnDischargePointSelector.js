/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import { formatUserError, getMessage } from "c/sfGpsDsCaOnUserMessages";

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
 */
export default class SfGpsDsCaOnDischargePointSelector extends LightningElement {
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
   * PRIVATE PROPERTIES
   * ======================================== */

  @track _isModalOpen = false;
  @track _activeTab = "search";
  @track _searchMethod = "coordinates";
  @track _coordinateFormat = "dms";
  @track _addressSearchValue = "";
  @track _isSearching = false;
  @track _coordinates = null;
  @track _errorMessage = "";
  @track _mapLoaded = false;
  @track _pointPlaced = false;

  _messageHandler = null;

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get isModalOpen() {
    return this._isModalOpen;
  }

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
    this._isModalOpen = true;
  }

  @api
  close() {
    this._isModalOpen = false;
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

  handleModalClose() {
    this.close();
  }

  handleTabClick(event) {
    const tab = event.currentTarget.dataset.tab;
    this._activeTab = tab;

    // Send mode change to map
    const mode = tab === "droppoint" ? "sitepoint" : tab;
    this.sendMessageToMap({ title: "modeChange", detail: { mode: mode } });
  }

  /**
   * Handles keyboard navigation for tabs (arrow keys)
   * WCAG 2.1.1 - Keyboard accessible
   * @param {KeyboardEvent} event
   */
  handleTabKeyDown(event) {
    const tabOrder = ["search", "droppoint", "layers"];
    const currentIndex = tabOrder.indexOf(this._activeTab);

    let newIndex = currentIndex;
    let shouldHandle = false;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        newIndex = currentIndex === 0 ? tabOrder.length - 1 : currentIndex - 1;
        shouldHandle = true;
        break;
      case "ArrowRight":
      case "ArrowDown":
        newIndex = currentIndex === tabOrder.length - 1 ? 0 : currentIndex + 1;
        shouldHandle = true;
        break;
      case "Home":
        newIndex = 0;
        shouldHandle = true;
        break;
      case "End":
        newIndex = tabOrder.length - 1;
        shouldHandle = true;
        break;
      default:
        break;
    }

    if (shouldHandle) {
      event.preventDefault();
      this._activeTab = tabOrder[newIndex];

      // Send mode change to map
      const mode =
        this._activeTab === "droppoint" ? "sitepoint" : this._activeTab;
      this.sendMessageToMap({ title: "modeChange", detail: { mode: mode } });

      // Focus the new active tab
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        const newTab = this.querySelector(`[data-tab="${this._activeTab}"]`);
        if (newTab) {
          newTab.focus();
        }
      }, 0);
    }
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

    // Store the coordinates
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
          // UTM requires server-side conversion
          this._errorMessage =
            "UTM conversion requires server processing. Please use the map or enter decimal coordinates.";
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

    // Dispatch event with coordinate data
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

  handleMapMessage(event) {
    try {
      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;

      if (DEBUG) console.log(CLASS_NAME, "handleMapMessage", data);

      switch (data.name) {
        case "pageLoaded":
          this._mapLoaded = true;
          this._isSearching = false;
          break;

        case "searchResult":
          this._isSearching = false;
          if (data.error) {
            // Use user-friendly error message for search failures
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
          // Use user-friendly error message based on error type
          this._errorMessage = formatUserError(
            data.error,
            getMessage("MAP_LOAD_ERROR").message
          );
          break;

        default:
          break;
      }
    } catch (e) {
      if (DEBUG) console.error(CLASS_NAME, "handleMapMessage error", e);
    }
  }

  sendMessageToMap(message) {
    // Light DOM component - use this.querySelector() directly
    const iframe = this.querySelector(
      ".sfgpsdscaon-discharge-selector__map-iframe"
    );

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify(message), "*");
    }
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    this.classList.add("caon-scope");

    // Set up message listener
    this._messageHandler = this.handleMapMessage.bind(this);
    window.addEventListener("message", this._messageHandler);

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }

  disconnectedCallback() {
    if (this._messageHandler) {
      window.removeEventListener("message", this._messageHandler);
      this._messageHandler = null;
    }
  }
}
