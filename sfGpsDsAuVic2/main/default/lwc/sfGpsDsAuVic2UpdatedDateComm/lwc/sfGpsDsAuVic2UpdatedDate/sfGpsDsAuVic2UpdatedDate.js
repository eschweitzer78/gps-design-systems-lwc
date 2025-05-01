import { LightningElement, api } from "lwc";
import {
  formatDate,
  isDate,
  isString,
  parseIso8601,
  isValidDate
} from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api className;

  /* api: date */

  _date;
  _dateOriginal;
  _dateFormatted;
  _dateIsoString;

  @api
  get date() {
    return this._dateOriginal;
  }

  set date(value) {
    this._dateOriginal = value;

    if (isDate(value)) {
      this._date = value;
    } else {
      this._date = parseIso8601(isString(value) ? value : value?.toString());
    }

    if (isValidDate(this._date)) {
      this._dateFormatted = formatDate(this._date, "long");
      this._dateIsoString = this._date.toISOString();
    } else {
      this._date = null;
      this._dateFormatted = null;
      this._dateIsoString = null;
    }
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-type-p-small": true,
      "rpl-u-margin-t-6": true,
      "rpl-updated-date": true,
      [this.className]: this.className
    };
  }
}
