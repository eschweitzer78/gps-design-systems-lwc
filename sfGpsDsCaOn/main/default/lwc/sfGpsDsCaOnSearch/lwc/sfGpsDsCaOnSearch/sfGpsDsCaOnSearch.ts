/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { debounce } from "c/sfGpsDsHelpers";
// @ts-ignore - LWC module import
import { LABELS } from "c/sfGpsDsCaOnLabels";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnSearch";

export interface SearchResult {
  id: string;
  label: string;
  objectType: string;
  url: string;
}

export interface DecoratedSearchResult extends SearchResult {
  optionId: string;
  isActive: boolean;
  className: string;
}

export default class SfGpsDsCaOnSearch extends SfGpsDsLwc {
  static renderMode = "light";

  /* api properties */

  /**
   * Label for the search input.
   * Defaults to translated "Search" label if not specified.
   */
  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  placeholder?: string;

  // @ts-ignore
  @api
  hintText?: string;

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
  className?: string;

  /* api: suggestions - passed from parent for async search */

  _suggestions: SearchResult[] = [];

  // @ts-ignore
  @api
  get suggestions(): SearchResult[] {
    return this._suggestions;
  }

  set suggestions(value: SearchResult[]) {
    // LWS-safe: complete array reassignment
    this._suggestions = value ? [...value] : [];
    this._isOpen = this._suggestions.length > 0 && this._inputValue.length >= (this.minChars || 2);
    this._activeIndex = -1;
  }

  /* api: inputValue */

  // @ts-ignore
  @api
  get inputValue(): string {
    return this._inputValue;
  }

  set inputValue(value: string) {
    this._inputValue = value || "";
  }

  /* internal state */

  _isOpen = false;
  _activeIndex = -1;
  _isLoading = false;

  _inputValue = "";
  _searchId = `search-${Math.random().toString(36).substring(2, 11)}`;
  _listboxId = `listbox-${Math.random().toString(36).substring(2, 11)}`;
  _statusId = `status-${Math.random().toString(36).substring(2, 11)}`;
  _debouncedEmitUpdate: (value: string) => void;

  /* computed properties */

  get computedContainerClass(): string {
    return `ontario-search__container ${this.className || ""}`.trim();
  }

  /**
   * Computed label that uses translated default if not specified.
   */
  get computedLabel(): string {
    return this.label || LABELS.Common.Search;
  }

  /**
   * Computed placeholder that uses translated default if not specified.
   */
  get computedPlaceholder(): string {
    return this.placeholder || `${LABELS.Common.Search}...`;
  }

  get computedInputContainerClass(): string {
    return `ontario-search__input-container${this._isOpen && this._suggestions.length > 0 ? " ontario-search-autocomplete__suggestion-list-open" : ""}`;
  }

  get computedInputClass(): string {
    return "ontario-input ontario-search__input";
  }

  get hasSuggestions(): boolean {
    return this._suggestions.length > 0 && this._isOpen;
  }

  get showNoResults(): boolean {
    return this._isOpen && 
           this._suggestions.length === 0 && 
           this._inputValue.length >= (this.minChars || 2) &&
           !this._isLoading;
  }

  get showResetButton(): boolean {
    return this._inputValue.length > 0;
  }

  get activeOptionId(): string | null {
    if (this._activeIndex >= 0 && this._suggestions[this._activeIndex]) {
      return `suggestion-${this._suggestions[this._activeIndex].id}`;
    }
    return null;
  }

  get statusMessage(): string {
    if (this._isLoading) {
      return "Searching...";
    }
    if (!this._isOpen || this._inputValue.length < (this.minChars || 2)) {
      return "";
    }
    if (this._suggestions.length === 0) {
      return this.noResultsText || "No results found";
    }
    const count = this._suggestions.length;
    return `${count} suggestion${count !== 1 ? "s" : ""} available. Use up and down arrows to navigate.`;
  }

  get decoratedSuggestions(): DecoratedSearchResult[] {
    return this._suggestions.map((item, index) => ({
      ...item,
      optionId: `suggestion-${item.id}`,
      isActive: index === this._activeIndex,
      className: `ontario-search-autocomplete__suggestion-list__list-item${index === this._activeIndex ? " ontario-search-autocomplete__suggestion-list--selected" : ""}`
    }));
  }

  get computedAriaExpanded(): string {
    return this.hasSuggestions ? "true" : "false";
  }

  get computedAriaDescribedBy(): string | null {
    return this.hintText ? "search-hint" : null;
  }

  /* constructor */

