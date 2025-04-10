/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "c/sfGpsDsOmniComboboxOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicComboboxOsN.html";

export default class extends OmnistudioCombobox {
  @api labelClassName;
  @api formGroupAddlClassName;

  /* computed */

  get computedFormGroupClassName() {
    return {
      "form-group": true,
      valid: !this.sfGpsDsIsError,
      invalid: this.sfGpsDsIsError,
      required: this.required,
      [this.formGroupAddlClassName]: this.formGroupAddlClassName
    };
  }

  get computedLabelClassName() {
    return {
      "sfgpsds-form-element__label": true,
      [this.labelClassName]: this.labelClassName
    };
  }

  get computedRplSelectClassName() {
    return {
      "rpl-select": true,
      "rpl-select--open": this.isOpen,
      "rpl-select--disabled": this.disabled
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
