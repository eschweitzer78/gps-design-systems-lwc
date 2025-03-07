/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptStep from "omnistudio/omniscriptStep";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

export default class extends OmniscriptStep {
  /* computed */

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap?.label);
  }

  get mergedChartLabel() {
    return omniGetMergedField(this, this._propSetMap?.chartLabel);
  }

  get mergedCancelLabel() {
    return omniGetMergedField(this, this._propSetMap?.cancelLabel);
  }

  get mergedSaveLabel() {
    return omniGetMergedField(this, this._propSetMap?.saveLabel);
  }

  get mergedPreviousLabel() {
    return omniGetMergedField(this, this._propSetMap?.previousLabel);
  }

  get mergedNextLabel() {
    return omniGetMergedField(this, this._propSetMap?.nextLabel);
  }

  get showSave() {
    return (
      this.scriptHeaderDef?.propSetMap?.allowSaveForLater &&
      this._propSetMap?.allowSaveForLater &&
      this._propSetMap?.saveLabel
    );
  }

  get showNext() {
    return this._propSetMap?.nextWidth > 0 && this._propSetMap?.nextLabel;
  }

  get showPrev() {
    return (
      this.scriptHeaderDef.asIndex > this.scriptHeaderDef.firstStepIndex &&
      this._propSetMap?.previousWidth > 0 &&
      this._propSetMap?.previousLabel
    );
  }

  /* event management */

  handleNext(e) {
    e.stopPropagation();

    this.dispatchEvent(
      new CustomEvent("omniautoadvance", {
        bubbles: true,
        detail: {
          moveToStep: "next"
        }
      })
    );
  }

  handleBack(e) {
    e.stopPropagation();

    this.dispatchEvent(
      new CustomEvent("omniautoadvance", {
        bubbles: true,
        detail: {
          moveToStep: "previous"
        }
      })
    );
  }

  handleSave(e) {
    e.stopPropagation();

    if (!this._propSetMap.allowSaveForLater) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("omnisaveforlater", {
        bubbles: true,
        detail: {
          auto: false
        }
      })
    );
  }
}
