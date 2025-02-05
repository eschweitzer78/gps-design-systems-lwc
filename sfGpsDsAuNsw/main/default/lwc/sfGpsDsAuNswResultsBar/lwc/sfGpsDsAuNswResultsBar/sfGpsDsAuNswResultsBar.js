import { LightningElement, api } from "lwc";
import { uniqueId, isArray, formatTemplate } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api name;
  @api from;
  @api to;
  @api total;
  @api className;

  @api noResultText = "Sorry, no results found for your search";
  @api resultsText = "Showing results {from} - {to} of {total} results";

  /* api: value */

  _value;
  _valueOriginal;

  @api set value(value) {
    this._valueOriginal = value;
    this._value = value;

    this.reconcileValueOptions();
  }

  get value() {
    return this._valueOriginal;
  }

  /* api: sortOptions */

  _sortOptions;
  _sortOptionsOriginal;
  _visibleSortOptions;

  @api
  get sortOptions() {
    return this._sortOptionsOriginal;
  }

  set sortOptions(value) {
    this._sortOptionsOriginal = value;

    if (value == null) {
      this._sortOptions = null;
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.value = null;
    } else if (isArray(value)) {
      this._sortOptions = value;
    } else {
      this._sortOptions = [value];
    }

    this.reconcileValueOptions();
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-results-bar": true,
      [this.className]: this.className
    };
  }

  _selectId;

  get computedSelectId() {
    if (this._selectId === undefined) {
      this._selectId = uniqueId("sf-gps-ds-au-nsw-results-bar-select");
    }

    return this._selectId;
  }

  get _resultsText() {
    return this.resultsText
      ? formatTemplate(this.resultsText, {
          from: this.from.toString(),
          to: this.to.toString(),
          total: this.total.toString()
        })
      : null;
  }

  /* methods */

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

  /* event management */

  handleSelectChange(event) {
    event.preventDefault();
    event.stopPropagation();

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = event.target.value;

    this.dispatchEvent(
      new CustomEvent("change", { detail: event.target.value })
    );
  }
}
