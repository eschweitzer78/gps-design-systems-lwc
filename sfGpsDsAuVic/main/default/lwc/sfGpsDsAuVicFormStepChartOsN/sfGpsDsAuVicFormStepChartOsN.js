/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set StepChart as the ElementType and this LWC as the Lightning Web Component

import { api } from "lwc";
import OmniscriptStepChart from "omnistudio/omniscriptStepChart";
import tmpl from "./sfGpsDsAuVicFormStepChartOsN.html";

export default class SfGpsDsAuVicFormStepChartOsN extends OmniscriptStepChart {
  render() {
    return tmpl;
  }

  step;
  of;

  @api get jsonDef() {
    return super.jsonDef;
  }

  set jsonDef(value) {
    let steps = value.children.filter((item) => item.isStep);
    this.of = steps.length;
    let stepIndex = steps.findIndex(
      (item) => item.indexInParent === value.asIndex
    );
    this.step = stepIndex + 1;

    super.jsonDef = value;
  }
}
