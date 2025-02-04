/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCombobox from "c/sfGpsDsOmniComboboxOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswComboboxOsN.html";

export default class extends SfGpsDsAuNswStatusHelperMixin(OmnistudioCombobox) {
  @api labelClassName;

  /* computed */

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required,
      [this.labelClassName]: this.labelClassName
    };
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
