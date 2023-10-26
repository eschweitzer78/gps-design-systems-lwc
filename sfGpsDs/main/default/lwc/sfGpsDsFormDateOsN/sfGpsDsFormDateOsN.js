/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptDate from "omnistudio/omniscriptDate";
import SfGpsDsOmniErrorMsgConfigMixin from "c/sfGpsDsOmniErrorMsgConfigMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class SfGpsDsFormCheckboxOsN extends SfGpsDsOmniErrorMsgConfigMixin(
  OmniscriptDate
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
