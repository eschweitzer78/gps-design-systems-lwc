/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptTextarea from "omnistudio/textarea";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSTextareaOsN.html";

export default class extends OmniscriptTextarea {
  /* computed */

  get computedLabelClassName() {
    return {
      "form-required": this.required
    };
  }

  get computedInputClassName() {
    return {
      form__textarea: true,
      error: this.sfGpsDsIsError
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
