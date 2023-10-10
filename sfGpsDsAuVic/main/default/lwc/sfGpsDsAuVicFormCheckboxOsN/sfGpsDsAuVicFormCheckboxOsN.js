/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptCheckbox from "omnistudio/omniscriptCheckbox";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuVicFormCheckboxOsN.html";

export default class SfGpsDsAuNswFormCheckboxOsN extends OmniscriptCheckbox {
  get _options() {
    let mergedLabel = this.getMergedLabel();
    return [
      {
        label: mergedLabel,
        value: mergedLabel
      }
    ];
  }

  render() {
    return tmpl;
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.checkLabel);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}
