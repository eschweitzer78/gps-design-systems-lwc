import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsUkGovLowerFooterIp extends SfGpsDsNavigation {
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

  @api className;

  /* api: licenceMention */

  _licenceMentionHtml;
  _licenceMentionOriginal;

  @api
  get licenceMention() {
    return this._licenceMentionOriginal;
  }

  set licenceMention(markdown) {
    this._licenceMentionOriginal = markdown;

    try {
      this._licenceMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("LM-MD", "Issue when parsing Licence mention markdown");
    }
  }

  /* api: copyrightMention */

  _copyrightMentionLink;
  _copyrightMentionOriginal;

  @api
  get copyrightMention() {
    return this._copyrightMentionOriginal;
  }

  set copyrightMention(markdown) {
    this._copyrightMentionOriginal = markdown;

    try {
      this._copyrightMentionLink = mdEngine.extractFirstLink(markdown);
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
    this._builtMentionOriginal = markdown;

    try {
      this._builtMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("BM-MD", "Issue when parsing Built mention markdown");
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this._licenceMentionOriginal) {
      let element = this.template.querySelector(
        ".govuk-footer__licence-description"
      );
      if (element) {
        replaceInnerHtml(element, this._licenceMentionHtml);

        const As = element.querySelectorAll("a");
        As.forEach((a) => {
          a.classList.add("govuk-footer__link");
          a.rel = "licensing";
        });
      }
    }

    if (this._builtMentionOriginal) {
      let element = this.template.querySelector(".govuk-footer__built");
      if (element) {
        replaceInnerHtml(element, this._builtMentionHtml);

        const As = element.querySelectorAll("a");
        As.forEach((a) => {
          a.classList.add("govuk-footer__link");
        });
      }
    }
  }

  /* event management */

  handleClick(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }
}
