/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from 'lwc';
import SfGpsDsLwc from 'c/sfGpsDsLwc';
import mdEngine from 'c/sfGpsDsMarkdown';
import { replaceInnerHtml } from 'c/sfGpsDsHelpers';

export default class SfGpsDsAuNswFooterComm extends SfGpsDsLwc {
  @api statement;

  /*
   * links
   */

  @track _lowerFooterLinks;
  _originalLowerFooterLinks;

  @api get lowerFooterLinks() {
    return this._originalLowerFooterLinks;
  }

  set lowerFooterLinks(markdown) {
    this._originalLowerFooterLinks = markdown;

    try {
      this._lowerFooterLinks = markdown ? mdEngine.extractLinks(markdown) : [];
    } catch (e) {
      this.addError('LFL-MD', 'Issue when parsing Lower footer links markdown');
    }
  }

  @api lowerFooterClassName;

  get computedLowerFooterClassName() {
    return `nsw-footer__lower ${
      this.lowerFooterClassName ? this.lowerFooterClassName : ''
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
      this.addError('CM-MD', 'Issue when parsing Copyright mention markdown');
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
      this.addError('BM-MD', 'Issue when parsing Built mention markdown');
    }
  }

  // ---- rendering

  renderedCallback() {
    let element;
    if (
      (element = this.template.querySelector('.nsw-footer__copyright')) &&
      this._copyrightMentionHtml
    ) {
      replaceInnerHtml(element, this._copyrightMentionHtml);
    }

    if (
      (element = this.template.querySelector('.nsw-footer__built')) &&
      this._builtMentionHtml
    ) {
      replaceInnerHtml(element, this._builtMentionHtml);
    }
  }
}
