import { LightningElement, api, track } from "lwc";
import { parseIso8601, computeClass } from "c/sfGpsDsHelpers";

const DATE_STYLE_DEFAULT = "medium"; // one of short medium long full, defaults to full

export default class SfGpsDsAuNswListItem extends LightningElement {
  @api isBlock = false;
  @api isReversed = false;
  @api showLink = false;

  @api label;
  @api link;
  @api title;
  @api image;
  @api imageAlt;

  @api tags;

  @api className;
  @api preventClickDefault = false;

  /*
   * date
   */

  @track _date;
  _originalDate;

  @api get date() {
    return this._originalDate;
  }

  set date(date) {
    this._originalDate = date;

    if (date instanceof Date) {
      this._date = date;
    } else {
      this._date = date ? parseIso8601(date.toString()) : null;
    }
  }

  get _dateISOString() {
    return this._date ? this._date.toISOString() : null;
  }

  get _dateLocaleString() {
    return this._date
      ? this._date.toLocaleDateString(undefined, {
          dateStyle: this.dateStyle || DATE_STYLE_DEFAULT
        })
      : null;
  }

  get computedClassName() {
    return computeClass({
      "nsw-list-item": true,
      "nsw-list-item--block": this.isBlock,
      "nsw-list-item--reversed": this.isReversed,
      [this.className]: this.className
    });
  }

  handleClick(event) {
    if (this.preventClickDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("navigate", { detail: this.link }));
  }
}
