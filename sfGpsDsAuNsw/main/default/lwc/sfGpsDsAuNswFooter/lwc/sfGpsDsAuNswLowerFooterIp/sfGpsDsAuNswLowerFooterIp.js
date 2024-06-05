import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswLowerFooterIp extends SfGpsDsNavigation {
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

  @api statement;
  @api linkedInUrl;
  @api twitterXUrl;
  @api facebookUrl;

  _copyrightMentionHtml;
  _copyrightMention;

  @api get copyrightMention() {
    return this._copyrightMention;
  }

  set copyrightMention(markdown) {
    this._copyrightMention = markdown;

    try {
      this._copyrightMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("CM-MD", "Issue when parsing Copyright mention markdown");
    }
  }

  _builtMentionHtml;
  _builtMention;

  @api get builtMention() {
    return this._builtMention;
  }

  set builtMention(markdown) {
    this._builtMention = markdown;

    try {
      this._builtMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("BM-MD", "Issue when parsing Built mention markdown");
    }
  }

  @api className;

  get computedShowSocial() {
    return this.linkedInUrl || this.twitterXUrl || this.facebookUrl;
  }

  handleClick(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }

  renderedCallback() {
    if (!this._sfGpsDsErrors && !this._isLoading && this._copyrightMention) {
      replaceInnerHtml(this.refs.copyright, this._copyrightMentionHtml);
    }

    if (!this._sfGpsDsErrors && !this._isLoading && this._builtMention) {
      replaceInnerHtml(this.refs.built, this._builtMentionHtml);
    }
  }
}
