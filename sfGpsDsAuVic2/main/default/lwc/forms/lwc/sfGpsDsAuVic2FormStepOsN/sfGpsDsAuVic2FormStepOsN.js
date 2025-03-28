/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set Step as the ElementType and this LWC as the Lightning Web Component

import SfGpsDsFormStepOsN from "c/sfGpsDsFormStepOsN";
import tmpl from "./sfGpsDsAuVic2FormStepOsN.html";

export default class extends SfGpsDsFormStepOsN {
  /* computed */

  get computedIsH1() {
    return (
      this._propSetMap.isHeading === true ||
      this._propSetMap.isHeading === 1 ||
      this._propSetMap.isHeading === "1"
    );
  }

  get computedIsH2() {
    return (
      this._propSetMap.isHeading === 2 || this._propSetMap.isHeading === "2"
    );
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
