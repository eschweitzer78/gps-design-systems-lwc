/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTextarea from "c/sfGpsDsOmniTextareaOsN";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswTextareaOsN.html";

export default class SfGpsDsAuNswTextareaOsN extends StatusHelperMixin(
  OmnistudioTextarea
) {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this.required
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }
}
