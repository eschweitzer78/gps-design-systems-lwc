/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import OmnistudioTextarea from "omnistudio/textarea";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswTextareaOsN.html";

export default class SfGpsDsAuNswTextareaOsN extends OmnistudioTextarea {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this.required
    });
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }

  get ariaDescribedBy() {
    return computeClass({
      textarealabel: true,
      errorMessageBlock: this.isError
    });
  }
}
