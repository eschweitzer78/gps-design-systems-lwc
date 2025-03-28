/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "c/sfGpsDsOmniInputOsN";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuQldInputOsN.html";

export default class extends StatusHelperMixin(OmniscriptInput) {
  @api labelClassName;

  /* computed */

  get computedLabelClassName() {
    return {
      qld__label: true,
      [this.labelClassName]: this.labelClassName
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* Methods */

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-au-qld-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-au-qld-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-au-qld-datetime-picker-os-n";
        break;

      default:
    }
  }

  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [...this.template.querySelectorAll(".qld__label")]
      .map((item) => item.id)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
