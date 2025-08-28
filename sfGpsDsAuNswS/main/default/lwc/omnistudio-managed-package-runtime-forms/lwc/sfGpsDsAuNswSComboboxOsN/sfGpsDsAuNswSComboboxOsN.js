/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "c/sfGpsDsOmniComboboxOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSComboboxOsN.html";

export default class extends OmnistudioCombobox {
  @api labelClassName;

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLabelClassName() {
    return {
      "form-required": this.required,
      [this.labelClassName]: this.labelClassName
    };
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
