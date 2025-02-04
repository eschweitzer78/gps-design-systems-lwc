import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { isArray } from "c/sfGpsDsHelpers";

const SOCIALLINKS_DEFAULT = [];

export default class extends SfGpsDsNavigation {
  @api acknowledgement;
  @api caption;
  @api copyright;
  @api masterbrand;
  @api masterbrandAlt;
  @api masterbrandUrl;
  @api className;
  @api socialLinksTitle;
  @api navIpName;
  @api navInputJSON;
  @api navOptionsJSON;

  /* api: socialLinks */

  _socialLinksArray = SOCIALLINKS_DEFAULT;
  _socialLinksOriginal = SOCIALLINKS_DEFAULT;

  @api
  get socialLinks() {
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

      if (isArray(sl)) {
        this._socialLinksArray = sl;
      } else {
        this.addError("SL-JA", "Social Links JSON must be an array");
        this._socialLinksArray = SOCIALLINKS_DEFAULT;
      }
    } catch (e) {
      this.addError("SL-JF", "Issue when parsing Social Links JSON");
      this._socialLinksArray = SOCIALLINKS_DEFAULT;
    }
  }

  /* api: footerLogos array { src, alt, url } */

  _footerLogos;
  _footerLogosOriginal;

  @api
  get footerLogos() {
    return this._footerLogosOriginal;
  }

  set footerLogos(value) {
    this._footerLogosOriginal = value;

    if (!value) {
      this._footerLogos = null;
      return;
    }

    try {
      const fl = JSON.parse(value);

      if (isArray(fl)) {
        this._footerLogos = fl;
      } else {
        this.addError("FL-JP", "FooterLogos must be a JSON array");
        this._footerLogos = null;
      }
    } catch (e) {
      this.addError("FL-JP", "Issue when parsing FooterLogos JSON");
      this._footerLogos = null;
    }
  }

  /* api: mode */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;
  }

  /* api: navigationDevName */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName -- SfGpsDsNavigation */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* computed */

  get computedMasterbrand() {
    return {
      src: this.masterbrand,
      alt: this.masterbrandAlt,
      url: this.masterbrandUrl
    };
  }

  get computedSocialLinks() {
    return { title: this.socialLinksTitle, children: this._socialLinksArray };
  }
}
