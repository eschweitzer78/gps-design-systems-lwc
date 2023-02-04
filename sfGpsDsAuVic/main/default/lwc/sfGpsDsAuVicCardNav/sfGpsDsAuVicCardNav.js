import { api } from "lwc";
import { computeClass, truncateText } from "c/sfGpsDsHelpers";
import SfGpsDsAuVicCard from "c/sfGpsDsAuVicCard";

import tmpl from "./sfGpsDsAuVicCardNav.html";

export default class SfGpsDsAuVicCardContent extends SfGpsDsAuVicCard {
  static renderMode = "light";

  @api link; // { text url }
  @api summary;
  @api image;
  @api topic;
  @api showMeta = false;
  @api authors;
  @api inductionYear;
  @api fvRecommendationStatus;
  @api className;

  get computedClassName() {
    const classPrefix = "rpl-card-nav";
    let modifiers = this.modifiers(classPrefix);

    return computeClass({
      [classPrefix]: true,
      [modifiers]: modifiers,
      [this.className]: this.className
    });
  }

  get trimmedSummary() {
    let summaryLength = 300;
    // if (this.image && Object.keys(this.image).length) {
    if (this.showImageSection && Object.keys(this.image).length) {
      summaryLength = 200;
    }

    return this.summary ? truncateText(this.summary, summaryLength) : "";
  }

  get topicLabel() {
    return !this.contentType && this.topic ? this.topic : "";
  }

  get showImageSection() {
    return this.image && this.displayStyle !== "noImage";
  }

  get showMetaSection() {
    return this.showMeta && this.isMetaInfoNotEmpty;
  }

  get showStatusSection() {
    return this.isContentTypeGrant && this.grantStatusData;
  }

  get showFvStatusSection() {
    return this.fvRecommendationStatus && !this.isContentTypeGrant;
  }

  get showDate() {
    return this.formattedDate && !this.isContentTypeGrant;
  }

  get showYear() {
    return this.inductionYear && !this.isContentTypeGrant;
  }

  get showAuthors() {
    return this.authors;
  }

  render() {
    return tmpl;
  }
}
