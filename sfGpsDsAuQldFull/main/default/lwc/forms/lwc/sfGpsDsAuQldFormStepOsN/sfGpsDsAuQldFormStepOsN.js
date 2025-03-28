/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set Step as the ElementType and this LWC as the Lightning Web Component

import SfGpsDsFormStepOsN from "c/sfGpsDsFormStepOsN";
import tmpl from "./sfGpsDsAuQldFormStepOsN.html";

export default class extends SfGpsDsFormStepOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
