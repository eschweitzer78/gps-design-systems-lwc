/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  Mode, 
  StepInfo 
} from "c/sfGpsDsAuNswProgressIndicator";

const MODE_CURRENT: Mode = "current";
const MODE_CUMULATIVE: Mode = "cumulative";
const MODE_LABELONLY: Mode = "label-only";
const MODE_VALUES: Mode[] = [
  MODE_CUMULATIVE, 
  MODE_CURRENT, 
  MODE_LABELONLY
];
const MODE_DEFAULT = MODE_CUMULATIVE;

const STEP_DEFAULT: number = 1;
const OF_DEFAULT: number = 1;

export default 
class SfGpsDsAuNswProgressIndicator
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  step?: number;
  _step = this.defineIntegerProperty("step", {
    minValue: 1,
    defaultValue: STEP_DEFAULT
  });

  // @ts-ignore
  @api
  of?: number;
  _of = this.defineIntegerProperty("of", {
    minValue: 1,
    defaultValue: OF_DEFAULT
  });

  // @ts-ignore
  @api
  mode?: Mode;
  _mode = this.defineEnumProperty<Mode>("mode", {
    validValues: MODE_VALUES,
    defaultValue: MODE_DEFAULT
  });

  /* computed */

  get computedSteps(): StepInfo[] {
    const isCumulative = this._mode.value === MODE_CUMULATIVE;
    let arr = [];
    const step = this._step.value;

    for (let i = 1; i <= this._of.value; i++) {
      const isActive = isCumulative ? i <= step : i === step;

      arr.push({
        index: i,
        isActive,
        className: isActive ? "active" : ""
      });
    }

    return arr;
  }

  get computedClassName(): any {
    return {
      "nsw-progress-indicator": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedShowBar(): boolean {
    return this._mode.value !== MODE_LABELONLY;
  }
}
