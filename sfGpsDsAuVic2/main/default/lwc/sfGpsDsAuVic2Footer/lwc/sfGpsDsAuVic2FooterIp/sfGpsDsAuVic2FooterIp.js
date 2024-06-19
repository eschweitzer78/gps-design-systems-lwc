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
          actionValue: "https://www.vic.gov.au/privacy-vicgovau",
          imageUrl: null,
          label: "Privacy",
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.vic.gov.au/disclaimer",
          imageUrl: null,
          label: "Disclaimer",
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.vic.gov.au/accessibility",
          imageUrl: null,
          label: "Accessibility",
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://vic.gov.au/sitemap",
          imageUrl: null,
          label: "Sitemap",
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

    return this._items.map((item) => this.mapItem(item));
  }

  /* event management */

  handleLinksNavigate(event) {
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
