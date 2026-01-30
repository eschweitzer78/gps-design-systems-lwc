/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormPlacesTypeahead from "c/sfGpsDsFormPlacesTypeahead";
import { computeClass } from "c/sfGpsDsHelpers";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";
import { Logger } from "c/sfGpsDsCaOnDebugUtils";
import tmpl from "./sfGpsDsCaOnFormPlacesTypeahead.html";

/**
 * Logger instance for this component.
 * Enable debug output by setting window.sfGpsDsCaOnDebug = true in console.
 * @type {Logger}
 */
const log = new Logger("SfGpsDsCaOnFormPlacesTypeahead");

/**
 * CSS class applied when dropdown is open.
 * @type {string}
 */
const THEME_IS_OPEN_CLASSNAME = "sfgpsdscaon-is-open";

/**
 * CSS class applied to the currently focused option.
 * @type {string}
 */
const THEME_HAS_FOCUS_CLASSNAME = "sfgpsdscaon-has-focus";

/**
 * @slot PlacesTypeahead
 * @description Ontario Design System Places Typeahead for OmniStudio forms.
 * Provides Google Maps address autocomplete functionality with Ontario DS styling.
 * 
 * ## Google Maps API Requirements
 * - Requires Google Maps API key configured in OmniScript element properties
 * - Uses Google Places Autocomplete API
 * - Supports address component mapping via googleTransformation property
 * 
 * ## Key Inherited Properties (from OmniscriptPlacesTypeahead)
 * - `selectedPlace` {Array} - Currently selected place for lightning-map
 * - `_placesService` {GooglePlacesService} - Service instance for API calls
 * - `_sessionToken` {string} - Google billing session token
 * - `_googleAttribution` {string} - Required Google branding image
 * - `zoomLevel` {number} - Map zoom level
 * 
 * ## Key Inherited Methods (from OmniscriptPlacesTypeahead)
 * - `placeAutocomplete()` - Searches Google Places API
 * - `placeDetails()` - Gets full address details
 * - `applySelection()` - Applies selected place to OmniScript data
 * - `transformResult()` - Maps address components to OmniScript fields
 * 
 * ## Configuration Properties (set in OmniScript Designer)
 * - `googleMapsAPIKey` - Your Google Maps API key
 * - `googleAddressCountry` - Country bias for search results
 * - `googleAddressTypes` - Types of places to search (e.g., "address")
 * - `googleTransformation` - Mapping of address components to OmniScript fields
 * - `hideMap` - Whether to hide the embedded map
 * 
 * ## Compliance
 * - **LWR**: Uses Light DOM parent component
 * - **LWS**: No eval(), proper namespace imports, try/catch for window APIs
 * - **Ontario DS**: Uses Ontario form field styling
 * - **WCAG 2.1 AA**: Proper ARIA combobox pattern, keyboard navigation
 * 
 * @see {@link sfGpsDsCaOnFormTypeahead} For non-Google typeahead
 */
export default class SfGpsDsCaOnFormPlacesTypeahead extends SfGpsDsFormPlacesTypeahead {
  /**
   * Track whether dropdown is showing.
   * @type {boolean}
   */
  _showOptions = false;

  /**
   * Track loading state during remote calls.
   * @type {boolean}
   */
  _isLoading = false;

  /**
   * Index of currently highlighted option for keyboard navigation.
   * @type {number}
   */
  _highlightIndex = -1;

  /* ========================================
   * COMPUTED PROPERTIES - ERROR STATE
   * ======================================== */

  /**
   * Returns true if the field has a validation error.
   * 
   * @returns {boolean} True if field is invalid
   */
  get sfGpsDsIsError() {
    if (this._showValidation && !this.isValid) {
      return true;
    }
    if (this._sfGpsDsCustomValidation) {
      return true;
    }
    if (this.errorMessage) {
      return true;
    }
    return false;
  }

  /**
   * Returns the error message to display.
   * 
   * @returns {string|null} Error message or null
   */
  get sfGpsDsErrorMessage() {
    if (this.errorMessage) {
      return omniGetMergedField(this, this.errorMessage);
    }
    if (this.validationMessage) {
      return omniGetMergedField(this, this.validationMessage);
    }
    return null;
  }

  /* ========================================
   * COMPUTED PROPERTIES - CSS CLASSES
   * ======================================== */

  /**
   * Computes CSS classes for the label element.
   * 
   * @returns {string} Space-separated CSS classes
   */
  get computedLabelClassName() {
    return computeClass({
      "ontario-label": true,
      "ontario-label--required": this._propSetMap.required
    });
  }

