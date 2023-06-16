/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set Step as the ElementType and this LWC as the Lightning Web Component

import OmniscriptStep from "omnistudio/omniscriptStep";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuNswFormStepOsN.html";

export default class SfGpsDsAuNswFormStepOsN extends OmniscriptStep {
  render() {
    return tmpl;
  }

  handleNext(e) {
    e.stopPropagation();

    /*
    // TODO:
    // temporary fix to solve the sfGpsDsAuNswFormSelect issue of having an invalidated value when
    // configured as dependent picklist. It looks like it's actually an issue with the original
    // omnistudioSelect not updating the validation state of its parent when options are updated
    // asynchronously as part of the dependent picklist mechanism. It prevents moving to the next
    // screen even though the widget is actually in valid state, requiring you to hit next twice.
    this.reportValidity();
    */

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

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedChartLabel() {
    return omniGetMergedField(this, this._propSetMap.chartLabel);
  }

  get mergedCancelLabel() {
    return omniGetMergedField(this, this._propSetMap.cancelLabel);
  }

  get mergedSaveLabel() {
    return omniGetMergedField(this, this._propSetMap.saveLabel);
  }

  get mergedPreviousLabel() {
    return omniGetMergedField(this, this._propSetMap.previousLabel);
  }

  get mergedNextLabel() {
    return omniGetMergedField(this, this._propSetMap.nextLabel);
  }

  get showSave() {
    return this._propSetMap.allowSaveForLater && this._propSetMap.saveLabel;
  }

  get showNext() {
    return this._propSetMap.nextWidth > 0 && this._propSetMap.nextLabel;
  }

  get showPrev() {
    return (
      this.scriptHeaderDef.asIndex > this.scriptHeaderDef.firstStepIndex &&
      this._propSetMap.previousWidth > 0 &&
      this._propSetMap.previousLabel
    );
  }
}
