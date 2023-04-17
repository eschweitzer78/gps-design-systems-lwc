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

  renderedCallback() {
    let element;
    if (
      (element = this.template.querySelector(".nsw-footer__copyright")) &&
      this._copyrightMentionHtml
    ) {
      replaceInnerHtml(element, this._copyrightMentionHtml);
    }

    if (
      (element = this.template.querySelector(".nsw-footer__built")) &&
      this._builtMentionHtml
    ) {
      replaceInnerHtml(element, this._builtMentionHtml);
    }
  }
}