import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsNavigation {
  @api statement;
  @api linkedInUrl;
  @api twitterXUrl;
  @api facebookUrl;
  @api className;

  /* api: mode, String */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      /* eslint-disable no-unused-vars */
      let cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/accessibility-statement",
          imageUrl: null,
          label: "Accessibility statement",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government/copyright",
          imageUrl: null,
          label: "Copyright",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government/disclaimer",
          imageUrl: null,
          label: "Disclaimer",
          subMenu: [],
          target: "CurrentWindow"
        }
      ]);
    }
  }

  /* api: navigationDevName, String */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName, String */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON, String */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* api: copyrightMention, String */

  _copyrightMentionHtml;
  _copyrightMentionOriginal;

  @api
  get copyrightMention() {
    return this._copyrightMentionOriginal;
  }

  set copyrightMention(markdown) {
    try {
      this._copyrightMentionOriginal = markdown;
      this._copyrightMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("CM-MD", "Issue when parsing Copyright mention markdown");
    }
  }

  /* api: builtMention */

  _builtMentionHtml;
  _builtMentionOriginal;

  @api
  get builtMention() {
    return this._builtMentionOriginal;
  }

  set builtMention(markdown) {
    try {
      this._builtMentionOriginal = markdown;
      this._builtMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("BM-MD", "Issue when parsing Built mention markdown");
    }
  }

  /* computed */

  get computedShowSocial() {
    return this.linkedInUrl || this.twitterXUrl || this.facebookUrl;
  }

  /* event management */

  handleNavClick(event) {
    if (this._map && event.detail) {
      this.refs.navsvc.navigateNavMenu(this._map[event.detail]);
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (
      !this._sfGpsDsErrors &&
      !this._isLoading &&
      this._copyrightMentionOriginal
    ) {
      replaceInnerHtml(this.refs.copyright, this._copyrightMentionHtml);
    }

    if (
      !this._sfGpsDsErrors &&
      !this._isLoading &&
      this._builtMentionOriginal
    ) {
      replaceInnerHtml(this.refs.built, this._builtMentionHtml);
    }
  }
}
