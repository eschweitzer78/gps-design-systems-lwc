import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class SfGpsDsAuVic2FooterIp extends SfGpsDsNavigation {
  @api variant = "default"; // default, neutral
  @api nav;
  @api logos;
  @api credit;
  @api acknowledgement;
  @api copyright;
  @api className;

  /* links */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      /* eslint-disable-next-line no-unused-vars */
      let cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/",
          imageUrl: null,
          label: "Popular",
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue:
            "https://www.nsw.gov.au/nsw-government/about-this-website",
          imageUrl: null,
          label: "About this website",
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/departments-and-agencies",
          imageUrl: null,
          label: "Departments",
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government",
          imageUrl: null,
          label: "NSW Government",
          target: "CurrentWindow"
        }
      ]);
    }
  }

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

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

  get decoratedItems() {
    if (!this._items) return [];

    let rv = this._items.map((item) => this.mapItem(item));
    console.log(
      "*** footerIp decoratedItems",
      JSON.parse(JSON.stringify(this._items)),
      JSON.parse(JSON.stringify(rv))
    );
    return rv;
  }

  /* event management */

  handleLinksNavigate(event) {
    console.log(
      "footerIp handleLinksNavigate",
      JSON.parse(JSON.stringify(event.detail))
    );
    console.log("***", JSON.parse(JSON.stringify(this._map)));

    if (this._map && event.detail) {
      this.dispatchEvent(
        new CustomEvent("linknavigate", {
          detail: this._map[event.detail]
        })
      );
    }
  }

  handleNavNavigate(event) {
    this.dispatchEvent(
      new CustomEvent("navnavigate", {
        detail: event.detail
      })
    );
  }
}
