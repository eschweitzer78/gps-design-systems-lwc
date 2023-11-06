/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSFormFileOsN.html";

export default class SfGpsDsAuNswSFormFileOsN extends SfGpsDsFormFileOsN {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this._propSetMap.required
    });
  }

  @track computedAriaDescribedBy;

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    this.computedAriaDescribedBy = [
      this.template.querySelector(".form__help")?.id,
      this.template.querySelector(".form__error")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }
}
