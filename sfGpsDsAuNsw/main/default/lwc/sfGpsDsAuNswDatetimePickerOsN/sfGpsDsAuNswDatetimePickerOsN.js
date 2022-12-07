/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioDatetimePicker from "omnistudio/datetimePicker";
import tmpl from "./sfGpsDsAuNswDatetimePickerOsN.html";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

const timeQueryClass = "c-sf-gps-ds-au-nsw-time-picker-os-n";
const dateQueryClass = "c-sf-gps-ds-au-nsw-date-picker-os-n";

export default class SfGpsDsAuNswDatetimePickerOsN extends OmnistudioDatetimePicker {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this.required
    });
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }

  get timeEl() {
    if (!this._timeEl) {
      this._timeEl = this.template.querySelector(timeQueryClass);
    }

    return this._timeEl;
  }

  get dateEl() {
    if (!this._dateEl) {
      this._dateEl = this.template.querySelector(dateQueryClass);
    }

    return this._dateEl;
  }

  setCustomValidity(e) {
    this.template.querySelector(dateQueryClass).setCustomValidity(e);
    this.template.querySelector(timeQueryClass).setCustomValidity(e);
  }
}
