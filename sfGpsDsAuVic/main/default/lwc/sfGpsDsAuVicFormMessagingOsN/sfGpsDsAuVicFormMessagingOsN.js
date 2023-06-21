/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMessaging from "omnistudio/omniscriptMessaging";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { computeClass, replaceInnerHtml } from "c/sfGpsDsHelpersOs";
import mdEngine from "c/sfGpsDsMarkdownOs";

import tmpl from "./sfGpsDsAuVicFormMessagingOsN.html";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuVicFormMessagingOsN extends OmniscriptMessaging {
  render() {
    return tmpl;
  }

  get mergedTitleText() {
    let splitText = this.messageText.split("\\n");
    return splitText.length > 1
      ? omniGetMergedField(this, splitText[0])
      : this.messageType;
  }

  get mergedMessageText() {
    let splitText = this.messageText.split("\\n");
    return omniGetMergedField(
      this,
      splitText.length > 1 ? splitText.slice(1).join("\\n") : this.messageText
    );
  }

  get _messageTextHtml() {
    let mmt = this.mergedMessageText;

    if (mmt) {
      try {
        return this.isCompact
          ? mdEngine.renderEscapedUnpackFirstP(mmt)
          : mdEngine.renderEscaped(mmt);
      } catch (e) {
        return "<p>IN-MD Issue when parsing Text markdown</p>";
      }
    }

    return "";
  }

  get isCompact() {
    return this.messageText.split("\\n").length <= 2;
  }

  get isSuccess() {
    return this.messageType === "Success";
  }

  get isRequirement() {
    return this.messageType === "Requirement";
  }

  get isComment() {
    return this.messageType === "Comment";
  }

  get isWarning() {
    return this.messageType === "Warning";
  }

  get computedAlertBaseClassName() {
    return computeClass({
      "rpl-alert-base": true,
      "rpl-alert-base--color-primary": this.isComment,
      "rpl-alert-base--color-warning": this.isWarning,
      "rpl-alert-base--color-danger": this.isRequirement,
      "rpl-alert-base--color-success": this.isSuccess
    });
  }

  /* lifecycle */

  renderedCallback() {
    super.renderedCallback();

    let element;
    let mth = this._messageTextHtml;

    if (mth) {
      if ((element = this.template.querySelector(MARKDOWN_SELECTOR))) {
        replaceInnerHtml(element, mth);
      } else {
        console.log(
          "CO-PH",
          "Couldn't find internal intro markdown placeholder"
        );
      }
    }
  }
}
