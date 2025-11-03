/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "c/sfGpsDsOmniInput";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuQldInput.html";

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
      case "c-sf-gps-ds-osrt-time-picker":
        this._innerElement = "c-sf-gps-ds-au-qld-time-picker";
        break;

      case "c-sf-gps-ds-osrt-date-picker":
        this._innerElement = "c-sf-gps-ds-au-qld-date-picker";
        break;

      case "c-sf-gps-ds-osrt-datetime-picker":
        this._innerElement = "c-sf-gps-ds-au-qld-datetime-picker";
        break;

      default:
    }
  }

  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [...this.template.querySelectorAll(".qld__hint-text")]
      .map((item) => item.id)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
