import { LightningElement, api } from "lwc";
import {
  computeClass,
  isRTL,
  formatDate,
  isExternalUrl,
  getUserLocale
} from "c/sfGpsDsHelpers";

const DATE_STYLE_DEFAULT = "long"; // one of short medium long full, defaults to long

export default class SfGpsDsAuVicDocumentLink extends LightningElement {
  static renderMode = "light";

  @api name; //  string
  // @api caption; replaced by slot
  @api url; //  string
  @api extension; // string
  @api filesize; // number
  @api updated; // date
  @api className; // string

  get icon() {
    switch (this.extension) {
      case "ai":
      case "csv":
      case "doc":
      case "docx":
      case "dot":
      case "dotm":
      case "dotx":
      case "eps":
      case "ics":
      case "indd":
      case "pdf":
      case "ppt":
      case "pptx":
      case "tif":
      case "txt":
      case "xls":
      case "xlsx":
      case "zip":
        return this.extension;

      default:
        return "document";
    }
  }

  get lastUpdated() {
    if (this.updated) {
      const updatedText = " | Updated: ";
      const updatedDate = formatDate(
        this.updated,
        DATE_STYLE_DEFAULT,
        this._userLocale
      );
      return updatedDate.length > 0 ? updatedText + updatedDate : "";
    }

    return "";
  }

  get isExternalUrl() {
    return isExternalUrl(this.url);
  }

  get computedClassName() {
    return computeClass({
      "rpl-document-link": true,
      "rpl-document-link--rtl": isRTL(),
      [this.className]: this.className
    });
  }

  get computedAriaLabel() {
    return `${this.name} File type: ${this.extension}. Size: ${
      this.filesize
    }. ${this.isExternalLink ? "Opens in new tab" : ""}`;
  }

  get computedDownload() {
    return this.isExternalLink ? false : "";
  }

  get computedTarget() {
    return this.isExternalLink ? "_blank" : false;
  }

  get computedFilesizeClassName() {
    return computeClass({
      "rpl-document-link__size": true,
      "rpl-document-link__size--seperator": this.extension && this.filesize
    });
  }

  _userLocale;

  connectedCallback() {
    this._userLocale = getUserLocale();
  }
}
