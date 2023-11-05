/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "c/sfGpsDsOmniInputOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSInputOsN.html";

export default class SfGpsDsAuNswSInputOsN extends OmniscriptInput {
  @api useLegend = false; /* not used from omni, so it's a default value */

  render() {
    return tmpl;
  }

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-au-nsw-s-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-au-nsw-s-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-au-nsw-s-datetime-picker-os-n";
        break;

      default:
    }
  }

  /* original input widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [
      this.template.querySelector(".form__help")?.id,
      this.template.querySelector(".form__error")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  /* Getters */
  /* ------- */

  get helperId() {
    return "helper";
  }

  get computedLegendClassName() {
    return "";
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedInputClassName() {
    return computeClass({
      form__text: true,
      error: this.sfGpsDsIsError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }
}
