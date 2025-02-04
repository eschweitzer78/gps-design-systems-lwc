import { api } from "lwc";
import { truncateText, normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsAuVicCard from "c/sfGpsDsAuVicCard";

import tmpl from "./sfGpsDsAuVicCardNav.html";

const SHOWMETA_DEFAULT = false;

export default class extends SfGpsDsAuVicCard {
  static renderMode = "light";

  @api link; // { text url }
  @api summary;
  @api image;
  @api topic;
  @api authors;
  @api inductionYear;
  @api fvRecommendationStatus;
  @api className;

  /* api: showMeta */

  _showMeta = SHOWMETA_DEFAULT;
  _showMetaOriginal = SHOWMETA_DEFAULT;

  @api
  get showMeta() {
    return this._showMetaOriginal;
  }

  set showMeta(value) {
    this._showMetaOriginal = value;
    this._showMeta = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWMETA_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    const classPrefix = "rpl-card-nav";
    let modifiers = this.modifiers(classPrefix);

    return computeClass({
      [classPrefix]: true,
      [modifiers]: modifiers,
      [this.className]: this.className
    });
  }

  get computedTrimmedSummary() {
    const summaryLength =
      this.computedShowImageSection && Object.keys(this.image).length
        ? 200
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
    return this._showMeta && this.isMetaInfoNotEmpty;
  }

  get computedShowStatusSection() {
    return this.isContentTypeGrant && this.grantStatusData;
  }

  get computedShowFvStatusSection() {
    return this.fvRecommendationStatus && !this.isContentTypeGrant;
  }

  get computedShowDate() {
    return this.formattedDate && !this.isContentTypeGrant;
  }

  get computedShowYear() {
    return this.inductionYear && !this.isContentTypeGrant;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
