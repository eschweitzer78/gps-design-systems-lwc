/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormFormulaOsN from "c/sfGpsDsFormFormulaOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import tmpl from "./sfGpsDsUkGovFormFormulaOsN.html";

export default class SfGpsDsAuNswFormFormulaOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsFormFormulaOsN
) {
  render() {
    return tmpl;
  }
}
