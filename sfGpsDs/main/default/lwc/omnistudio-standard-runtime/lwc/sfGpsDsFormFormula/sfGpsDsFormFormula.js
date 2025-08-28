/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptFormula from "c/sfGpsDsOsrtOmniscriptFormula";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixin";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";

export default class extends SfGpsDsOmniHasValidationMixin(OmniscriptFormula) {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}
