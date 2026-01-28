/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { NavigationMixin } from "lightning/navigation";
// @ts-ignore - Apex import
import getSearchSuggestions from "@salesforce/apex/SfGpsDsCaOnSearchController.getSearchSuggestions";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnSearchComm";

interface SearchResult {
  id: string;
  label: string;
  objectType: string;
  url: string;
}

// NavigationMixin page reference types
interface PageReference {
  type: string;
  attributes?: Record<string, string>;
  state?: Record<string, string>;
}

export default class SfGpsDsCaOnSearchComm 
  extends NavigationMixin(SfGpsDsLwc) {
  static renderMode = "light";

  /* api properties - exposed to Experience Builder */

  // @ts-ignore
  @api
  label?: string = "Search";

  // @ts-ignore
  @api
  placeholder?: string = "Search...";

  // @ts-ignore
  @api
  hintText?: string;

  // @ts-ignore
  @api
  searchObjects?: string = "Knowledge__kav,Account,Contact";

  // @ts-ignore
  @api
  maxSuggestions?: number = 8;

  // @ts-ignore
  @api
  debounceMs?: number = 300;

  // @ts-ignore
  @api
  minChars?: number = 2;

  // @ts-ignore
  @api
  noResultsText?: string = "No results found";

  // @ts-ignore
  @api
  searchResultsPage?: string = "/search";

  // @ts-ignore
  @api
  navigateOnSelect?: boolean;

  get computedNavigateOnSelect(): boolean {
    return this.navigateOnSelect !== false;
  }

  // @ts-ignore
  @api
  className?: string;

  /* internal state */

  _suggestions: SearchResult[] = [];

  /* LWS-safe navigation helper */
  
  navigateToUrl(url: string): void {
    // Use NavigationMixin for LWS-compliant navigation
    const pageRef: PageReference = {
      type: "standard__webPage",
      attributes: {
        url: url
      }
    };

    // @ts-ignore - NavigationMixin method
    this[NavigationMixin.Navigate](pageRef);
  }

  navigateToRecord(recordId: string): void {
    // Use NavigationMixin for record navigation
    const pageRef: PageReference = {
      type: "standard__recordPage",
      attributes: {
        recordId: recordId,
        actionName: "view"
      }
    };

    // @ts-ignore - NavigationMixin method
    this[NavigationMixin.Navigate](pageRef);
  }

  /* event handlers */

  async handleUpdate(event: CustomEvent<{ value: string }>): Promise<void> {
    const value = event.detail?.value || "";
    
    if (value.length < (this.minChars || 2)) {
      this._suggestions = [];
      return;
    }

    try {
      // Imperative Apex call
      const results = await getSearchSuggestions({
        searchTerm: value,
        objectTypes: this.searchObjects,
        maxResults: this.maxSuggestions
      });

      // LWS-safe: complete array reassignment
      this._suggestions = results ? [...results] : [];
    } catch (error) {
      if (DEBUG) console.error(CLASS_NAME, "Search error:", error);
      this._suggestions = [];
    }
  }

  handleSelect(event: CustomEvent<SearchResult>): void {
    const result = event.detail;
    
    if (this.computedNavigateOnSelect && result) {
      if (result.id) {
        // Navigate to record detail page using NavigationMixin
        this.navigateToRecord(result.id);
      } else if (result.url) {
        // Navigate to URL using NavigationMixin
        this.navigateToUrl(result.url);
      }
    }

    // Dispatch event for parent components
    this.dispatchEvent(new CustomEvent("searchselect", {
      detail: result,
      bubbles: true,
      composed: true
    }));
  }

  handleSubmit(event: CustomEvent<{ value: string }>): void {
    const searchValue = event.detail?.value || "";
    
    if (searchValue && this.searchResultsPage) {
      // Navigate to search results page with query parameter using NavigationMixin
      const url = `${this.searchResultsPage}?q=${encodeURIComponent(searchValue)}`;
      this.navigateToUrl(url);
    }

    // Dispatch event for parent components
    this.dispatchEvent(new CustomEvent("searchsubmit", {
      detail: { value: searchValue },
      bubbles: true,
      composed: true
    }));
  }

  handleClear(): void {
    this._suggestions = [];

    this.dispatchEvent(new CustomEvent("searchclear", {
      bubbles: true,
      composed: true
    }));
  }

  /* lifecycle */

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
