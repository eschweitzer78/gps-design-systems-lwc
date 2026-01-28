/*
 * Type definitions for sfGpsDsCaOnSearch component
 */

declare module "c/sfGpsDsCaOnSearch" {
  import { LightningElement } from "lwc";

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

  export default class SfGpsDsCaOnSearch extends LightningElement {
    label?: string;
    placeholder?: string;
    hintText?: string;
    maxSuggestions?: number;
    debounceMs?: number;
    minChars?: number;
    noResultsText?: string;
    className?: string;
    suggestions: SearchResult[];
    inputValue: string;
  }
}
