import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVic2SearchBarComm extends SfGpsDsLwc {
  @api variant;
  @api autoFocus;
  @api inputLabel;
  @api submitLabel;
  @api maxSuggestionsDisplayed;
  @api placeholder;
  @api showNoResults;
  @api className;

  /* api: inputValue */

  _inputValueOriginal;
  _inputValue;

  @api get inputValue() {
    return this._inputValueOriginal;
  }

  set inputValue(value) {
    this._inputValueOriginal = value;
    this._inputValue = value;
  }

  /* api: suggestions */

  _suggestionsOriginal = [];
  _suggestions = [];

  @api get suggestions() {
    return this._suggestionsOriginal;
  }

  set suggestions(value) {
    this._suggestionsOriginal = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = [];
        this.addError("SU-JP", "Issue when parsing suggestions as JSON.");
      }
    }

    if (Array.isArray(value)) {
      this._suggestions = value;
    } else {
      this._suggestions = [];
      this.addError("SU-AR", "Parsed suggestions are not a JSON array.");
    }
  }

  get filteredSuggestions() {
    if (this._inputValue?.length > 2) {
      return this._suggestions.filter((option) =>
        option.toLowerCase().includes(this._inputValue.toLowerCase())
      );
    }

    return [];
  }

  handleUpdateInputValue(event) {
    this._inputValue = event.detail || "";
  }
}
