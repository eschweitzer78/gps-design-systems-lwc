import { LightningElement, api } from "lwc";
import {
  truncateText,
  formatDate,
  formatDateRange,
  getUserLocale
} from "c/sfGpsDsHelpers";
import grantStatus from "./grant-status";

const DATE_STYLE_DEFAULT = "long"; // one of short medium long full, defaults to medium

const statusTerms = {
  open: {
    label: "Open",
    symbol: "success",
    color: "success"
  },
  closed: {
    label: "Closed",
    symbol: "cross_circle",
    color: "danger"
  },
  ongoing: {
    label: "Ongoing",
    symbol: "success",
    color: "success"
  },
  openingSoon: (startdate) => {
    return {
      label: `Opening on ${startdate}`,
      symbol: "success",
      color: "success"
    };
  },
  closingSoon: (end, now) => {
    const daysRemaining = parseInt(end.diff(now, "days"), 10);
    let label = `Open, closing today`;

    if (daysRemaining > 1) {
      label = `Open, closing in ${daysRemaining} days`;
    } else if (daysRemaining === 1) {
      label = `Open, closing in ${daysRemaining} day`;
    }

    return {
      label: label,
      symbol: "success",
      color: "success"
    };
  }
};

export default class extends LightningElement {
  @api isGrantOngoing;
  @api title;
  @api dateStart;
  @api dateEnd;
  @api contentType;
  @api displayStyle = "noImage"; // noImage, thumbnail, profile, featured

  modifiers(classPrefix = "rpl-card") {
    return `${classPrefix}--${(this.displayStyle || "")
      .replace(/\s/g, "")
      .toLowerCase()}`;
  }

  get grantStatusData() {
    if (
      this.isGrantOngoing === "1" ||
      (typeof this.isGrantOngoing === "boolean" && this.isGrantOngoing === true)
    ) {
      return statusTerms.ongoing;
    }

    return grantStatus(this.dateStart, this.dateEnd, false, statusTerms);
  }

  get trimmedTitle() {
    const titleLength = 150;
    return this.title ? truncateText(this.title, titleLength) : "";
  }

  get formattedDate() {
    if (!this.dateStart && !this.dateEnd) {
      return "";
    }

    return this.dateStart && this.dateEnd
      ? formatDateRange(
          this.dateStart,
          this.dateEnd,
          DATE_STYLE_DEFAULT,
          this._userLocale
        )
      : formatDate(this.dateStart, DATE_STYLE_DEFAULT, this._userLocale);
  }

  get isValidContentType() {
    const validContentTypes = [
      "event",
      "grant",
      "news",
      "publication",
      "publication page",
      "profile: aboriginal honour roll",
      "profile: australia day ambassador",
      "profile: victorian design review panel",
      "profile: women's honour roll",
      "recommendation - family violence"
    ];

    if (
      this.contentType &&
      validContentTypes.includes(this.contentType.toLowerCase())
    ) {
      return true;
    }

    return false;
  }

  get isContentTypeGrant() {
    return (
      this.isValidContentType && this.contentType.toLowerCase() === "grant"
    );
  }

  get contentTypeLabel() {
    if (this.showMeta && this.isValidContentType === true && this.contentType) {
      let contentType = this.contentType.split(" ");
      return contentType[0].replace(":", "");
    }

    return "";
  }

  get topicLabel() {
    if (this.showMeta && this.isValidContentType === false && this.topic) {
      return this.topic;
    }

    return "";
  }

  get isMetaInfoNotEmpty() {
    return (
      this.contentTypeLabel ||
      this.topicLabel ||
      (this.grantStatusData && this.isContentTypeGrant) ||
      this.fvRecommendationStatus ||
      this.formattedDate ||
      this.inductionYear
    );
  }

  _userLocale;

  connectedCallback() {
    this._userLocale = getUserLocale();
  }
}
