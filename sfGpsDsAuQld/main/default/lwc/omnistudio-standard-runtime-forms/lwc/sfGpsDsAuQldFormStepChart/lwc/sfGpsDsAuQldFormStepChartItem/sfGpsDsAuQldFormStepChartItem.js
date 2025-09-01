/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioStepChartItem from "c/sfGpsDsFormStepChartItem";
import tmpl from "./sfGpsDsAuQldFormStepChartItem.html";

export default class extends OmnistudioStepChartItem {
  /* computed */

  get computedStepClassName() {
    return {
      step: true,
      step_vertical: this.isVertical,
      step_horizontal: !this.isVertical
    };
  }

  get _currentStepIndexPlusOne() {
    return this.currentStepIndex + 1;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