  /**
   * Computes CSS classes for the input element.
   * 
   * @returns {string} Space-separated CSS classes
   */
  get computedInputClassName() {
    return computeClass({
      "ontario-input": true,
      "sfgpsdscaon-typeahead__input": true,
      "ontario-input__error": this.sfGpsDsIsError
    });
  }

  /**
   * Determines if required/optional flag should display.
   * 
   * @returns {boolean} True if flag should show
   */
  get showFlag() {
    return this._propSetMap?.required || this._propSetMap?.optional;
  }

  /**
   * Returns the flag text ("required" or "optional").
   * 
   * @returns {string} Flag text
   */
  get flagText() {
    if (this._propSetMap?.required) return "required";
    if (this._propSetMap?.optional) return "optional";
    return "";
  }

  /**
   * Computes aria-describedby for accessibility.
   * 
   * @returns {string|null} Space-separated element IDs
   */
  get computedAriaDescribedBy() {
    const ids = [];
    if (this.mergedHelpText) ids.push("helper");
    if (this.sfGpsDsIsError) ids.push("errorMessageBlock");
    return ids.length > 0 ? ids.join(" ") : null;
  }

  /**
   * Computes aria-activedescendant for the currently highlighted option.
   * 
   * @returns {string|null} ID of highlighted option or null
   */
  get computedAriaActiveDescendant() {
    if (this._showOptions && this._highlightIndex >= 0 && this._highlightIndex < (this.options?.length || 0)) {
      return `places-option-${this._highlightIndex}`;
    }
    return null;
  }

  /**
   * Returns the number of available options.
   * 
   * @returns {number} Number of options
   */
  get optionCount() {
    return this.options?.length || 0;
  }

  /**
   * Returns announcement text for screen readers.
   * 
   * @returns {string} Announcement text
   */
  get resultsAnnouncement() {
    if (this._isLoading) {
      return "Searching addresses...";
    }
    const count = this.optionCount;
    if (count === 0) {
      return "No addresses found";
    }
    return `${count} address${count === 1 ? "" : "es"} found. Use up and down arrows to navigate.`;
  }

  /**
   * Computes CSS classes for the dropdown container.
   * 
   * @returns {string} Space-separated CSS classes
   */
  get computedDropdownClassName() {
    return computeClass({
      "sfgpsdscaon-dropdown": true,
      "sfgpsdscaon-dropdown--open": this._showOptions
    });
  }

  /**
   * Returns true if options array has items.
   * 
   * @returns {boolean} True if options exist
   */
  get hasOptions() {
    return this.options && this.options.length > 0;
  }

  /**
   * Transforms options for template rendering.
   * Google Places returns predictions with `description` for display.
   * 
   * @returns {Array} Decorated options with key, id, and label
   */
  get decoratedOptions() {
    return (this.options || []).map((opt, index) => {
      const optObj = typeof opt === "string" ? { description: opt } : opt;
      return {
        ...optObj,
        key: optObj.place_id || index,
        id: `places-option-${index}`,
        // Google Places uses `description` for display text
        label: optObj.description || optObj.name || ""
      };
    });
  }

  /**
   * Returns true if the map should be rendered.
   * 
   * @returns {boolean} True to show map
   */
  get showMap() {
    return !this._propSetMap.hideMap && this.selectedPlace && this.selectedPlace.length > 0;
  }

  /**
   * Computes CSS classes for the map container.
   * 
   * @returns {string} Space-separated CSS classes
   */
  get computedMapClassName() {
    return computeClass({
      "sfgpsdscaon-places-map": true,
      "sfgpsdscaon-places-map--visible": this.showMap
    });
  }

  /* ========================================
   * DROPDOWN BEHAVIOR
   * ======================================== */

  /**
   * Opens the dropdown.
   */
  showOptionsDropdown() {
    this._showOptions = true;
    const triggerEl = this.template.querySelector(".sfgpsdscaon-places-typeahead");
    if (triggerEl) {
      triggerEl.classList.add(THEME_IS_OPEN_CLASSNAME);
    }
  }

