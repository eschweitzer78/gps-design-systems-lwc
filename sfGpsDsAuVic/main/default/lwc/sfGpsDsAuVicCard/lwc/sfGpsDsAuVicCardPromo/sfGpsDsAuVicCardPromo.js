import { api } from "lwc";
import { truncateText, computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsAuVicCard from "c/sfGpsDsAuVicCard";
import tmpl from "./sfGpsDsAuVicCardPromo.html";

export default class extends SfGpsDsAuVicCard {
  static renderMode = "light";

  @api link;
  @api summary;
  @api image;
  @api topic;
  @api displayStyle;
  @api showMeta = false;
  @api inductionYear;
  @api fvRecommendationStatus;
  @api className;

  /* computed */

  get computedClassName() {
    const classPrefix = "rpl-card-promo";
    let modifiers = this.modifiers(classPrefix);

    return computeClass({
      [classPrefix]: true,
      [modifiers]: modifiers,
      [`${classPrefix}--hide-rainbow`]: false,
      [`${classPrefix}--noimage`]:
        !this.image || this.displayStyle === "noImage",
      [`${classPrefix}--profile`]:
        this.image && this.displayStyle === "profile",
      [`${classPrefix}--thumbnail`]:
        this.image && this.displayStyle === "thumbnail",
      [this.className]: this.className
    });
  }

  get computedTrimmedSummary() {
    const summaryLength =
      this.computedShowImageSection &&
      Object.keys(this.image).length &&
      this.displayStyle === "profile"
        ? 150
        : 300;

    return this.summary ? truncateText(this.summary, summaryLength) : "";
  }

  get _topicLabel() {
    return !this.contentType && this.topic ? this.topic : "";
  }

  get computedShowImageSection() {
    return this.image && this.displayStyle !== "noImage";
  }

  get computedShowMetaSection() {
    return this.showMeta && this.isMetaInfoNotEmpty;
  }

  get computedShowPromoStatusSection() {
    return this.isContentTypeGrant && this.grantStatusData;
  }

  get computedShowFvStatusSection() {
    return this.fvRecommendationStatus && !this.isContentTypeGrant;
  }

  get computedShowDate() {
    return this.formattedDate && !this.isContentTypeGrant;
  }

  get computedShowPromoYear() {
    return this.inductionYear && !this.isContentTypeGrant;
  }

  render() {
    return tmpl;
  }
}
