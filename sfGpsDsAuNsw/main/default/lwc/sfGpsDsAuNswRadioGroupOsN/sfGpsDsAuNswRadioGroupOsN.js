/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "omnistudio/radioGroup";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswRadioGroupOsN.html";

export default class SfGpsDsAuNswRadioGroupOsN extends OmnistudioRadioGroup {
  render() {
    return tmpl;
  }

  renderedCallback() {
    // Fixing issue #19
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  get computedLegendClassName() {
    return computeClass({
      "nsw-form__legend": true,
      "nsw-form__required": this.required
    });
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }
}
