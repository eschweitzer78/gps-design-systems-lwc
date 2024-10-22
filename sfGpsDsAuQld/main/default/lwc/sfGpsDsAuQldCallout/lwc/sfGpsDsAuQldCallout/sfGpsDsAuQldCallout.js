/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import {
  computeClass,
  normaliseString,
  normaliseBoolean
} from "c/sfGpsDsHelpers";

const TYPE_DEFAULT = "default";
const TYPE_CALENDAREVENT = "calendar-event";
const TYPE_VALUES = [TYPE_DEFAULT, TYPE_CALENDAREVENT];

const HEADINGLEVEL_1 = "1";
const HEADINGLEVEL_2 = "2";
const HEADINGLEVEL_3 = "3";
const HEADINGLEVEL_4 = "4";
const HEADINGLEVEL_5 = "5";
const HEADINGLEVEL_6 = "6";
const HEADINGLEVEL_VALUES = [
  HEADINGLEVEL_1,
  HEADINGLEVEL_2,
  HEADINGLEVEL_3,
  HEADINGLEVEL_4,
  HEADINGLEVEL_5,
  HEADINGLEVEL_6
];
const HEADINGLEVEL_DEFAULT = HEADINGLEVEL_3;

export default class SfGpsDsAuQldCallout extends LightningElement {
  @api heading;
  @api className;

  /* api: level */

  _level = HEADINGLEVEL_DEFAULT;
  _levelOriginal = HEADINGLEVEL_DEFAULT;

  @api get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;

    if (typeof value !== "string") {
      value = value ? value.toString() : null;
    }

    this._level = normaliseString(value, {
      validValues: HEADINGLEVEL_VALUES,
      fallbackValue: HEADINGLEVEL_DEFAULT
    });
  }

  /* api: type */

  _type;
  _typeOriginal;

  @api get type() {
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

  @api get headingSrOnly() {
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
    return computeClass({
      qld__callout: true,
      "qld__callout--calendar-event": this._type === TYPE_CALENDAREVENT,
      [this.className]: this.className
    });
  }

  get computedHeadingClass() {
    return computeClass({
      qld__callout__heading: true,
      "qld__callout__heading--sronly": this.headingSrOnly
    });
  }

  get computedIsH1() {
    return this._level === HEADINGLEVEL_1;
  }
  get computedIsH2() {
    return this._level === HEADINGLEVEL_2;
  }
  get computedIsH3() {
    return this._level === HEADINGLEVEL_3 || this._level == null;
  }
  get computedIsH4() {
    return this.level === HEADINGLEVEL_4;
  }
  get computedIsH5() {
    return this.level === HEADINGLEVEL_5;
  }
  get computedIsH6() {
    return this.level === HEADINGLEVEL_6;
  }
}
