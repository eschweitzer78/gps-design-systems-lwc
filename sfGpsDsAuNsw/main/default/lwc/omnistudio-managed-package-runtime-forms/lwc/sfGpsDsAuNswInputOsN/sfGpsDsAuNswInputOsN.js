/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "c/sfGpsDsOmniInputOsN";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswInputOsN.html";

export default class extends StatusHelperMixin(OmniscriptInput) {
  @api labelClassName;

  /* methods */

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-au-nsw-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-au-nsw-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-au-nsw-datetime-picker-os-n";
        break;

      default:
    }
  }

  /* computed */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required,
      [this.labelClassName]: this.labelClassName
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* methods */
  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [...this.template.querySelectorAll(".nsw-form__helper")]
      .map((item) => item.id)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
