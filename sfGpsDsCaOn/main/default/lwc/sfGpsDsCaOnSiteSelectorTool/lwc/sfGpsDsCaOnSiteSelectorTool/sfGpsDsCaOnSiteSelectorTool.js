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

/**
 * @slot SiteSelectorTool
 * @description Ontario Design System Site Selector Tool with ESRI map integration.
 * Provides address search, map visualization, and site point selection.
 *
 * ## LWR/LWS Compatibility
 * - Uses Light DOM for Experience Cloud
 * - No eval() or dynamic code execution
 * - ESRI map runs in Visualforce iframe
 * - postMessage for secure cross-origin communication
 *
 * ## Features
 * - Address search with ESRI geocoding
 * - Interactive map with pin placement
 * - Site point selection (manual pin)
 * - Map layers control
 * - Structured address data output
 * - Read-only mode for back-office review
 *
 * ## Architecture
 * - Extends MapSelectorMixin for shared modal/map functionality
 * - Main component contains modal and two-panel layout
 * - Left panel: search controls and address details
 * - Right panel: ESRI map in Visualforce iframe
 */
export default class SfGpsDsCaOnSiteSelectorTool extends MapSelectorMixin(
  LightningElement
) {
  static renderMode = "light";

  /* ========================================
   * PUBLIC PROPERTIES
   * ======================================== */

  /**
   * Button label to open the site selector
   * @type {string}
   */
  @api buttonLabel = "Site selector tool";

  /**
   * Button icon name
   * @type {string}
   */
  @api buttonIcon = "location";

  /**
   * Modal title
   * @type {string}
   */
  @api modalTitle = "Site";

  /**
   * Default latitude for map center
   * @type {number}
   */
  @api defaultLatitude = 43.6532; // Toronto

  /**
   * Default longitude for map center
   * @type {number}
   */
  @api defaultLongitude = -79.3832; // Toronto

  /**
   * Visualforce page URL for the ESRI map
   * Set by parent component or fetched via Apex
   * @type {string}
   */
  @api vfPageUrl;

  /**
   * Custom CSS class
   * @type {string}
   */
  @api className;

  /**
   * Read-only mode for reviewing a previously captured location.
   * When true:
   * - Search and input controls are hidden
   * - Save button is hidden
   * - Map displays the location without allowing changes
   * - Useful for back-office review of submitted applications
   * @type {boolean}
   */
  @api readOnly = false;

  /**
   * Pre-populated address value for read-only mode or editing.
   * Can be a JSON string or object with address fields.
   * @type {Object|string}
   */
  @api
  get value() {
    return this._value;
  }
  set value(val) {
    try {
      if (typeof val === "string" && val) {
        this._value = JSON.parse(val);
      } else if (val && typeof val === "object") {
        this._value = val;
      } else {
        this._value = null;
      }
      // If value is set, populate address details and coordinates
      if (this._value) {
        this._addressDetails = this._value.address || this._value;
        this._coordinates = this._value.coordinates || {
          latitude: this._value.latitude,
          longitude: this._value.longitude
        };
      }
    } catch {
      this._value = null;
    }
  }
  _value = null;

  /**
   * Search parameter options for dropdown
   * @type {Array}
   */
  @api
  get searchOptions() {
    return this._searchOptions;
  }
  set searchOptions(val) {
    try {
      this._searchOptions =
        typeof val === "string" ? JSON.parse(val) : val || [];
    } catch {
      this._searchOptions = [];
    }
  }
  _searchOptions = [
    { value: "address", label: "Address" },
    { value: "coordinates", label: "Coordinates" },
    { value: "lot", label: "Lot/Concession" }
  ];

  /* ========================================
   * PRIVATE PROPERTIES (Component-specific)
   * ======================================== */

  /** @type {string} Selected search parameter */
  @track _searchParameter = "address";

  /** @type {string} Search input value */
  @track _searchValue = "";

  /** @type {Object} Found address details */
  @track _addressDetails = null;

  /** @type {Object} Current coordinates */
  @track _coordinates = null;

  /**
   * Initial iframe URL - set once when modal opens, doesn't update reactively
   * @type {string}
   * @private
   */
  @track _initialIframeUrl = "";

  /* ========================================
   * MIXIN CONFIGURATION OVERRIDES
   * ======================================== */

  /**
   * Tab order for keyboard navigation
   * @returns {string[]}
   */
  get tabOrder() {
    return ["search", "sitepoint", "layers"];
  }

  /**
   * CSS selector for the map iframe
   * @returns {string}
   */
  get iframeSelector() {
    return ".sfgpsdscaon-site-selector__map-iframe";
  }

  /**
   * Component name for debug logging
   * @returns {string}
   */
  get componentName() {
    return "SiteSelectorTool";
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * CSS class for the component container
   * @returns {string}
   */
  get computedContainerClassName() {
    return computeClass({
      "sfgpsdscaon-site-selector": true,
      [this.className]: this.className
    });
  }

  /**
   * Whether Search tab is active
   * @returns {boolean}
   */
  get isSearchTabActive() {
    return this._activeTab === "search";
  }

  /**
   * Whether Site Point tab is active
   * @returns {boolean}
   */
  get isSitePointTabActive() {
    return this._activeTab === "sitepoint";
  }

  /**
   * Whether Layers tab is active
   * @returns {boolean}
   */
  get isLayersTabActive() {
    return this._activeTab === "layers";
  }

  /**
   * CSS class for Search tab button
   * @returns {string}
   */
  get searchTabClassName() {
    return computeClass({
      "sfgpsdscaon-site-selector__tab": true,
      "sfgpsdscaon-site-selector__tab--active": this.isSearchTabActive
    });
  }

  /**
   * CSS class for Site Point tab button
   * @returns {string}
   */
  get sitePointTabClassName() {
    return computeClass({
      "sfgpsdscaon-site-selector__tab": true,
      "sfgpsdscaon-site-selector__tab--active": this.isSitePointTabActive
    });
  }

  /**
   * CSS class for Layers tab button
   * @returns {string}
   */
  get layersTabClassName() {
    return computeClass({
      "sfgpsdscaon-site-selector__tab": true,
      "sfgpsdscaon-site-selector__tab--active": this.isLayersTabActive
    });
  }

  /**
   * Whether address details are available
   * @returns {boolean}
   */
  get hasAddressDetails() {
    return this._addressDetails !== null;
  }

  /**
   * Street address from details
   * @returns {string}
   */
  get streetAddress() {
    return this._addressDetails?.streetAddress || "";
  }

  /**
   * City, Province, Postal Code formatted
   * @returns {string}
   */
  get cityProvincePostal() {
    if (!this._addressDetails) return "";
    const { city, province, postalCode } = this._addressDetails;
    return [city, province, postalCode].filter(Boolean).join(", ");
  }

  /**
   * Country from details
   * @returns {string}
   */
  get country() {
    return this._addressDetails?.country || "";
  }

  /**
   * Whether save button should be disabled
   * @returns {boolean}
   */
  get isSaveDisabled() {
    return !this.hasAddressDetails;
  }

  /**
   * Whether component is in read-only mode
   * @returns {boolean}
   */
  get isReadOnly() {
    return this.readOnly === true || this.readOnly === "true";
  }

  /**
   * Whether to show the search/input controls
   * @returns {boolean}
   */
  get showSearchControls() {
    return !this.isReadOnly;
  }

  /**
   * Whether to show the save button
   * @returns {boolean}
   */
  get showSaveButton() {
    return !this.isReadOnly && this.hasAddressDetails;
  }

  /**
   * Button label for trigger (different in read-only mode)
   * @returns {string}
   */
  get computedButtonLabel() {
    return this.isReadOnly ? "View location" : this.buttonLabel;
  }

  /**
   * Button CSS class (secondary style for read-only)
   * @returns {string}
   */
  get triggerButtonClassName() {
    return computeClass({
      "ontario-button": true,
      "ontario-button--primary": !this.isReadOnly,
      "ontario-button--secondary": this.isReadOnly,
      "sfgpsdscaon-site-selector__trigger": true
    });
  }

  /**
   * Modal title (different for read-only mode)
   * @returns {string}
   */
  get computedModalTitle() {
    return this.isReadOnly ? `${this.modalTitle} - View Only` : this.modalTitle;
  }

  /* ========================================
   * I18N LABEL GETTERS
   * ======================================== */

  /** @returns {string} Search button screen reader text */
  get labelSearch() {
    return LABELS.Common.Search;
  }

  /** @returns {string} Clear search button label */
  get labelClearSearch() {
    return LABELS.SiteSelector.ClearSearch;
  }

  /** @returns {string} Search by parameters dropdown label */
  get labelSearchByParameters() {
    return LABELS.SiteSelector.SearchByParameters;
  }

  /** @returns {string} Read-only mode submitted location title */
  get labelSubmittedLocation() {
    return LABELS.SiteSelector.SubmittedLocation;
  }

  /** @returns {string} Read-only mode hint text */
  get labelSubmittedHint() {
    return LABELS.SiteSelector.SubmittedHint;
  }

  /** @returns {string} Location details heading */
  get labelLocationDetails() {
    return LABELS.SiteSelector.LocationDetails;
  }

  /** @returns {string} Save instructions text */
  get labelSaveInstructions() {
    return LABELS.SiteSelector.SaveInstructions;
  }

  /** @returns {string} Save site address button */
  get labelSaveSiteAddress() {
    return LABELS.SiteSelector.SaveSiteAddress;
  }

  /** @returns {string} Close button label */
  get labelClose() {
    return LABELS.Common.Close;
  }

  /** @returns {string} Search tab label */
  get labelTabSearch() {
    return LABELS.SiteSelector.TabSearch;
  }

  /** @returns {string} Site point tab label */
  get labelTabSitePoint() {
    return LABELS.SiteSelector.TabSitePoint;
  }

  /** @returns {string} Map layers tab label */
  get labelTabLayers() {
    return LABELS.SiteSelector.TabLayers;
  }

  /**
   * Computed VF page URL with parameters.
   * Uses _initialIframeUrl which is set once when modal opens.
   * @returns {string}
   */
  get computedVfPageUrl() {
    return this._initialIframeUrl;
  }

  /**
   * Builds the VF page URL with current parameters
   * @returns {string}
   * @private
   */
  _buildVfPageUrl() {
    if (!this.vfPageUrl) return "";
    const lat = this._coordinates?.latitude || this.defaultLatitude;
    const lng = this._coordinates?.longitude || this.defaultLongitude;
    return `${this.vfPageUrl}?latitude=${lat}&longitude=${lng}&mode=${this._activeTab}`;
  }

  /**
   * Whether VF page URL is available
   * @returns {boolean}
   */
  get hasVfPageUrl() {
    return Boolean(this.computedVfPageUrl);
  }

  /**
   * Whether VF page URL is NOT available (for placeholder)
   * @returns {boolean}
   */
  get hasNoVfPageUrl() {
    return !this.computedVfPageUrl;
  }

  /**
   * Dropdown options for search parameter
   * @returns {Array}
   */
  get searchParameterOptions() {
    return this._searchOptions.map((opt) => ({
      ...opt,
      selected: opt.value === this._searchParameter
    }));
  }

  /**
   * Search input placeholder based on parameter
   * @returns {string}
   */
  get searchPlaceholder() {
    switch (this._searchParameter) {
      case "coordinates":
        return "Enter latitude, longitude";
      case "lot":
        return "Enter lot/concession";
      default:
        return "Enter street number, street name and city.";
    }
  }

  /**
   * Tabindex for Search tab (roving tabindex pattern)
   * @returns {string}
   */
  get searchTabTabIndex() {
    return this.isSearchTabActive ? "0" : "-1";
  }

  /**
   * Tabindex for Site Point tab (roving tabindex pattern)
   * @returns {string}
   */
  get sitePointTabTabIndex() {
    return this.isSitePointTabActive ? "0" : "-1";
  }

  /**
   * Tabindex for Layers tab (roving tabindex pattern)
   * @returns {string}
   */
  get layersTabTabIndex() {
    return this.isLayersTabActive ? "0" : "-1";
  }

  /**
   * Screen reader announcement text for address updates
   * @returns {string}
   */
  get addressAnnouncementText() {
    if (!this._addressDetails) return "";
    return `Address selected: ${this.streetAddress}, ${this.cityProvincePostal}`;
  }

  /* ========================================
   * PUBLIC METHODS
   * ======================================== */

  /**
   * Opens the site selector modal
   * @public
   */
  @api
  open() {
    // Reset tab state BEFORE building URL
    if (this.isReadOnly) {
      this._activeTab = "layers";
    } else {
      this._activeTab = "search";
      if (!this._value) {
        this._addressDetails = null;
      }
    }

    // Set initial iframe URL once when modal opens
    this._initialIframeUrl = this._buildVfPageUrl();

    // Use mixin's openModal
    this.openModal();

    if (
      this.isReadOnly &&
      this._coordinates?.latitude &&
      this._coordinates?.longitude
    ) {
      // Wait for modal and iframe to be ready, then navigate
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.sendMessageToMap({
          title: "goTo",
          detail: {
            latitude: this._coordinates.latitude,
            longitude: this._coordinates.longitude,
            zoom: 17,
            placeMarker: true
          }
        });
        this.sendMessageToMap({
          title: "modeChange",
          detail: { mode: "readonly" }
        });
      }, 1000);
    }
  }

  /**
   * Closes the site selector modal
   * @public
   */
  @api
  close() {
    this.closeModal();
  }

  /**
   * Gets the current address data
   * @public
   * @returns {Object} Address and coordinate data
   */
  @api
  getAddressData() {
    return {
      address: this._addressDetails,
      coordinates: this._coordinates
    };
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handles button click to open modal
   * @param {Event} event
   */
  handleOpenClick(event) {
    event.preventDefault();
    this.open();
  }

  /**
   * Handles search parameter dropdown change
   * @param {Event} event
   */
  handleSearchParameterChange(event) {
    this._searchParameter = event.target.value;
  }

  /**
   * Handles search input change
   * @param {Event} event
   */
  handleSearchInputChange(event) {
    this._searchValue = event.target.value;
  }

  /**
   * Handles search button click
   * @param {Event} event
   */
  handleSearchClick(event) {
    event.preventDefault();
    if (this._searchValue.trim()) {
      this._isSearching = true;
      this._errorMessage = "";
      const message = {
        title: "search",
        detail: {
          query: this._searchValue,
          type: this._searchParameter
        }
      };
      this.sendMessageToMap(message);
    }
  }

  /**
   * Handles clear search input
   * @param {Event} event
   */
  handleClearSearch(event) {
    event.preventDefault();
    this._searchValue = "";
    this._addressDetails = null;
    this._coordinates = null;
    this.sendMessageToMap({ title: "clearMarker", detail: {} });
  }

  /**
   * Handles save site address button click
   * @param {Event} event
   */
  handleSaveClick(event) {
    event.preventDefault();
    if (this._addressDetails) {
      this.dispatchEvent(
        new CustomEvent("save", {
          detail: {
            address: this._addressDetails,
            coordinates: this._coordinates
          },
          bubbles: true,
          composed: true
        })
      );
      this.close();
    }
  }

  /**
   * Handles Enter key in search input
   * @param {KeyboardEvent} event
   */
  handleSearchKeyDown(event) {
    if (event.key === "Enter") {
      this.handleSearchClick(event);
    }
  }

  /**
   * Handles map message data (called by mixin)
   * @param {Object} data - Message data from map
   */
  handleMapMessageData(data) {
    switch (data.name) {
      case "searchResult":
        this._isSearching = false;
        if (data.address) {
          this._addressDetails = data.address;
          this._coordinates = data.coordinates;
        } else if (data.error) {
          this._errorMessage = formatUserError(
            data.error,
            getMessage("LOCATION_NOT_FOUND").message
          );
        }
        break;

      case "pinPlaced":
        if (data.address) {
          this._addressDetails = data.address;
          this._coordinates = data.coordinates;
        }
        break;

      case "error":
        this._errorMessage = formatUserError(
          data.error,
          getMessage("MAP_LOAD_ERROR").message
        );
        this._isSearching = false;
        break;

      default:
        break;
    }
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Component connected to DOM
   */
  connectedCallback() {
    this.classList.add("caon-scope");
    this.setupMessageListener();
  }

  /**
   * Component disconnected from DOM
   */
  disconnectedCallback() {
    this.cleanupMessageListener();
  }
}
