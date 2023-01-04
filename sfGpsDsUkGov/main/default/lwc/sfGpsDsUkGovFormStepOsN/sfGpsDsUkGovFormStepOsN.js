/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set Step as the ElementType and this LWC as the Lightning Web Component

import { track } from "lwc";
import OmniscriptStep from "omnistudio/omniscriptStep";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsUkGovFormStepOsN.html";

export default class SfGpsDsUkGovFormStepOsN extends OmniscriptStep {
  render() {
    return tmpl;
  }

  @track _errorMessages;

  handleNext(e) {
    e.stopPropagation();

    // TODO:
    // temporary fix to solve the sfGpsDsAuNswFormSelect issue of having an invalidated value when
    // configured as dependent picklist. It looks like it's actually an issue with the original
    // omnistudioSelect not updating the validation state of its parent when options are updated
    // asynchronously as part of the dependent picklist mechanism. It prevents moving to the next
    // screen even though the widget is actually in valid state, requiring you to hit next twice.
    this.reportValidity();

    let invalidIds = Object.keys(this.invalidElements);
    let errorMessages = [];

    invalidIds.forEach((invalidId) => {
      let elt = this.invalidElements[invalidId];

      // Only do it for widgets that have getErrorDetails
      if (elt.getErrorDetails) {
        let errorDetails = elt.getErrorDetails();

        errorMessages.push({
          id: invalidId,
          href: "#" + errorDetails.id,
          message: errorDetails.errorMessage,
          elt: elt
        });
      }
    });

    this._errorMessages = errorMessages.length ? errorMessages : null;

    if (!invalidIds.length) {
      this.dispatchEvent(
        new CustomEvent("omniautoadvance", {
          bubbles: true,
          detail: {
            moveToStep: "next"
          }
        })
      );
    }
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

  handleErrorClick(e) {
    e.preventDefault();
    e.stopPropagation();

    let targetId = e.currentTarget.dataset.id;
    this._errorMessages
      .filter((message) => message.id === targetId)
      .forEach((message) => {
        console.log(
          "found target",
          targetId,
          message.elt.getErrorDetails,
          message.elt.scrollTo
        );
        if (message.elt.scrollTo) {
          console.log("target has scrollTo");
          message.elt.scrollTo();
        }
      });

    return false;
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
