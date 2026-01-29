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

  /**
   * Navigate to a record detail page.
   * LWR CRITICAL: objectApiName is required for LWR routing to work.
   * Without it, navigation fails silently with a console routing error.
   * 
   * @param recordId - The Salesforce record ID
   * @param objectApiName - The API name of the object (e.g., 'Account', 'Contact')
   */
  navigateToRecord(recordId: string, objectApiName?: string): void {
    // Use NavigationMixin for record navigation
    // LWR requires objectApiName - attempt to derive from recordId prefix if not provided
    const derivedObjectName = objectApiName || this.deriveObjectApiName(recordId);
    
    const pageRef: PageReference = {
      type: "standard__recordPage",
      attributes: {
        recordId: recordId,
        objectApiName: derivedObjectName,
        actionName: "view"
      }
    };

    // @ts-ignore - NavigationMixin method
    this[NavigationMixin.Navigate](pageRef);
  }

  /**
   * Attempts to derive object API name from record ID prefix.
   * This is a fallback - explicit objectApiName should always be provided.
   * 
   * @param recordId - The Salesforce record ID
   * @returns Object API name or 'Record' as fallback
   */
  private deriveObjectApiName(recordId: string): string {
    // Common Salesforce key prefixes
    const prefixMap: Record<string, string> = {
      "001": "Account",
      "003": "Contact",
      "006": "Opportunity",
      "00Q": "Lead",
      "500": "Case",
      "ka0": "Knowledge__kav",
      "0pk": "BusinessLicenseApplication"
    };

    const prefix = recordId?.substring(0, 3);
    return prefixMap[prefix] || "Record";
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
        // LWR: Pass objectType for proper routing (required in LWR context)
        this.navigateToRecord(result.id, result.objectType);
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
