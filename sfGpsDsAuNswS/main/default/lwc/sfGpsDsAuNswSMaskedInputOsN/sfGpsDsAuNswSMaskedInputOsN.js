/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import maskedInput from "omnistudio/maskedInput";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSMaskedInputOsN.html";

export default class SfGpsDsAuNswSMaskedInputOsN extends maskedInput {
  @api useLegend = false; /* not used from omni, so it's a default value */

  render() {
    return tmpl;
  }

  get helperId() {
    return "helper";
  }

  get computedLegendClassName() {
    return "";
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedInputInputClassName() {
    return computeClass({
      "vlocity-input": true,
      "nsw-form__text": true,
      "nsw-form__number": true,
      error: this.isError
    });
  }
}
