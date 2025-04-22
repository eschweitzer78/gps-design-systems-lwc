/*
 * Copyright (c) 2022-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set StepChart as the ElementType and this LWC as the Lightning Web Component

import { api } from "lwc";
import SfGpsDsFormStepChart from "c/sfGpsDsFormStepChartOsN";
import tmpl from "./sfGpsDsAuNswFormStepChartOsN.html";

export default class extends SfGpsDsFormStepChart {
  /* api: jsonDef */
  /* deprecated but have to keep as packaging won't pick up the fact that parent class has it */

  @api
  get jsonDef() {
    return super.jsonDef;
  }

  set jsonDef(value) {
    super.jsonDef = value;
  }
  /* end deprecated */

  /* lifecycle */

  render() {
    return tmpl;
  }
}
