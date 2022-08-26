/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswFooterComm extends SfGpsDsNavigation {
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
  @api lowerFooterClassName;

  get computedLowerFooterClassName() {
    return `nsw-footer__lower ${
      this.lowerFooterClassName ? this.lowerFooterClassName : ""
    }`;
  }

  _copyrightMentionHtml;
  _copyrightMention;

  @api get copyrightMention() {
    return this._copyrightMention;
  }

  set copyrightMention(markdown) {
    this._copyrightMention = markdown;

    try {
      this._copyrightMentionHtml = mdEngine.renderEscaped(markdown);
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
      this._builtMentionHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("BM-MD", "Issue when parsing Built mention markdown");
    }
  }

  handleClick(event) {
    if (this._map) {
      event.preventDefault();

      let index = event.currentTarget.dataset.ndx;
      let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

      if (nav && index) {
        nav.navigateNavMenu(this._map[index]);
      }
    }
  }

  // ---- rendering

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
