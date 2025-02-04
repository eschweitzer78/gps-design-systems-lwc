import { LightningElement, api } from "lwc";
import { parseIso8601, getUserLocale, formatDate } from "c/sfGpsDsHelpers";

const DATE_STYLE_DEFAULT = "medium"; // one of short medium long full, defaults to medium

export default class extends LightningElement {
  @api name;
  @api url;
  @api extension;
  @api size;
  @api className;

  /* api: updated */

  _updated;
  _updatedOriginal;

  @api
  get updated() {
    return this._updatedOriginal;
  }

  set updated(date) {
    this._updatedOriginal = date;

    if (date instanceof Date) {
      this._updated = date;
    } else {
      this._updated = date ? parseIso8601(date.toString()) : null;
    }
  }

  /* computed */

  get computedHasInfo() {
    return this.extension || this.size || this.updated;
  }

  get formattedUpdated() {
    return this._updated
      ? formatDate(this._updated, DATE_STYLE_DEFAULT, this._userLocale)
      : null;
  }

  /* event management */

  handleDownload(event) {
    this.dispatchEvent(
      new CustomEvent("download", {
        detail: {
          action: event.detail.action,
          value: event.detail.value,
          text: this.name,
          type: this.extension,
          size: this.size
        },
        bubble: true
      })
    );
  }

  /* lifecycle */

  _userLocale;

  connectedCallback() {
    this._userLocale = getUserLocale();
  }
}
