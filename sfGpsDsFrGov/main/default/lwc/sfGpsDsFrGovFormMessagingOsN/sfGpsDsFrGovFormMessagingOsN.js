/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMessaging from "omnistudio/omniscriptMessaging";
import { computeClass } from "c/sfGpsDsHelpers";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsFrGovFormMessagingOsN.html";

export default class extends OmniscriptMessaging {
  /* computed */

  get computedType() {
    return computeClass({
      error: this.messageType === "Requirement",
      success: this.messageType === "Success",
      info: this.messageType === "Comment",
      warning: this.messageType === "Warning"
    });
  }

  get mergedTitle() {
    if (!this.messageText) {
      return null;
    }

    const splitText = this.messageText.split("\\n");
    return splitText.length > 1
      ? omniGetMergedField(this, splitText[0])
      : this.messageType;
  }

  get mergedDescription() {
    if (!this.messageText) {
      return null;
    }

    const splitText = this.messageText.split("\\n");
    return omniGetMergedField(
      this,
      splitText.length > 1 ? splitText.slice(1).join("\\n") : this.messageText
    );
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
