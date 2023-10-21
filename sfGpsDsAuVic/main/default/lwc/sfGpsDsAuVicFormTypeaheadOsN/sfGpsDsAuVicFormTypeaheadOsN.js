/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* 19-OCT-2023: omni246.5 added a readOnly mapping to the contained typeahead but that attribute apparently
   does not exist in the original widget anyway. Keeping for alignment, though.  */

import OmniscriptTypeahead from "omnistudio/omniscriptTypeaheadOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuVicFormTypeaheadOsN.html";

export default class sfGpsDsAuVicFormTypeaheadOsN extends OmniscriptTypeahead {
  render() {
    return tmpl;
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}
