/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptDateTime from "omnistudio/omniscriptDateTime";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class extends SfGpsDsOmniHasValidationMixin(OmniscriptDateTime) {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get mergedDatePlaceholder() {
    return omniGetMergedField(this, this._propSetMap.datePlaceholder);
  }

  get mergedTimePlaceholder() {
    return omniGetMergedField(this, this._propSetMap.timePlaceholder);
  }

  get mergedTimeLabel() {
    return omniGetMergedField(this, this._propSetMap.timeLabel);
  }
}
