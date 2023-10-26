/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDisclosureOsN from "c/sfGpsDsFormDisclosureOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import SfGpsDsUkGovFormErrorMgtMixin from "c/sfGpsDsUkGovFormErrorMgtMixinOsN";
import tmpl from "./sfGpsDsUkGovFormDisclosureOsN.html";

const DEFAULT_LABEL_SIZE = "large";

export default class SfGpsDsUkGovFormDisclosureOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsUkGovFormErrorMgtMixin(SfGpsDsFormDisclosureOsN),
  DEFAULT_LABEL_SIZE
) {
  render() {
    return tmpl;
  }

  initCompVariables() {
    super.initCompVariables();

    this.labelSize = this._propSetMap.labelSize;
  }
}
