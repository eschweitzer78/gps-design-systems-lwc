/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptBlock from "omnistudio/omniscriptBlock";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class extends OmniscriptBlock {
  get mergedLabel() {
    return omniGetMergedField(this, this.blockLabel);
  }
}
