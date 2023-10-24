/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "omnistudio/datetimePicker";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import tmpl from "./sfGpsDsUkGovDatetimePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const TIME_SELECTOR = "c-sf-gps-ds-uk-gov-time-picker-os-n";
const DATE_SELECTOR = "c-sf-gps-ds-uk-gov-date-picker-os-n";
// const ERROR_ID_SELECTOR = "[data-sf-gps-uk-gov-error-input]";
// const DEBUG = false;

const I18N = {
  timeLabel: "Time"
};

export default class SfGpsDsUkGovDatetimePickerOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioDatetimePicker,
  "large"
) {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp
    });
  }

  get timeEl() {
    if (!this._timeEl) {
      this._timeEl = this.template.querySelector(TIME_SELECTOR);
    }

    return this._timeEl;
  }

  get dateEl() {
    if (!this._dateEl) {
      this._dateEl = this.template.querySelector(DATE_SELECTOR);
    }

    return this._dateEl;
  }

  get i18n() {
    return I18N;
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector("[data-omni-date-input]");

    if (elt) {
      if (elt.getErrorDetails) {
        const ed = elt.getErrorDetails();
        if (ed) return ed;
      } else {
        console.log("date child does not have getErrorDetails api");
      }
    } else {
      console.log("date child not found");
    }

    elt = this.template.querySelector("[data-omni-time-input]");

    if (elt) {
      if (elt.getErrorDetails) {
        const ed = elt.getErrorDetails();
        if (ed) return ed;
      } else {
        console.log("time child does not have getErrorDetails api");
      }
    } else {
      console.log("time child not found");
    }

    return null;
  }

  setCustomValidity(e) {
    this.template.querySelector(DATE_SELECTOR).setCustomValidity(e);
    this.template.querySelector(TIME_SELECTOR).setCustomValidity(e);
  }
}
