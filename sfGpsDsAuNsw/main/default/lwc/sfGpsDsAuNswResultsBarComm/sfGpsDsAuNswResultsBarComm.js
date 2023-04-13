import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuNswResultsBarComm extends SfGpsDsLwc {
  @api from = 1;
  @api to = 10;
  @api total = 5917;
  @api className;

  @track _value;

  _originalSortOptions;
  @track _sortOptions;

  @api set sortOptions(value) {
    this._originalSortOptions = value;

    if (value == null || value === "") {
      this._sortOptions = null;
      this._value = null;
      return;
    }

    try {
      this._sortOptions = JSON.parse(value);
    } catch (e) {
      this._sortOptions = value
        .toString()
        .split(";")
        .map((option) => ({
          value: option,
          label: option
        }));
    }

    if (Array.isArray(this._sortOptions)) {
      this._value = this._sortOptions[0]?.value;
    }
  }

  get sortOptions() {
    return this._originalSortOptions;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  /* events */

  handleChange(event) {
    this._value = event.detail;
  }
}
