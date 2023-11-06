/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswFormFileOsN.html";

export default class SfGpsDsAuNswFormFileOsN extends SfGpsDsAuNswStatusHelperMixin(
  SfGpsDsFormFileOsN
) {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this._propSetMap.required
    });
  }

  @track computedAriaDescribedBy;

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    this.computedAriaDescribedBy = [
      ...this.template.querySelectorAll(".nsw-form__helper")
    ]
      .map((item) => item.id)
      .join(" ");
  }
}
