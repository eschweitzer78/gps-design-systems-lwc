import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswResultsBar extends LightningElement {
  @api name;
  @api from;
  @api to;
  @api total;

  _originalValue;
  _value;
  @api set value(value) {
    this._originalValue = value;
    this._value = value;

    this.reconcileValueOptions();
  }

  get value() {
    return this._originalValue;
  }

  _originalSortOptions;
  _sortOptions;
  @track _visibleSortOptions;

  @api set sortOptions(value) {
    this._originalSortOptions = value;

    if (value == null) {
      this._sortOptions = null;
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.value = null;
    } else if (Array.isArray(value)) {
      this._sortOptions = value;
    } else {
      this._sortOptions = [value];
    }

    this.reconcileValueOptions();
  }

  get sortOptions() {
    return this._originalSortOptions;
  }

  @api noResultText = "Sorry, no results found for your search";
  @api resultsText = "Showing results {from} - {to} of {total} results";
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-results-bar": true,
      [this.className]: this.className
    });
  }

  /**********/

  reconcileValueOptions() {
    if (this._sortOptions == null) {
      this._visibleSortOptions = null;
      return;
    }

    if (this._value == null && this._sortOptions[0]) {
      this._value = this._sortOptions[0].value;
    }

    this._visibleSortOptions = this._sortOptions.map((option) => ({
      ...option,
      selected: option.value === this._value
    }));
  }

  get _resultsText() {
    if (this.resultsText == null) {
      return null;
    }

    return this.resultsText
      .replace("{from}", this.from.toString())
      .replace("{to}", this.to.toString())
      .replace("{total}", this.total.toString());
  }

  handleSelectChange(event) {
    event.preventDefault();

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = event.target.value;
    this.dispatchEvent(
      new CustomEvent("change", { detail: event.target.value })
    );
  }
}
