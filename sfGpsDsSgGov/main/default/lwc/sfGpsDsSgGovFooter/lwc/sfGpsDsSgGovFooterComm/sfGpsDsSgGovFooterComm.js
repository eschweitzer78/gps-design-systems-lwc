import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import mdEngine from "c/sfGpsDsMarkdown";

const REPORTVULNERABILITYLINK_DEFAULT = { text: null, url: null };
const CONTACTLINK_DEFAULT = { text: null, url: null };
const FEEDBACKLINK_DEFAULT = { text: null, url: null };
const PRIVACYLINK_DEFAULT = { text: null, url: null };
const TERMSOFUSELINK_DEFAULT = { text: null, url: null };

export default class extends SfGpsDsNavigation {
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
          actionType: "MenuLabel",
          actionValue: null,
          imageUrl: null,
          label: null,
          target: null,
          subMenu: [
            {
              actionType: "InternalLink",
              actionValue: "#aboutus",
              imageUrl: null,
              label: "About Us",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "InternalLink",
              actionValue: "#components",
              imageUrl: null,
              label: "Components",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "InternalLink",
              actionValue: "#patterns",
              imageUrl: null,
              label: "Patterns",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "InternalLink",
              actionValue: "#templates",
              imageUrl: null,
              label: "Templates",
              subMenu: [],
              target: "CurrentWindow"
            },
            {
              actionType: "InternalLink",
              actionValue: "#faqs",
              imageUrl: null,
              label: "FAQs",
              subMenu: [],
              target: "CurrentWindow"
            }
          ]
        },
        {
          actionType: "MenuLabel",
          actionValue: null,
          imageUrl: null,
          label: null,
          target: null,
          subMenu: [
            {
              actionType: "ExternalLink",
              actionValue:
                "https://www.nsw.gov.au/nsw-government/access-nsw-government-information",
              imageUrl: null,
              label: "GitHub Repo",
              subMenu: [],
              target: "NewWindow"
            },
            {
              actionType: "ExternalLink",
              actionValue: "https://www.nsw.gov.au/accessibility-statement",
              imageUrl: null,
              label: "Singapore Government Developer Portal",
              subMenu: [],
              target: "NewWindow"
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

  @api title;
  @api description;
  @api copyrightLiner;
  @api lastUpdate;
  @api className;

  /*
   * api: reportVulnerabilityLink
   */

  _reportVulnerabilityLink = REPORTVULNERABILITYLINK_DEFAULT;
  _reportVulnerabilityLinkOriginal;

  @api
  get reportVulnerabilityLink() {
    return this._reportVulnerabilityLinkOriginal;
  }

  set reportVulnerabilityLink(markdown) {
    try {
      this._reportVulnerabilityLinkOriginal = markdown;
      this._reportVulnerabilityLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError(
        "ML-MD",
        "Issue when parsing Report vulnerability link markdown"
      );
      this._reportVulnerabilityLink = REPORTVULNERABILITYLINK_DEFAULT;
    }
  }

  /*
   * api: contactLink
   */

  _contactLink = CONTACTLINK_DEFAULT;
  _contactLinkOriginal;

  @api
  get contactLink() {
    return this._contactLinkOriginal;
  }

  set contactLink(markdown) {
    try {
      this._contactLinkOriginal = markdown;
      this._contactLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing Contact link markdown");
      this._contactLink = CONTACTLINK_DEFAULT;
    }
  }

  /* api: feedbackLink */

  _feedbackLink = FEEDBACKLINK_DEFAULT;
  _feedbackLinkOriginal;

  @api
  get feedbackLink() {
    return this._feedbackLinkOriginal;
  }

  set feedbackLink(markdown) {
    try {
      this._feedbackLinkOriginal = markdown;
      this._feedbackLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing Feedback link markdown");
      this._feedbackLink = FEEDBACKLINK_DEFAULT;
    }
  }

  /*
   * api: privacyLink
   */

  _privacyLink = PRIVACYLINK_DEFAULT;
  _privacyLinkOriginal;

  @api
  get privacyLink() {
    return this._privacyLinkOriginal;
  }

  set privacyLink(markdown) {
    try {
      this._privacyLinkOriginal = markdown;
      this._privacyLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing Privacy link markdown");
      this._privacyLink = PRIVACYLINK_DEFAULT;
    }
  }

  /* api: termsOfUseLink */

  _termsOfUseLink = TERMSOFUSELINK_DEFAULT;
  _termsOfUseLinkOriginal;

  @api
  get termsOfUseLink() {
    return this._termsOfUseLinkOriginal;
  }

  set termsOfUseLink(markdown) {
    try {
      this._termsOfUseLinkOriginal = markdown;
      this._termsOfUseLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing Terms of use link markdown");
      this._termsOfUseLink = TERMSOFUSELINK_DEFAULT;
    }
  }

  /* computed */

  get _mediatedItems() {
    return this.mediateItems(this._items);
  }

  /* methods */

  mediateItems(nav) {
    return nav.map((item) => {
      const rv = {
        index: item.index,
        label: item.text,
        title: item.text,
        href: item.url,
        external: item.target === "NewWindow"
      };

      if (item.subNav) {
        rv.links = this.mediateItems(item.subNav);
      }

      return rv;
    });
  }

  /* event management */

  handleNavClick(event) {
    const nav = this.refs.navservice;

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }
}
