/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptCheckbox from "omnistudio/omniscriptCheckbox";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuNswSFormCheckboxOsN.html";

export default class SfGpsDsAuNswSFormCheckboxOsN extends OmniscriptCheckbox {
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

  applyCallResp(e, t = false, i = false) {
    /* TODO: investigate: for some reason super.applyCallResp(e, t, i) does not set elementValue */

    if (i) {
      this.setCustomValidation(e);
    } else {
      e = this.treatResp(e);

      if (this.lodashUtil.isEqual(this.elementValue, e)) {
        return;
      }

      this.setElementValue(e, t, i);
      this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(),
        "omniaggregate"
      );
    }
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.checkLabel);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}
