/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuNswMastheadComm extends SfGpsDsLwc {
  @api arLabel = "Skip to links";
  @api nav;
  @api navLabel = "Skip to navigation";
  @api content;
  @api contentLabel = "Skip to content";
  @api cstyle;
  @api className;

  _mastheadLabelHtml;
  _mastheadLabel = "A NSW Government website";

  @api get mastheadLabel() {
    return this._mastheadLabel;
  }

  set mastheadLabel(markdown) {
    this._mastheadLabel = markdown;

    try {
      this._mastheadLabelHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing Masthead label markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  _rendered = false;

  renderedCallback() {
    if (!this._rendered && this.mastheadLabel) {
      let element = this.template.querySelector(MARKDOWN_SELECTOR);
      if (element) {
        replaceInnerHtml(element, this._mastheadLabelHtml);
      } else {
        this.addError(
          "ML-PH",
          "Couldn't find internal masthead label markdown placeholder"
        );
      }

      this._rendered = true;
    }
  }
}