  /**
   * Closes the dropdown.
   */
  hideOptionsDropdown() {
    this._showOptions = false;
    this._highlightIndex = -1;
    const triggerEl = this.template.querySelector(".sfgpsdscaon-places-typeahead");
    if (triggerEl) {
      triggerEl.classList.remove(THEME_IS_OPEN_CLASSNAME);
    }
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handles option selection from the dropdown.
   * Creates a synthetic event for the parent's handleSelect method.
   * 
   * @param {Event} event - Click or keydown event on option
   */
  handleOptionSelect(event) {
    log.enter("handleOptionSelect", { type: event.type, key: event.key });
    
    if (event.type === "keydown" && event.key !== "Enter") {
      log.exit("handleOptionSelect", "ignored - not Enter key");
      return;
    }
    
    event.preventDefault();
    
    const index = parseInt(event.currentTarget.getAttribute("data-option-index"), 10);
    const option = this.options[index];
    
    log.debug("Place selected", { 
      index, 
      placeId: option?.place_id,
      description: option?.description 
    });
    
    if (option) {
      // Create a synthetic event matching what the parent's handleSelect expects
      const syntheticEvent = {
        detail: {
          item: option
        },
        stopPropagation: () => {}
      };
      
      // Call parent's handleSelect which handles Google Places details retrieval
      try {
        log.timeStart("placeDetailsRetrieval");
        if (super.handleSelect) {
          super.handleSelect(syntheticEvent);
        }
        log.debug("Place details request initiated");
      } catch (error) {
        log.error("Failed to retrieve place details", error);
      }
    }
    
    this.hideOptionsDropdown();
    log.exit("handleOptionSelect");
  }

  /**
   * Handles mouse hover on options.
   * 
   * @param {Event} event - Mouseover event
   */
  handleOptionFocus(event) {
    const options = this.template.querySelectorAll('[role="option"]');
    options.forEach((opt) => opt.classList.remove(THEME_HAS_FOCUS_CLASSNAME));
    
    event.currentTarget.classList.add(THEME_HAS_FOCUS_CLASSNAME);
    this._highlightIndex = parseInt(event.currentTarget.getAttribute("data-option-index"), 10);
  }

  /**
   * Handles keyboard navigation.
   * 
   * @param {KeyboardEvent} event - Keydown event on input
   */
  handleInputKeyDown(event) {
    switch (event.key) {
      case "Escape":
        this.hideOptionsDropdown();
        break;
        
      case "ArrowDown":
        event.preventDefault();
        if (!this._showOptions && this.hasOptions) {
          this.showOptionsDropdown();
        }
        this._highlightIndex = Math.min(
          this._highlightIndex + 1,
          this.options.length - 1
        );
        this.updateHighlight();
        break;
        
      case "ArrowUp":
        event.preventDefault();
        this._highlightIndex = Math.max(this._highlightIndex - 1, 0);
        this.updateHighlight();
        break;
        
      case "Enter":
        if (this._showOptions && this._highlightIndex >= 0) {
          event.preventDefault();
          const option = this.options[this._highlightIndex];
          if (option) {
            const syntheticEvent = {
              detail: { item: option },
              stopPropagation: () => {}
            };
            if (super.handleSelect) {
              super.handleSelect(syntheticEvent);
            }
          }
          this.hideOptionsDropdown();
        }
        break;
        
      default:
        break;
    }
  }

  /**
   * Updates visual highlight on options.
   */
  updateHighlight() {
    const options = this.template.querySelectorAll('[role="option"]');
    options.forEach((opt, idx) => {
      if (idx === this._highlightIndex) {
        opt.classList.add(THEME_HAS_FOCUS_CLASSNAME);
        opt.scrollIntoView({ block: "nearest" });
      } else {
        opt.classList.remove(THEME_HAS_FOCUS_CLASSNAME);
      }
    });
  }

  /**
   * Handles input changes and triggers Google Places search.
   * 
   * @param {Event} event - Input event
   */
  handleInputChange(event) {
    if (this.hasOptions) {
      this.showOptionsDropdown();
    }
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Returns the Ontario DS template.
   * 
   * @returns {Object} Template to render
   * @override
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes component.
   * 
   * @override
   */
  connectedCallback() {
    log.enter("connectedCallback");
    log.timeStart("initialization");
    
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdscaon-read-only";
    this._showOptions = false;
    this._highlightIndex = -1;
    this.classList.add("caon-scope");
    
    log.debug("Component initialized", {
      label: this._propSetMap?.label,
      required: this._propSetMap?.required,
      googleMapsAPIKey: this._propSetMap?.googleMapsAPIKey ? "configured" : "missing",
      googleAddressCountry: this._propSetMap?.googleAddressCountry || "none"
    });
    
    log.timeEnd("initialization");
    log.exit("connectedCallback");
  }

  /**
   * Cleanup when component is removed.
   * 
   * @override
   */
  disconnectedCallback() {
    log.debug("Component disconnecting");
    
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}
