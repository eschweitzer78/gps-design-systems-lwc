/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

const MARKDOWN_SELECTOR = ".govuk-notification-banner__heading";

export default class SfGpsDsUkGovGlobalAlertComm extends SfGpsDsLwc {
  @api type;
  @api headingLevel;
  @api title;
  @api className;

  /*
   * api: content
   */

  _contentOriginal;
  _contentHtml;

  @api set content(markdown) {
    this._contentOriginal = markdown;

    try {
      if (this._contentOriginal) {
        this._contentHtml = mdEngine.renderEscapedUnpackFirstP(
          this._contentOriginal
        );
      }
    } catch (e) {
      console.log(e);
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  get content() {
    return this._contentOriginal;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("govuk-scope");
  }

  renderedCallback() {
    let element = this.template.querySelector(MARKDOWN_SELECTOR);

    if (element) {
      replaceInnerHtml(element, this._contentHtml);

      const As = element.querySelectorAll("a");
      As.forEach((a) => {
        a.classList.add("govuk-notification-banner__link");
      });
    }
  }
}
