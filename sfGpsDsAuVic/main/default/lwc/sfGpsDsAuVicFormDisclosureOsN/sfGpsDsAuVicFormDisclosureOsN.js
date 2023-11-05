/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDisclosureOsN from "c/sfGpsDsFormDisclosureOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicFormDisclosureOsN.html";

export default class SfGpsDsAuVicFormDisclosureOsN extends SfGpsDsFormDisclosureOsN {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      valid: !this.sfGpsDsIsError,
      invalid: this.sfGpsDsIsError,
      required: this._propSetMap.required
    });
  }
}
