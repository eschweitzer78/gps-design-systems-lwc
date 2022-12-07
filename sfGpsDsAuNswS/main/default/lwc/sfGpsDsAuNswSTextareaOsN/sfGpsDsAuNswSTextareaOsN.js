/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptTextarea from "omnistudio/textarea";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSTextareaOsN.html";

export default class SfGpsDsAuNswSTextareaOsN extends OmniscriptTextarea {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedInputInputClassName() {
    return computeClass({
      form__textarea: true,
      error: this.isError
    });
  }

  get ariaDescribedBy() {
    return computeClass({
      textarealabel: true,
      errorMessageBlock: this.isError
    });
  }
}
