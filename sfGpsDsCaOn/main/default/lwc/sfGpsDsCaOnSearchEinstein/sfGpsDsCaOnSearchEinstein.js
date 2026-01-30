/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import searchWithEinstein from "@salesforce/apex/SfGpsDsCaOnSearchController.searchWithEinstein";
import getSearchSuggestions from "@salesforce/apex/SfGpsDsCaOnSearchController.getSearchSuggestions";
import { formatUserError, getMessage } from "c/sfGpsDsCaOnUserMessages";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnSearchEinstein";

/**
 * Einstein Search wrapper component for Ontario Design System
 *
 * This component wraps the sfGpsDsCaOnSearch component and connects it to
 * Salesforce Einstein Search via the Apex controller.
 *
 * ## Features
 * - Automatic Einstein Search integration
 * - Fallback to SOSL if Einstein not available
 * - Configurable object types and result limits
 * - Event-based result selection
 *
 * ## Usage
 * ```html
 * <c-sf-gps-ds-ca-on-search-einstein
 *   label="Search Knowledge"
 *   object-types="Knowledge__kav,Account"
 *   max-results="10"
 *   use-einstein="true"
 *   onselect={handleSearchSelect}
 * ></c-sf-gps-ds-ca-on-search-einstein>
 * ```
 */
export default class SfGpsDsCaOnSearchEinstein extends SfGpsDsLwc {
  static renderMode = "light";

  /* ========================================
   * PUBLIC PROPERTIES
   * ======================================== */

  /**
   * Label for the search input
   */
  @api label;

  /**
   * Placeholder text
   */
  @api placeholder;

  /**
   * Hint text below the input
   */
  @api hintText;

  /**
   * Maximum number of suggestions to display
   */
  @api maxResults = 10;

  /**
   * Minimum characters before searching
   */
  @api minChars = 2;

  /**
   * Debounce time in milliseconds
   */
  @api debounceMs = 300;

  /**
   * Comma-separated list of object API names to search
   * Example: "Account,Contact,Knowledge__kav"
   */
  @api objectTypes = "Account,Contact";

  /**
   * Whether to use Einstein Search API (Connect API)
   * Falls back to SOSL if not in Experience Cloud or Einstein unavailable
   */
  @api useEinstein = false;

  /**
   * Search group for Einstein Search: ALL, NAME, EMAIL, PHONE, SIDEBAR
   */
  @api searchGroup = "ALL";

  /**
   * Text to display when no results found
   */
  @api noResultsText;

  /**
   * Additional CSS class names
   */
  @api className;

  /* ========================================
   * PRIVATE STATE
   * ======================================== */

  _suggestions = [];
  _searchTerm = "";
  _isSearching = false;
  _errorMessage = "";

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get computedUseEinstein() {
    // Handle string "true" from LWC property binding
    return this.useEinstein === true || this.useEinstein === "true";
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handle search update from child component
   */
  handleSearchUpdate(event) {
    const searchTerm = event.detail.value;
    this._searchTerm = searchTerm;
    this._errorMessage = "";

    if (!searchTerm || searchTerm.length < (this.minChars || 2)) {
      this._suggestions = [];
      return;
    }

    this._isSearching = true;
    this.performSearch(searchTerm);
  }

  /**
   * Handle selection from child component
   */
  handleSearchSelect(event) {
    // Re-dispatch the event for parent components
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: event.detail,
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Handle search submit (Enter key)
   */
  handleSearchSubmit(event) {
    // Re-dispatch the event for parent components
    this.dispatchEvent(
      new CustomEvent("submit", {
        detail: event.detail,
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Handle search clear
   */
  handleSearchClear() {
    this._suggestions = [];
    this._searchTerm = "";
    this._errorMessage = "";

    this.dispatchEvent(
      new CustomEvent("clear", {
        bubbles: true,
        composed: true
      })
    );
  }

  /* ========================================
   * SEARCH METHODS
   * ======================================== */

  /**
   * Perform search using appropriate method
   */
  async performSearch(searchTerm) {
    try {
      let results;

      if (this.computedUseEinstein) {
        results = await searchWithEinstein({
          searchTerm: searchTerm,
          searchGroup: this.searchGroup,
          maxResults: this.maxResults
        });
      } else {
        results = await getSearchSuggestions({
          searchTerm: searchTerm,
          objectTypes: this.objectTypes,
          maxResults: this.maxResults
        });
      }

      // Only update if search term hasn't changed
      if (searchTerm === this._searchTerm) {
        this._suggestions = results || [];
      }
    } catch (error) {
      console.error("Search error:", error);
      this._errorMessage = formatUserError(
        error,
        getMessage("SEARCH_NO_RESULTS").message
      );
      this._suggestions = [];
    } finally {
      this._isSearching = false;
    }
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
