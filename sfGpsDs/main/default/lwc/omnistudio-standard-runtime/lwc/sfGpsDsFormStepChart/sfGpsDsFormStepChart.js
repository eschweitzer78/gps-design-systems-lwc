/*
 * Copyright (c) 2022-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptStepChart from "c/sfGpsDsOsrtOmniscriptStepChart";

export default class extends OmniscriptStepChart {
  sfGpsDsStepIndex;
  sfGpsDsStepCount;
  sfGpsDsPreviousStepName;
  sfGpsDsCurrentStepName;
  sfGpsDsNextStepName;

  /* api: jsonDef */

  @api
  get jsonDef() {
    return super.jsonDef;
  }

  set jsonDef(value) {
    const steps = this.sfGpsDsVisibleSteps(value);
    const length = steps.length;
    const index = steps.findIndex(
      (item) => item.indexInParent === value.asIndex
    );

    this.sfGpsDsStepCount = length;
    this.sfGpsDsStepIndex = index;
    this.sfGpsDsPreviousStepName =
      index > 0 ? value.children[index - 1]?.name : null;
    this.sfGpsDsCurrentStepName = value.children[index]?.name;
    this.sfGpsDsNextStepName =
      index < length - 1 ? value.children[index + 1]?.name : null;

    super.jsonDef = value;
  }

  /* computed */

  get sfGpsDsStepNumber() {
    return this.sfGpsDsStepIndex === null ? null : this.sfGpsDsStepIndex + 1;
  }

  /* methods */

  sfGpsDsVisibleSteps(jsonDef) {
    return jsonDef.children.filter(
      (item) => item.isStep && item.bShow !== false /*&&
      item.propSetMap.showStep === true*/
    );
  }

  calculateStepData(targetIndex) {
    const steps = this.sfGpsDsVisibleSteps(this.jsonDef);
    const length = steps.length;
    const index = steps.findIndex((item) => item.indexInParent === targetIndex);
    const value = (index / (length - 1)) * 100;

    return {
      index,
      length: length,
      value: Number.isFinite(value) && index >= 0 ? value : 0
    };
  }
}
