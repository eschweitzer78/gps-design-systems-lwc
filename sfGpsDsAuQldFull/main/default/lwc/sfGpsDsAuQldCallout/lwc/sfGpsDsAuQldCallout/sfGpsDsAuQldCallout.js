/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import {
  normaliseInteger,
  normaliseBoolean,
  normaliseString
} from "c/sfGpsDsHelpers";

const TYPE_DEFAULT = "default";
const TYPE_CALENDAREVENT = "calendar-event";
const TYPE_VALUES = [TYPE_DEFAULT, TYPE_CALENDAREVENT];

const HEADINGLEVEL_DEFAULT = 3;

export default class extends LightningElement {
  @api heading;
  @api className;

  /* api: level */

  _level = HEADINGLEVEL_DEFAULT;
  _levelOriginal = HEADINGLEVEL_DEFAULT;

  @api
  get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;

    if (typeof value !== "string") {
      value = value ? value.toString() : null;
    }

    this._level = normaliseInteger(value, {
      acceptString: true,
      min: 1,
      max: 6,
      fallbackValue: HEADINGLEVEL_DEFAULT
    });
  }

  /* api: type */

  _type;
  _typeOriginal;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    });
  }

  /* api: headingSrOnly */

  _headingSrOnly;
  _headingSrOnlyOriginal;

  @api
  get headingSrOnly() {
    return this._headingSrOnlyOriginal;
  }

  set headingSrOnly(value) {
    this._headingSrOnlyOriginal = value;
    this._headingSrOnly = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* getters */

  get computedClassName() {
    return {
      qld__callout: true,
      "qld__callout--calendar-event": this._type === TYPE_CALENDAREVENT,
      [this.className]: this.className
    };
  }

  get computedHeadingClassName() {
    return {
      qld__callout__heading: true,
      "qld__callout__heading--sronly": this.headingSrOnly
    };
  }

  get computedIsH1() {
    return this._level === 1;
  }

  get computedIsH2() {
    return this._level === 2;
  }

  get computedIsH3() {
    return this._level === 3 || this._level == null;
  }

  get computedIsH4() {
    return this.level === 4;
  }

  get computedIsH5() {
    return this.level === 5;
  }

  get computedIsH6() {
    return this.level === 6;
  }
}
