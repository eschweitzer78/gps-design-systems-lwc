/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "omnistudio/combobox";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSComboboxOsN.html";

export default class SfGpsDsAuNswSComboboxOsN extends OmnistudioCombobox {
  @api labelClassName;

  render() {
    return tmpl;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      errorMessageBlock: this.isError,
      helper: this.fieldLevelHelp
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required,
      [this.labelClassName]: this.labelClassName
    });
  }
}
