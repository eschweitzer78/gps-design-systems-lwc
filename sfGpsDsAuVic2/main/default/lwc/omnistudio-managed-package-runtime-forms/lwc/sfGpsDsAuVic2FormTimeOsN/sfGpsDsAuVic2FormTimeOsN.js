/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormTimeOsN from "c/sfGpsDsFormTimeOsN";
import SfGpsDsAuVic2FormElementMixinOsN from "c/sfGpsDsAuVic2FormElementMixinOsN";
import tmpl from "./sfGpsDsAuVic2FormTimeOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixinOsN(
  SfGpsDsFormTimeOsN
) {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
