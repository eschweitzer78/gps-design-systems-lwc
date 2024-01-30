/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMessaging from "omnistudio/omniscriptMessaging";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class sfGpsDsFormLookupOsN extends OmniscriptMessaging {
  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }
}
