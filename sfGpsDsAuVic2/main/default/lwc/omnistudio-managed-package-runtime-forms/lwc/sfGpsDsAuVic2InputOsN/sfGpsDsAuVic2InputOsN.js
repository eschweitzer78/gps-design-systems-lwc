/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "c/sfGpsDsOmniInputOsN";
import { computeClass, normaliseBoolean } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVic2InputOsN.html";

const HIDEREQUIRED_DEFAULT = false;

export default class extends OmniscriptInput {
  @api inputClassName;

  /* api: hideRequired */

  _hideRequired = HIDEREQUIRED_DEFAULT;
  _hideRequiredOriginal = HIDEREQUIRED_DEFAULT;

  @api
  get hideRequired() {
    return this._hireRequiredOriginal;
  }

  set hideRequired(value) {
    this._hideRequiredOriginal = value;
    this._hideRequired = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HIDEREQUIRED_DEFAULT
    });
  }

  /* computed */

  get helperId() {
    return "helper";
  }

  get computedInputClassName() {
    return {
      "rpl-form__input": true,
      "rpl-form__input--default": true,
      "rpl-form__input--disabled": this.disabled,
      "rpl-form__input--invalid": this.sfGpsDsIsError,
      "rpl-form__input--with-prefix-icon": false,
      "rpl-form__input--with-suffix-icon": false,
      [this.inputClassName]: this.inputClassName
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedDisabledReadOnly() {
    return this.disabled || this.readOnly;
  }

  /* methods */

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-au-vic2-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-au-vic2-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-au-vic2-datetime-picker-os-n";
        break;

      default:
    }
  }

  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [
      this.template.querySelector(".rpl-form-validation-error")?.id,
      this.template.querySelector(".rpl-form-help")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    if (!this._hideRequired) {
      this.setAttribute("data-invalid", this.sfGpsDsIsError);
    }
  }
}
