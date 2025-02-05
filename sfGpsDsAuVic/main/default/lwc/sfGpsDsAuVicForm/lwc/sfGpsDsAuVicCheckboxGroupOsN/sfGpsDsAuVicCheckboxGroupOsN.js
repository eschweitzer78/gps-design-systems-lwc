/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "c/sfGpsDsOmniCheckboxGroupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicCheckboxGroupOsN.html";

/* We're not leveraging the sfGpsDsAuVicIcon class as the light dom it's using is not 
   supported in a different runtimeSpace */

export default class extends OmnistudioCheckboxGroup {
  render() {
    return tmpl;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.fieldLevelHelp && this.sfGpsDsIsError
    });
  }

  get computedFormGroupClassName() {
    return {
      "form-group": true,
      valid: !this.sfGpsDsIsError,
      invalid: this.sfGpsDsIsError,
      required: this.required
    };
  }

  get sfGpsDsInternalOpts() {
    return this.internalOpts.map((item) => ({
      ...item,
      boxClassName: {
        "rpl-checkbox__box": true,
        "rpl-checkbox__box--checked": item.selected
      }
    }));
  }
}
