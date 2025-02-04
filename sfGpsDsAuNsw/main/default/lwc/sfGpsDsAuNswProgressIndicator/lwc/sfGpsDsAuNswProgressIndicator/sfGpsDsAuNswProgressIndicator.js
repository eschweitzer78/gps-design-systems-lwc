/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseString, normaliseInteger } from "c/sfGpsDsHelpers";

const MODE_CURRENT = "current";
const MODE_CUMULATIVE = "cumulative";
const MODE_LABELONLY = "label-only";
const MODE_VALUES = [MODE_CUMULATIVE, MODE_CURRENT, MODE_LABELONLY];
const MODE_DEFAULT = MODE_CUMULATIVE;

const STEP_DEFAULT = 1;
const OF_DEFAULT = 1;

export default class extends LightningElement {
  @api className;

  /* api: step */

  _step = STEP_DEFAULT;
  _stepOriginal = STEP_DEFAULT;

  @api
  get step() {
    return this._stepOriginal;
  }

  set step(value) {
    this._stepOriginal = value;
    this._step = normaliseInteger(value, {
      acceptString: true,
      min: 1,
      fallbackValue: STEP_DEFAULT
    });
  }

  /* api: of */

  _of = OF_DEFAULT;
  _ofOriginal = OF_DEFAULT;

  @api
  get of() {
    return this._ofOriginal;
  }

  set of(value) {
    this._ofOriginal = value;
    this._of = normaliseInteger(value, {
      acceptString: true,
      min: 1,
      fallbackValue: OF_DEFAULT
    });
  }

  /* api: mode */

  _mode = MODE_DEFAULT;
  _modeOriginal = MODE_DEFAULT;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });
  }

  /* computed */

  get computedSteps() {
    const isCumulative = this._mode === MODE_CUMULATIVE;
    let arr = [];

    for (let i = 1; i <= this._of; i++) {
      const isActive = isCumulative ? i <= this._step : i === this._step;

      arr.push({
        index: i,
        isActive,
        className: isActive ? "active" : ""
      });
    }

    return arr;
  }

  get computedClassName() {
    return {
      "nsw-progress-indicator": true,
      [this.className]: this.className
    };
  }

  get computedShowBar() {
    return this._mode !== MODE_LABELONLY;
  }
}
