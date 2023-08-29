/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "omnistudio/combobox";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovComboboxOsN.html";

export default class SfGpsDsUkGovComboboxOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioCombobox
) {
  @api labelClassName;

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
      errorMessageBlock: this.isError,
      helper: this.fieldLevelHelp
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "govuk-label": true,
      [this.labelClassName]: this.labelClassName
    });
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
