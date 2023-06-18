/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioDatetimePicker from "omnistudio/datetimePicker";
import tmpl from "./sfGpsDsUkGovDatetimePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const timeQueryClass = "c-sf-gps-ds-uk-gov-time-picker-os-n";
const dateQueryClass = "c-sf-gps-ds-uk-gov-date-picker-os-n";

const I18N = {
  timeLabel: "Time"
};

export default class SfGpsDsUkGovDatetimePickerOsN extends OmnistudioDatetimePicker {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "govuk-label": true,
      "govuk-label--l": true
    });
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

  get i18n() {
    return I18N;
  }

  setCustomValidity(e) {
    this.template.querySelector(dateQueryClass).setCustomValidity(e);
    this.template.querySelector(timeQueryClass).setCustomValidity(e);
  }
}
