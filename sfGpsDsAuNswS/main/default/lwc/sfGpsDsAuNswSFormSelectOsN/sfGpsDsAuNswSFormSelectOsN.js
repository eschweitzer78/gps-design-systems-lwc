/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
  required-label={allCustomLabelsUtil.OmniRequired} not supported
  field-level-help-position={_propSetMap.helpTextPos} not supported
  theme={_theme} not supported
*/

import OmniscriptSelect from "omnistudio/omniscriptSelect";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuNswSFormSelectOsN.html";

export default class SfGpsDsAuNswSFormSelectOsN extends OmniscriptSelect {
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
