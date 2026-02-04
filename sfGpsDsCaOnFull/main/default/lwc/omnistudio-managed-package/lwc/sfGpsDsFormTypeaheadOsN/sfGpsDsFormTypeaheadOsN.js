/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptTypeahead from "omnistudio/omniscriptTypeahead";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class extends SfGpsDsOmniHasValidationMixin(
  OmniscriptTypeahead
) {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get mergedPlaceholder() {
    return omniGetMergedField(this, this._placeholder);
  }

  get mergedMessageWhenValueMissing() {
    return omniGetMergedField(this, this._messageWhenValueMissing);
  }

  get mergedMessageWhenTooShort() {
    return omniGetMergedField(this, this._messageWhenTooShort);
  }

  get mergedMessageWhenTooLong() {
    return omniGetMergedField(this, this._messageWhenTooLong);
  }
}
