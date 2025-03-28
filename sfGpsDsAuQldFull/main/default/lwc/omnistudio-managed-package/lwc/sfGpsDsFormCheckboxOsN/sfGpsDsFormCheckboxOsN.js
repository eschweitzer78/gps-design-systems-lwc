/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptCheckbox from "omnistudio/omniscriptCheckbox";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class extends SfGpsDsOmniHasValidationMixin(OmniscriptCheckbox) {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.checkLabel);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  /* event management */

  handleChange(event) {
    this.sfGpsDsClearCustomValidation(false);
    super.handleChange(event);
  }
}
