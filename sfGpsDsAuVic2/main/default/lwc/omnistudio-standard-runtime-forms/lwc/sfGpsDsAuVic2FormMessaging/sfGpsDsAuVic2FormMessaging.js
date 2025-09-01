/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMessaging from "c/sfGpsDsFormMessaging";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixin";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";
import { computeClass, replaceInnerHtml } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

import tmpl from "./sfGpsDsAuVic2FormMessaging.html";

export default class extends SfGpsDsAuVic2FormElementMixin(
  SfGpsDsFormMessaging,
  false
) {
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
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        return "<p>IN-MD Issue when parsing Text markdown</p>";
      }
    }

    return "";
  }

  get isCompact() {
    return this.messageText.split("\\n").length <= 2;
  }

  get computedClassName() {
    return {
      "rpl-form-alert": true,
      "rpl-form-alert--information": this.isComment,
      "rpl-form-alert--warning": this.isWarning,
      "rpl-form-alert--error": this.isRequirement,
      "rpl-form-alert--success": this.isSuccess
    };
  }

  get computedIconName() {
    return computeClass({
      "icon-information-circle-filled": this.isComment,
      "icon-exclamation-circle-filled": this.isWarning || this.isRequirement,
      "icon-check-circle-filled": this.isSuccess
    });
  }

  /* lifecycle */

  renderedCallback() {
    super.renderedCallback();

    let element = this.refs.markdown;
    let mth = this._messageTextHtml;

    if (mth && element) {
      replaceInnerHtml(element, mth);
    }

    if (this.messageText) {
      this.classList.add("rpl-form__outer");
    } else {
      this.classList.remove("rpl-form__outer");
    }
  }
}
