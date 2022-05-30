/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptTextarea from "omnistudio/textarea";
import tmpl from "./sfGpsDsAuNswSTextareaOsN.html";

export default class SfGpsDsAuNswSTextareaOsN extends OmniscriptTextarea {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return this.required ? "form-required" : "";
  }

  get computedInputInputClassName() {
    return `form__textarea ${this.isError ? "error" : ""}`;
  }

  get ariaDescribedBy() {
    return this.isError ? "textarealabel errorMessageBlock" : "textarealabel";
  }
}
