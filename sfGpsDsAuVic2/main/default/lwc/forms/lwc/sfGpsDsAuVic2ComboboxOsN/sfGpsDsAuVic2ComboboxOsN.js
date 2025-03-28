/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsAuVic2RplDropdownOsN from "c/sfGpsDsAuVic2RplDropdownOsN";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";
import { api } from "lwc";

export default class extends SfGpsDsOmniInputMixinOsN(
  SfGpsDsAuVic2RplDropdownOsN
) {
  @api
  get options() {
    return this._options;
  }

  set options(value) {
    this._options = value;
  }
}
