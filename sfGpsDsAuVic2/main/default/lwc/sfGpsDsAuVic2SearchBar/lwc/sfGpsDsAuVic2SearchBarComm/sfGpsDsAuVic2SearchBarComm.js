import { api } from "lwc";
import { isString, isArray } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const SUGGESTIONS_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api variant;
  @api autoFocus;
  @api inputLabel;
  @api submitLabel;
  @api maxSuggestionsDisplayed;
  @api placeholder;
  @api showNoResults;
  @api className;

  /* api: inputValue */

  _inputValue;
  _inputValueOriginal;

  @api
  get inputValue() {
    return this._inputValueOriginal;
  }

  set inputValue(value) {
    this._inputValueOriginal = value;
    this._inputValue = value;
  }

  /* api: suggestions */

  _suggestions = SUGGESTIONS_DEFAULT;
  _suggestionsOriginal = SUGGESTIONS_DEFAULT;

  @api
  get suggestions() {
    return this._suggestionsOriginal;
  }

  set suggestions(value) {
    this._suggestionsOriginal = value;

    if (isString(value)) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = SUGGESTIONS_DEFAULT;
        this.addError("SU-JP", "Issue when parsing suggestions as JSON.");
      }
    }

    if (isArray(value)) {
      this._suggestions = value;
    } else {
      this._suggestions = SUGGESTIONS_DEFAULT;
      this.addError("SU-AR", "Parsed suggestions are not a JSON array.");
    }
  }

  /* computed */

  get filteredSuggestions() {
    if (this._inputValue?.length > 2) {
      return this._suggestions.filter((option) =>
        option.toLowerCase().includes(this._inputValue.toLowerCase())
      );
    }

    return SUGGESTIONS_DEFAULT;
  }

  /* event management */

  handleUpdateInputValue(event) {
    this._inputValue = event.detail || "";
  }

  _submitCount = 0;

  handleSubmit() {
    this._submitCount++;
  }
}
