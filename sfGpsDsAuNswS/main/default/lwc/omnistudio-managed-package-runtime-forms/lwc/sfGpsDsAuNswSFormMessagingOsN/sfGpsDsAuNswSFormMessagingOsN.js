/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMessagingOsN from "c/sfGpsDsFormMessagingOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuNswSFormMessagingOsN.html";

export default class extends SfGpsDsFormMessagingOsN {
  /* computed */

  get mergedTitleText() {
    const splitText = this.messageText.split("\\n");

    return splitText.length > 1
      ? omniGetMergedField(this, splitText[0])
      : this.messageType;
  }

  get mergedMessageText() {
    const splitText = this.messageText.split("\\n");

    return omniGetMergedField(
      this,
      splitText.length > 1 ? splitText.slice(1).join("\\n") : this.messageText
    );
  }

  get computedIsCompact() {
    return this.messageText.split("\\n").length <= 2;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
