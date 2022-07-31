/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMessaging from "omnistudio/omniscriptMessaging";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuNswFormMessagingOsN.html";

export default class SfGpsDsAuNswFormMessagingOsN extends OmniscriptMessaging {
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
}
