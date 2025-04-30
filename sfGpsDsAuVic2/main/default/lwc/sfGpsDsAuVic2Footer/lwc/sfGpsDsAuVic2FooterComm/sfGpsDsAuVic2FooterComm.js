import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { isObject, isArray, isString } from "c/sfGpsDsHelpers";

const LOGOS_DEFAULT = [];

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2FooterComm";

export default class extends SfGpsDsNavigation {
  @api variant;
  @api linksMode;
  @api linksNavigationDevName;
  @api linksIpName;
  @api linksInputJSON;
  @api linksOptionsJSON;
  @api credit;
  @api acknowledgement;
  @api copyright;
  @api disableFooterLogo;
  @api className;

  /* api: logos */

  _logos = LOGOS_DEFAULT;
  _logosOriginal = LOGOS_DEFAULT;

  @api
  get logos() {
    return this._logosOriginal;
  }

  set logos(value) {
    this._logosOriginal = value;

    if (value == null) {
      this._logos = LOGOS_DEFAULT;
      return;
    }

    if (isString(value)) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        this._logos = [];
        if (DEBUG) console.debug(CLASS_NAME, "set logos", e);
        return;
      }
    }

    if (isArray(value)) {
      this._logos = value;
    } else if (isObject(value)) {
      this._logos = [value];
    } else {
      this._logos = [];
    }
  }

  /* nav */

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
          actionValue: "https://www.vic.gov.au/information-and-services",
          imageUrl: null,
          label: "Information and services",
          target: "CurrentWindow",
          subMenu: [
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.betterhealth.vic.gov.au/coronavirus-covid-19-victoria",
              imageUrl: null,
              label: "Coronavirus (COVID-19) information",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/grants-and-programs",
              imageUrl: null,
              label: "Grants and programs",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/jobs-and-careers",
              imageUrl: null,
              label: "Jobs and careers",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/arts-culture-and-heritage",
              imageUrl: null,
              label: "Arts, culture and heritage",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/business-and-workplace",
              imageUrl: null,
              label: "Business and the workplace",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/communities",
              imageUrl: null,
              label: "Communities",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/education",
              imageUrl: null,
              label: "Education & training",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.vic.gov.au/environment-water-and-energy",
              imageUrl: null,
              label: "Environment, water and energy",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/health-and-social-support",
              imageUrl: null,
              label: "Health and social support",
              subMenu: [],
              target: "CurrentWindow"
            }
          ]
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.vic.gov.au/about-victorian-government",
          imageUrl: null,
          label: "About the VIC Government",
          target: "CurrentWindow",
          subMenu: [
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.vic.gov.au/victorian-government-directory",
              imageUrl: null,
              label: "Victorian Government Directory",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/premier-and-ministers",
              imageUrl: null,
              label: "The Premier and ministers",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.vic.gov.au/victorian-government-organisations",
              imageUrl: null,
              label: "Departments and agencies",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.vic.gov.au/guidelines-and-standards-for-independent-schools",
              imageUrl: null,
              label: "Standard and guidelines",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/using-victorias-data",
              imageUrl: null,
              label: "Using Victoria’s data",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.vic.gov.au/strategies-and-policies",
              imageUrl: null,
              label: "Strategies and policies",
              subMenu: [],
              target: "CurrentWindow"
            }
          ]
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

  /* methods */

  mapItem(item) {
    return {
      id: item.index,
      text: item.text,
      url: item.url,
      items: item.subNav
        ? item.subNav.map((subNavItem) => this.mapItem(subNavItem))
        : null
    };
  }

  /* event management */

  handleLinksNavigate(event) {
    const nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && event.detail) {
      nav.navigateNavMenu(event.detail);
    }
  }

  handleNavNavigate(event) {
    const nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
