/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormEmailOsN from "c/sfGpsDsFormEmailOsN";
import SfGpsDsAuVic2FormElementMixinOsN from "c/sfGpsDsAuVic2FormElementMixinOsN";
import tmpl from "./sfGpsDsAuVic2FormEmailOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixinOsN(
  SfGpsDsFormEmailOsN
) {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
