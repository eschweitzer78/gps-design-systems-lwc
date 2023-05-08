import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswLowerFooterIp extends SfGpsDsNavigation {
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
  @api className;

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

  handleClick(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }

  renderedCallback() {
    if (this._copyrightMention) {
      let element = this.template.querySelector(".nsw-footer__copyright");
      if (element) {
        replaceInnerHtml(element, this._copyrightMentionHtml);
      }
    }

    if (this._builtMention) {
      let element = this.template.querySelector(".nsw-footer__built");
      if (element) {
        replaceInnerHtml(element, this._builtMentionHtml);
      }
    }
  }
}
