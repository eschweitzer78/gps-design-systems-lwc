/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormStepChart from "c/sfGpsDsFormStepChartOsN";
import tmpl from "./sfGpsDsAuVic2FormStepChartOsN.html";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2FormStepChartOsN";

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
    if (DEBUG) {
      console.debug(CLASS_NAME, "> computedCurrentIndexP1", this.currentIndex);
    }

    const stepIndex = (this.stepDef || []).findIndex(
      (step) => step.indexInParent === this.currentIndex
    );

    if (DEBUG) {
      console.debug(CLASS_NAME, "< computedCurrentIndexP1", stepIndex + 1);
    }

    return stepIndex + 1;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
