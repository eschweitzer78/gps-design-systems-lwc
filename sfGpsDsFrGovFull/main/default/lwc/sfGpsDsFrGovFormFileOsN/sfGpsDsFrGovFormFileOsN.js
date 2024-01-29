/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovFormFileOsN.html";

export default class extends SfGpsDsFormFileOsN {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "fr-upload-group": true,
      "fr-input-group--error": this.sfGpsDsIsError
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "fr-label": true
    });
  }

  @track computedAriaDescribedBy;

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    this.computedAriaDescribedBy = [
      this.template.querySelector(".fr-hint-text")?.id,
      this.template.querySelector(".fr-error-text")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  get _errorMessage() {
    return this.sfGpsDsErrorMessage?.replace("Error: ", "");
  }
}
