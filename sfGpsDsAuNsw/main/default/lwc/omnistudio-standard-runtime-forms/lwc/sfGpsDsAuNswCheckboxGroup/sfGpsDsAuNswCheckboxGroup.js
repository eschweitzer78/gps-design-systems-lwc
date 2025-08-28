/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioCheckboxGroup from "c/sfGpsDsOmniCheckboxGroup";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixin";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuNswCheckboxGroup.html";

export default class extends SfGpsDsAuNswStatusHelperMixin(
  OmnistudioCheckboxGroup
) {
  @api readOnly;

  /* computed */

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLegendClassName() {
    return {
      "nsw-form__legend": true,
      "nsw-form__required": this.required
    };
  }

  get computedDisabledOrReadOnly() {
    return this.disabled || this.readOnly;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
