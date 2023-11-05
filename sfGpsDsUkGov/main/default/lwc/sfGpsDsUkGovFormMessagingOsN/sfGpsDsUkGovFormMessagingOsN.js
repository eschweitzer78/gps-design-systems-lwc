/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMessagingOsN from "c/sfGpsDsFormMessagingOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsUkGovFormMessagingOsN.html";

export default class SfGpsDsUkGovFormMessagingOsN extends SfGpsDsFormMessagingOsN {
  render() {
    return tmpl;
  }

  get mergedMessageText() {
    return omniGetMergedField(this, this.messageText);
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
