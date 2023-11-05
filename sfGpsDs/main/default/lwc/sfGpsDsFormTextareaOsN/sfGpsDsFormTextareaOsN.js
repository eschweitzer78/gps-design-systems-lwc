/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptTextarea from "omnistudio/omniscriptTextarea";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";

export default class SfGpsDsFormTextAreaOsN extends SfGpsDsOmniHasValidationMixin(
  OmniscriptTextarea
) {
  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get mergedPlaceholder() {
    return omniGetMergedField(this, this._propSetMap.placeholder);
  }
}
