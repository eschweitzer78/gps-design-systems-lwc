import { api, track } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class SfGpsDsAuVicSiteFooterComm extends SfGpsDsNavigation {
  @api acknowledgement;
  @api caption;
  @api copyright;

  @track _masterbrand = {
    src: null,
    alt: null,
    url: null
  };

  @api set masterbrand(value) {
    this._masterbrand.src = value;
  }

  get masterbrand() {
    return this._masterbrand.src;
  }

  @api set masterbrandAlt(value) {
    this._masterbrand.alt = value;
  }

  get masterbrandAlt() {
    return this._masterbrand.alt;
  }

  @api set masterbrandUrl(value) {
    this._masterbrand.url = value;
  }

  get masterbrandUrl() {
    return this._masterbrand.url;
  }

  @api className;

  get nav() {
    return [
      {
        text: "Your Services",
        url: "#",
        children: [
          { text: "Grant awards and assistance", url: "# " },
          { text: "Law and safety", url: "#" }
        ]
      },
      {
        text: "About VIC Government",
        url: "#",
        children: [
          { text: "Grant awards and assistance", url: "# " },
          { text: "Law and safety", url: "#" }
        ]
      },
      { text: "News", url: "#", children: [] },
      { text: "Events", url: "#", children: [] }
    ];
  }

  get links() {
    return [
      { text: "Privacy", url: "#" },
      { text: "Disclaimer", url: "#" }
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

  get footerLogos() {
    return [
      {
        src: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22112%22%20height%3D%2252%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20112%2052%22%20preserveAspectRatio%3D%22none%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%20%20%20%20%20%20%20%20%23holder%20text%20%7B%0A%20%20%20%20%20%20%20%20%20%20fill%3A%20rgb(150%2C%20150%2C%20150)%3B%0A%20%20%20%20%20%20%20%20%20%20font-family%3A%20Arial%2C%20sans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20font-size%3A%208.666666666666666px%3B%0A%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20id%3D%22holder%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22rgb(204%2C%20204%2C%20204)%22%3E%3C%2Frect%3E%0A%20%20%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%3E112%20x%2052%3C%2Ftext%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fsvg%3E",
        alt: "Max native size",
        url: "#"
      },
      {
        src: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2032%2032%22%20preserveAspectRatio%3D%22none%22%3E%0A%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%20%20%20%20%20%20%20%20%23holder%20text%20%7B%0A%20%20%20%20%20%20%20%20%20%20fill%3A%20rgb(150%2C%20150%2C%20150)%3B%0A%20%20%20%20%20%20%20%20%20%20font-family%3A%20Arial%2C%20sans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20font-size%3A%205.333333333333333px%3B%0A%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%3Cg%20id%3D%22holder%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22rgb(204%2C%20204%2C%20204)%22%3E%3C%2Frect%3E%0A%20%20%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%3E32%20x%2032%3C%2Ftext%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fsvg%3E",
        alt: "Smaller than max size",
        url: "#"
      }
    ];
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
