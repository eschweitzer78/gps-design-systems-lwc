import { LightningElement, api } from "lwc";
import { formatDate, computeClass, parseIso8601 } from "c/sfGpsDsHelpers";

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

    return date ? formatDate(date) : null;
  }

  get computedClassName() {
    return computeClass({
      "rpl-publish-date-and-author": true,
      [this.className]: this.className
    });
  }
}
