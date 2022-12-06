/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "omnistudio/datetimePicker";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSDatetimePickerOsN.html";

const timeQueryClass = "c-sf-gps-ds-au-nsw-s-time-picker-os-n";
const dateQueryClass = "c-sf-gps-ds-au-nsw-s-date-picker-os-n";

export default class SfGpsDsAuNswSDatetimePickerOsN extends OmnistudioDatetimePicker {
  @api hideFormGroup = false;

  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedFormGroupClassName() {
    return computeClass({
      form__datetime: true,
      form__group: !this.hideFormGroup
    });
  }

  get computedFormItemClassName() {
    return "form__item";
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
