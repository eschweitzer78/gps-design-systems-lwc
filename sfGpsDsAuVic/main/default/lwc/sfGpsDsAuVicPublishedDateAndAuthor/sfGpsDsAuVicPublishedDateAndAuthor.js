import { LightningElement, api } from "lwc";
import {
  formatDate,
  computeClass,
  parseIso8601,
  getUserLocale
} from "c/sfGpsDsHelpers";

const DATE_STYLE_DEFAULT = "long"; // one of short medium long full, defaults to long

export default class SfGpsDsAuVicPublishedDateAndAuthor extends LightningElement {
  static renderMode = "light";

  @api date; // string in iso format, tolerate date too
  @api locationPrefix = "from";
  @api location;
  @api authorPrefix = "Published by";
  @api author;
  @api className;

  get formattedDate() {
    var date;

    switch (typeof this.date) {
      case "date":
        date = this.date;
        break;

      case "string":
        date = parseIso8601(this.date);
        break;

      default:
        break;
    }

    return date ? formatDate(date, DATE_STYLE_DEFAULT, this._userLocale) : null;
  }

  get computedClassName() {
    return computeClass({
      "rpl-publish-date-and-author": true,
      [this.className]: this.className
    });
  }

  _userLocale;

  connectedCallback() {
    this._userLocale = getUserLocale();
  }
}
