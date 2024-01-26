/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// Setup:
// in omniscript designer, go to setup tab and in the Element Type To LWC Component Mapping section
// set StepChart as the ElementType and this LWC as the Lightning Web Component

import { api } from "lwc";
import OmniscriptStepChart from "omnistudio/omniscriptStepChart";
import tmpl from "./sfGpsDsFrGovFormStepChartOsN.html";

export default class SfGpsDsFrGovFormStepChartOsN extends OmniscriptStepChart {
  render() {
    return tmpl;
  }

  step;
  of;
  currentStepName;
  nextStepName;

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

  calculateStepData(index) {
    const stepsDef = this.jsonDef.children.filter((jsonDef) => {
      // the only thing that was modified in this method from the OOTB was the additional check here
      // for jsonDef.propSetMap.showStep. everything else was copied from the OOTB calculateStepData method.
      return (
        jsonDef.type === "Step" &&
        jsonDef.bShow !== false &&
        jsonDef.propSetMap.showStep === true
      );
    });
    const stepIndex = stepsDef.findIndex((def) => index === def.indexInParent);
    const value = (stepIndex / (stepsDef.length - 1)) * 100;

    this.currentStepName = this.jsonDef.children[this.step - 1].name;

    if (this.step >= 0 && this.step < this.jsonDef.children.length) {
      this.nextStepName = this.jsonDef.children[this.step].name;
    }

    return {
      index: stepIndex,
      length: stepsDef.length,
      value: Number.isFinite(value) && stepIndex >= 0 ? value : 0
    };
  }
}
