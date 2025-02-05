/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptDisclosure from "omnistudio/omniscriptDisclosure";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class extends SfGpsDsOmniHasValidationMixin(
  OmniscriptDisclosure
) {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedCheckLabel() {
    return omniGetMergedField(this, this._propSetMap.checkLabel);
  }
}
