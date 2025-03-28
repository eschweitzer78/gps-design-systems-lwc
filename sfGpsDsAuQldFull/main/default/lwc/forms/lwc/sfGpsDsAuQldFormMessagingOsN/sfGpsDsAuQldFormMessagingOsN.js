/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMessagingOsN from "c/sfGpsDsFormMessagingOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuQldFormMessagingOsN.html";

export default class extends SfGpsDsFormMessagingOsN {
  /* computed */

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

  /* lifecycle */

  render() {
    return tmpl;
  }
}
