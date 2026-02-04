/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptInternalUtils from "c/sfGpsDsOsrtOmniscriptInternalUtils";

export function omniGetMergedField(omniElement, label) {
  return label &&
    omniElement._jsonData &&
    omniElement.scriptHeaderDef &&
    omniElement.jsonDef
    ? OmniscriptInternalUtils.handleMergeField(
        label,
        omniElement._jsonData,
        omniElement.scriptHeaderDef.labelMap,
        OmniscriptInternalUtils.isRepeatNotation(label)
          ? omniElement.jsonDef.JSONPath
          : null,
        true
      )
    : null;
}
