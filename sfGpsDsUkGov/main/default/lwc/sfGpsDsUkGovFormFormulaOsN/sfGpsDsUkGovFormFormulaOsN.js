/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormFormulaOsN from "c/sfGpsDsFormFormulaOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import tmpl from "./sfGpsDsUkGovFormFormulaOsN.html";

const DEFAULT_LABEL_SIZE = "large";

export default class SfGpsDsAuNswFormFormulaOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsFormFormulaOsN,
  DEFAULT_LABEL_SIZE
) {
  render() {
    return tmpl;
  }
}