  constructor() {
    super();
    // Create debounced function in constructor for proper binding
    this._debouncedEmitUpdate = debounce(
      (value: string) => this.emitUpdateEvent(value),
      this.debounceMs || 300
    );
  }

  /* event handlers */

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this._inputValue = value;

    if (value.length < (this.minChars || 2)) {
      this._suggestions = [];
      this._isOpen = false;
      return;
    }

    this._isLoading = true;
    this._debouncedEmitUpdate(value);
  }

  handleFocus(): void {
    if (this._inputValue.length >= (this.minChars || 2) && this._suggestions.length > 0) {
      this._isOpen = true;
    }
  }

  handleBlur(event: FocusEvent): void {
    // Delay closing to allow click on suggestions
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    // Check if focus moved to a suggestion
    if (relatedTarget?.closest(".ontario-search-autocomplete__suggestion-list")) {
      return;
    }

    // Use setTimeout to allow click events to fire first
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.closeSuggestions();
    }, 150);
  }

  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!this._isOpen && this._suggestions.length > 0) {
          this._isOpen = true;
        }
        this.navigateDown();
        break;

      case "ArrowUp":
        event.preventDefault();
        this.navigateUp();
        break;

      case "Enter":
        event.preventDefault();
        this.handleEnter();
        break;

      case "Escape":
        event.preventDefault();
        if (this._isOpen) {
          this.closeSuggestions();
        } else {
          this.handleReset();
        }
        break;

      case "Tab":
        // Allow default tab behavior but close suggestions
        this.closeSuggestions();
        break;

      default:
        break;
    }
  }

  handleSuggestionClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget as HTMLElement;
    const id = target.dataset.id;
    const suggestion = this._suggestions.find(s => s.id === id);
    
    if (suggestion) {
      this.selectSuggestion(suggestion);
    }
  }

  handleSuggestionMouseEnter(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const id = target.dataset.id;
    const index = this._suggestions.findIndex(s => s.id === id);
    
    if (index >= 0) {
      this._activeIndex = index;
    }
  }

  handleReset(): void {
    this._inputValue = "";
    this._suggestions = [];
    this._isOpen = false;
    this._activeIndex = -1;
    
    // Focus back on input
    const input = this.querySelector(`#${this._searchId}`) as HTMLInputElement;
    if (input) {
      input.focus();
    }

    this.dispatchEvent(new CustomEvent("clear", {
      bubbles: true,
      composed: true
    }));
  }

  handleFormSubmit(event: Event): void {
    event.preventDefault();
    this.submitSearch();
  }

  /* navigation methods */

  navigateDown(): void {
    if (this._suggestions.length === 0) return;

    if (this._activeIndex < this._suggestions.length - 1) {
      this._activeIndex++;
    } else {
      // Wrap to first item
      this._activeIndex = 0;
    }

    this.scrollActiveIntoView();
  }

  navigateUp(): void {
    if (this._suggestions.length === 0) return;

    if (this._activeIndex > 0) {
      this._activeIndex--;
    } else {
      // Wrap to last item
      this._activeIndex = this._suggestions.length - 1;
    }

    this.scrollActiveIntoView();
  }

  scrollActiveIntoView(): void {
    if (this._activeIndex < 0) return;

    const activeOption = this.querySelector(
      `[data-index="${this._activeIndex}"]`
    ) as HTMLElement;

    if (activeOption) {
      activeOption.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  handleEnter(): void {
    if (this._activeIndex >= 0 && this._suggestions[this._activeIndex]) {
      this.selectSuggestion(this._suggestions[this._activeIndex]);
    } else {
      this.submitSearch();
    }
  }

  /* selection methods */

  selectSuggestion(suggestion: SearchResult): void {
    this._inputValue = suggestion.label;
    this.closeSuggestions();

    this.dispatchEvent(new CustomEvent("select", {
      detail: {
        id: suggestion.id,
        label: suggestion.label,
        objectType: suggestion.objectType,
        url: suggestion.url
      },
      bubbles: true,
      composed: true
    }));
  }

  submitSearch(): void {
    this.closeSuggestions();

    this.dispatchEvent(new CustomEvent("submit", {
      detail: {
        value: this._inputValue
      },
      bubbles: true,
      composed: true
    }));
  }

  closeSuggestions(): void {
    this._isOpen = false;
    this._activeIndex = -1;
  }

  emitUpdateEvent(value: string): void {
    this._isLoading = false;
    
    this.dispatchEvent(new CustomEvent("update", {
      detail: {
        value
      },
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
