/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "omnistudio/input";
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

  get computedInputInputClassName() {
    return computeClass({
      "vlocity-input": true,
      form__text: true,
      error: this.isError
    });
  }
}
