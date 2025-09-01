/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormRadio from "c/sfGpsDsFormRadioOsN";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixinOsN";
import tmpl from "./sfGpsDsAuVic2FormRadioOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixin(SfGpsDsFormRadio) {
  get computedType() {
    return this._isDisplayWide ? "button" : "radio";
  }
  /* lifecycle */

  render() {
    return tmpl;
  }
}
