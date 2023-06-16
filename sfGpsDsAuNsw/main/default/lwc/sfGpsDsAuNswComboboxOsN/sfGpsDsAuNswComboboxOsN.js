/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "omnistudio/combobox";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswComboboxOsN.html";

export default class SfGpsDsAuNswComboboxOsN extends OmnistudioCombobox {
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
      "nsw-form__label": true,
      "nsw-form__required": this.required,
      [this.labelClassName]: this.labelClassName
    });
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }
}
