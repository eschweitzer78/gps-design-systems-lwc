import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class SfGpsDsAuVicSiteFooterComm extends SfGpsDsNavigation {
  @api acknowledgement;
  @api caption;
  @api copyright;
  @api masterbrand;
  @api masterbrandAlt;
  @api masterbrandUrl;
  @api className;

  get _masterbrand() {
    return {
      src: this.masterbrand,
      alt: this.masterbrandAlt,
      url: this.masterbrandUrl
    };
  }

  @api socialLinksTitle;

  /* api socialLinks */

  _socialLinksOriginal;
  _socialLinksArray;

  @api get socialLinks() {
    return this._socialLinksOriginal;
  }

  set socialLinks(value) {
    this._socialLinksOriginal = value;

    if (!value) {
      this._socialLinksArray = null;
      return;
    }

    try {
      let sl = JSON.parse(value);

      if (Array.isArray(sl)) {
        this._socialLinksArray = sl;
      } else {
        this.addError("SL-JA", "Social Links JSON must be an array");
        this._socialLinksArray = null;
      }
    } catch (e) {
      this.addError("SL-JF", "Issue when parsing Social Links JSON");
      this._socialLinksArray = null;
    }
  }

  get _socialLinks() {
    return { title: this.socialLinksTitle, children: this._socialLinksArray };
  }

  /* api: footerLogos array { src, alt, url } */

  _footerLogosOriginal;
  _footerLogos;

  @api get footerLogos() {
    return this._footerLogosOriginal;
  }

  set footerLogos(value) {
    this._footerLogosOriginal = value;

    if (!value) {
      this._footerLogos = null;
      return;
    }

    try {
      let fl = JSON.parse(value);

      if (Array.isArray(fl)) {
        this._footerLogos = fl;
      } else {
        this.addError("FL-JP", "FooterLogos JSON must be an array");
        this._footerLogos = null;
      }
    } catch (e) {
      this.addError("FL-JP", "Issue when parsing FooterLogos JSON");
      this._footerLogos = null;
    }
  }

  // SfGpsDsNavigation

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  @api navIpName;
  @api navInputJSON;
  @api navOptionsJSON;
}
