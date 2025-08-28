/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptBlock from "c/sfGpsDsOsrtOmniscriptBlock";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";

export default class extends OmniscriptBlock {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this.blockLabel);
  }
}
