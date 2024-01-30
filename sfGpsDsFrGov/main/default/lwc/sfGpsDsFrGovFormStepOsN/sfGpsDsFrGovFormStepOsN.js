/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set Step as the ElementType and this LWC as the Lightning Web Component

import OmniscriptStep from "c/sfGpsDsFormStepOsN";
import tmpl from "./sfGpsDsFrGovFormStepOsN.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsFrGovFormStepOsN";
const SHOW_LABEL = false;

export default class SfGpsDsFrGovFormStepOsN extends OmniscriptStep {
  render() {
    return tmpl;
  }

  handleBack(e) {
    e.preventDefault(); // avoid default behaviour with the href on anchor
    super.handleBack(e);
  }

  handleNext(e) {
    if (DEBUG) console.log(CLASS_NAME, "handleNext");

    super.handleNext(e);
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

  get showLabel() {
    return SHOW_LABEL || this._propSetMap.showLabel;
  }

  get showSave() {
    return this._propSetMap.allowSaveForLater && this._propSetMap.saveLabel;
  }

  // TO DO : override showNext to add a counter to get steps.length ( we don't have an info like this.scriptHeaderDef.LastStepIndex )
  get showNext() {
    let counter = -1;
    let data = this.scriptHeaderDef.labelMap;
    for (let key in data) {
      /* eslint-disable-next-line no-prototype-builtins */
      if (data.hasOwnProperty(key)) {
        if (key === data[key]) {
          counter++;
        }
      }
    }

    return (
      this.scriptHeaderDef.asIndex < counter &&
      this._propSetMap.nextWidth > 0 &&
      this._propSetMap.nextLabel
    );
  }
}
