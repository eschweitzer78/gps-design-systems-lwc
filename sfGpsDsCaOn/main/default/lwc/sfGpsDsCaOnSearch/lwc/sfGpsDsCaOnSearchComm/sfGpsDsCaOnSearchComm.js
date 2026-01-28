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
export default class SfGpsDsCaOnSearchComm extends NavigationMixin(SfGpsDsLwc) {
    static renderMode = "light";
    /* api properties - exposed to Experience Builder */
    // @ts-ignore
    @api
    label = "Search";
    // @ts-ignore
    @api
    placeholder = "Search...";
    // @ts-ignore
    @api
    hintText;
    // @ts-ignore
    @api
    searchObjects = "Knowledge__kav,Account,Contact";
    // @ts-ignore
    @api
    maxSuggestions = 8;
    // @ts-ignore
    @api
    debounceMs = 300;
    // @ts-ignore
    @api
    minChars = 2;
    // @ts-ignore
    @api
    noResultsText = "No results found";
    // @ts-ignore
    @api
    searchResultsPage = "/search";
    // @ts-ignore
    @api
    navigateOnSelect;
    get computedNavigateOnSelect() {
        return this.navigateOnSelect !== false;
    }
    // @ts-ignore
    @api
    className;
    /* internal state */
    _suggestions = [];
    /* LWS-safe navigation helper */
    navigateToUrl(url) {
        // Use NavigationMixin for LWS-compliant navigation
        const pageRef = {
            type: "standard__webPage",
            attributes: {
                url: url
            }
        };
        // @ts-ignore - NavigationMixin method
        this[NavigationMixin.Navigate](pageRef);
    }
    navigateToRecord(recordId) {
        // Use NavigationMixin for record navigation
        const pageRef = {
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
    async handleUpdate(event) {
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
        }
        catch (error) {
            if (DEBUG)
                console.error(CLASS_NAME, "Search error:", error);
            this._suggestions = [];
        }
    }
    handleSelect(event) {
        const result = event.detail;
        if (this.computedNavigateOnSelect && result) {
            if (result.id) {
                // Navigate to record detail page using NavigationMixin
                this.navigateToRecord(result.id);
            }
            else if (result.url) {
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
    handleSubmit(event) {
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
    handleClear() {
        this._suggestions = [];
        this.dispatchEvent(new CustomEvent("searchclear", {
            bubbles: true,
            composed: true
        }));
    }
    /* lifecycle */
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("caon-scope");
    }
}
