/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* notes
      field-level-help-position={_propSetMap.helpTextPos} not supported
      required-label={allCustomLabelsUtil.OmniRequired} not suppported
      icon-name="utility:info" not supported
*/

import SfGpsDsFormFormulaOsN from "c/sfGpsDsFormFormulaOsN";
import SfGpsDsAuVic2FormElementMixinOsN from "c/sfGpsDsAuVic2FormElementMixinOsN";
import tmpl from "./sfGpsDsAuVic2FormFormulaOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixinOsN(
  SfGpsDsFormFormulaOsN
) {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
