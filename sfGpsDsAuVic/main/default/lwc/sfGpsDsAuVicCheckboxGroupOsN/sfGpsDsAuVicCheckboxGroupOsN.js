/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import OmnistudioCheckboxGroup from "omnistudio/checkboxGroup";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicCheckboxGroupOsN.html";

/* We're not leveraging the sfGpsDsAuVicIcon class as the light dom it's using is not 
   supported in a different runtimeSpace */

export default class SfGpsDsAuVicCheckboxGroupOsN extends OmnistudioCheckboxGroup {
  render() {
    return tmpl;
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.fieldLevelHelp && this.isError
    });
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      valid: !this.isError,
      invalid: this.isError,
      required: this.required
    });
  }

  get _decoratedInternalOpts() {
    return this.internalOpts.map((item) => ({
      ...item,
      boxClassName: computeClass({
        "rpl-checkbox__box": true,
        "rpl-checkbox__box--checked": item.selected
      })
    }));
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }
}
