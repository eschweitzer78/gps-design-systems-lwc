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

export default class extends OmniscriptStep {
  /* computed */

  get showLabel() {
    return SHOW_LABEL || this._propSetMap?.showLabel;
  }

  get showSave() {
    return this._propSetMap?.allowSaveForLater && this._propSetMap?.saveLabel;
  }

  /* event management */

  handleBack(e) {
    if (DEBUG) console.log(CLASS_NAME, "> handleBack");

    e.preventDefault(); // avoid default behaviour with the href on anchor
    super.handleBack(e);

    if (DEBUG) console.log(CLASS_NAME, "< handleBack");
  }

  handleSave(e) {
    if (DEBUG) console.log(CLASS_NAME, "> handleSave");

    e.stopPropagation();

    if (this._propSetMap.allowSaveForLater) {
      this.dispatchEvent(
        new CustomEvent("omnisaveforlater", {
          bubbles: true,
          detail: {
            auto: false
          }
        })
      );
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleSave");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
