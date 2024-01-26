/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMessaging from "omnistudio/omniscriptMessaging";
import { computeClass } from "c/sfGpsDsHelpers";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsFrGovFormMessagingOsN.html";

export default class SfGpsDsFrGovFormMessagingOsN extends OmniscriptMessaging {
  render() {
    return tmpl;
  }

  get computedAlertClassName() {
    return computeClass({
      "fr-alert": true,
      "fr-alert--sm": this.isCompact,
      "fr-alert--error": this.messageType === "Requirement",
      "fr-alert--success": this.messageType === "Success",
      "fr-alert--info": this.messageType === "Comment",
      "fr-alert--warning": this.messageType === "Warning"
    });
  }

  get computedAlertTitleClassName() {
    return computeClass({
      "fr-alert__title": true
    });
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

  get isCompact() {
    return this.messageText.split("\\n").length <= 2;
  }

  get space() {
    return " ";
  }
}
