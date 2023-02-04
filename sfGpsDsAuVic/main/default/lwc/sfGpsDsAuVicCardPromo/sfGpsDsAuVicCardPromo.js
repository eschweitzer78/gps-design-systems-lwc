import { api } from "lwc";
import { computeClass, truncateText } from "c/sfGpsDsHelpers";
import SfGpsDsAuVicCard from "c/sfGpsDsAuVicCard";

import tmpl from "./sfGpsDsAuVicCardPromo.html";

export default class SfGpsDsAuVicCardPromo extends SfGpsDsAuVicCard {
  static renderMode = "light";

  @api link;
  @api summary;
  @api image;
  @api topic;
  @api showMeta = false;
  @api inductionYear;
  @api fvRecommendationStatus;
  @api className;

  get computedClassName() {
    const classPrefix = "rpl-card-promo";
    let modifiers = this.modifiers(classPrefix);

    return computeClass({
      [classPrefix]: true,
      [modifiers]: modifiers,
      [`${classPrefix}--hide-rainbow`]: false,
      [`${classPrefix}--noimage`]: !this.image,
      [this.className]: this.className
    });
  }

  get trimmedSummary() {
    let summaryLength = 300;
    if (
      this.showImageSection &&
      Object.keys(this.image).length &&
      this.displayStyle === "profile"
    ) {
      summaryLength = 150;
    }

    return this.summary ? truncateText(this.summary, summaryLength) : "";
  }

  get topicLabel() {
    return !this.contentType && this.topic ? this.topic : "";
  }

  get showImageSection() {
    return this.image;
  }

  get showMetaSection() {
    return this.showMeta && this.isMetaInfoNotEmpty;
  }

  get showPromoStatusSection() {
    return this.isContentTypeGrant && this.grantStatusData;
  }

  get showFvStatusSection() {
    return this.fvRecommendationStatus && !this.isContentTypeGrant;
  }

  get showDate() {
    return this.formattedDate && !this.isContentTypeGrant;
  }

  get showPromoYear() {
    return this.inductionYear && !this.isContentTypeGrant;
  }

  render() {
    return tmpl;
  }
}
