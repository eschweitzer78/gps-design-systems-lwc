/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormStepChart from "c/sfGpsDsFormStepChart";
import tmpl from "./sfGpsDsAuVic2FormStepChart.html";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2FormStepChart";

export default class extends SfGpsDsFormStepChart {
  get computedSteps() {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> computedSteps",
        JSON.stringify(this.stepDef)
      );

    const isMultiLang = this.scriptHeaderDef && this.scriptHeaderDef.multiLang;
    const rv = (this.stepDef || []).map((step) => {
      let stepLabel = "";

      if (step.bShow !== false) {
        stepLabel = step.propSetMap.chartLabel || step.propSetMap.label;
        if (isMultiLang) {
          stepLabel = this.scriptHeaderDef.allCustomLabels[stepLabel];
        }
      }

      return {
        label: stepLabel
      };
    });

    if (DEBUG) console.debug(CLASS_NAME, "< computedSteps", JSON.stringify(rv));
    return rv;
  }

  get computedCurrentIndexP1() {
    return this.currentIndex + 1;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
