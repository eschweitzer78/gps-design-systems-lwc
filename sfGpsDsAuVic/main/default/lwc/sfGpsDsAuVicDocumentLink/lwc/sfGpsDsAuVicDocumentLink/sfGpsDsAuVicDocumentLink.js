import { LightningElement, api } from "lwc";
import {
  computeClass,
  isRTL,
  formatDate,
  isExternalUrl,
  getUserLocale
} from "c/sfGpsDsHelpers";

const DATE_STYLE_DEFAULT = "long"; // one of short medium long full, defaults to long

export default class extends LightningElement {
  static renderMode = "light";

  @api name; //  string
  // @api caption; replaced by slot
  @api extension; // string
  @api filesize; // number
  @api updated; // date
  @api className; // string

  /* api: url */

  _url;
  _isExternalLink = false;

  @api
  get url() {
    return this._url;
  }

  set url(value) {
    this._url = value;
    this._isExternalLink = isExternalUrl(value);
  }

  /* computed */

  get computedIcon() {
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

  get computedLastUpdated() {
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

  get computedClassName() {
    return {
      "rpl-document-link": true,
      "rpl-document-link--rtl": isRTL(),
      [this.className]: this.className
    };
  }

  get computedAriaLabel() {
    return `${this.name} File type: ${this.extension}. Size: ${
      this.filesize
    }. ${this._isExternalLink ? "Opens in new tab" : ""}`;
  }

  get computedDownload() {
    return this._isExternalLink ? false : "";
  }

  get computedTarget() {
    return this._isExternalLink ? "_blank" : false;
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
