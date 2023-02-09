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
          { text: "Coronavirus (COVID-19) information", url: "" },
          { text: "Grants and programs", url: "" },
          { text: "Jobs and careers", url: "" },
          { text: "Arts and sports", url: "" },
          { text: "Business and the workplace", url: "" },
          { text: "Communities", url: "" },
          { text: "Education", url: "" },
          { text: "Environment, water and energcy", url: "" },
          { text: "Health and social support", url: "" },
          { text: "Housing and property", url: "" },
          { text: "Law and justice", url: "" },
          { text: "Safety and emergencies", url: "" },
          { text: "Traffic and transport", url: "" },
          { text: "Working in the Victorian Government", url: "" }
        ]
      },
      {
        text: "About VIC Government",
        url: "",
        children: [
          { text: "Victoria Government Directory", url: "" },
          { text: "The Premier and ministers", url: "" },
          { text: "Departments and agencies", url: "" },
          { text: "Standards and guidelines", url: "" },
          { text: "Budget, procurement and funding", url: "" },
          { text: "Using Victoria's data", url: "" },
          { text: "Strategies and policies", url: "" },
          { text: "Inquiries and royal commissions", url: "" },
          { text: "Victoria's free public wi-fi", url: "" }
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
        { title: "DH Twitter", uri: "#", icon: "twitter" },
        { title: "DFFH LinkedIn", uri: "#", icon: "linkedin" },
        { title: "DFFH Facebook", uri: "#", icon: "facebook" },
        { title: "Youtube", uri: "#", icon: "youtube_channel" }
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

  @api navIpName;
  @api navInputJSON;
  @api navOptionsJSON;
}
