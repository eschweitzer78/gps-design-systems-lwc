/*
 * Type definitions for sfGpsDsCaOnSearchComm component
 */

declare module "c/sfGpsDsCaOnSearchComm" {
  import { LightningElement } from "lwc";

  export default class SfGpsDsCaOnSearchComm extends LightningElement {
    label?: string;
    placeholder?: string;
    hintText?: string;
    searchObjects?: string;
    maxSuggestions?: number;
    debounceMs?: number;
    minChars?: number;
    noResultsText?: string;
    searchResultsPage?: string;
    navigateOnSelect?: boolean;
    className?: string;
  }
}
