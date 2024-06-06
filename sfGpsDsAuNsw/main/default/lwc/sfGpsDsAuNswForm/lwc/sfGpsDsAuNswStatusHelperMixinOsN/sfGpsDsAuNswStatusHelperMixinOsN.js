/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";

const INVALID_STATUS_LABEL = "invalid";

let SfGpsAuNswStatusHelperMixin = (
  base,
  invalidStatusLabel = INVALID_STATUS_LABEL
) =>
  class extends base {
    get computedHelperClassName() {
      return getHelperClassName(invalidStatusLabel);
    }

    get computedStatusIcon() {
      return getStatusIcon(invalidStatusLabel);
    }
  };

export default SfGpsAuNswStatusHelperMixin;
