/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "c/sfGpsDsOmniCheckboxGroupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import { api } from "lwc";
import tmpl from "./sfGpsDsAuVic2CheckboxGroupOsN.html";

/* We're not leveraging the sfGpsDsAuVicIcon class as the light dom it's using is not 
   supported in a different runtimeSpace */

export default class extends OmnistudioCheckboxGroup {
  @api variant;

  render() {
    return tmpl;
  }

  get computedOptionClassName() {
    return {
      "rpl-form-option": true,
      "rpl-form-option--default": this.variant === "default",
      "rpl-form-option--reverse": this.variant === "reverse"
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.fieldLevelHelp && this.sfGpsDsIsError
    });
  }
}
