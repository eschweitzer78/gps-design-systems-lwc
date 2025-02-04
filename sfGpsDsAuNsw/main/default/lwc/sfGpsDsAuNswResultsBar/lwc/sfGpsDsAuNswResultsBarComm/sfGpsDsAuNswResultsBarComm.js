import { api, track } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api from = 1;
  @api to = 10;
  @api total = 5917;
  @api className;

  @track _value;

  /* api: sortOptions */

  _sortOptions;
  _sortOptionsOriginal;

  @api
  get sortOptions() {
    return this._sortOptionsOriginal;
  }

  set sortOptions(value) {
    this._sortOptionsOriginal = value;

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

    if (isArray(this._sortOptions)) {
      this._value = this._sortOptions[0]?.value;
    }
  }

  /* event management */

  handleChange(event) {
    this._value = event.detail;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
