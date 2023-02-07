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

  get nav() {
    return [
      {
        text: "Your Services",
        url: "",
        children: [
          { text: "Grant awards and assistance", url: "" },
          { text: "Law and safety", url: "" }
        ]
      },
      {
        text: "About VIC Government",
        url: "",
        children: [
          { text: "Grant awards and assistance", url: "" },
          { text: "Law and safety", url: "" }
        ]
      },
      { text: "News", url: "", children: [] },
      { text: "Events", url: "", children: [] }
    ];
  }

  get socialLinks() {
    return {
      title: "Connect with us",
      children: [
        { title: "DFFH Twitter", uri: "#", icon: "twitter" },
        { title: "DFFH LinkedIn", uri: "#", icon: "linkedin" },
        { title: "DFFH Facebook", uri: "#", icon: "facebook" }
      ]
    };
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
}
