/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* notes
      field-level-help-position={_propSetMap.helpTextPos} not supported
      required-label={allCustomLabelsUtil.OmniRequired} not suppported
      icon-name="utility:info" not supported
*/

import { api, track } from "lwc";
import OmniscriptPassword from "omnistudio/omniscriptPassword";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsUkGovFormPasswordOsN.html";

const DEFAULT_LABEL_SIZE = "large";

export default class SfGpsDsUkGovFormPasswordOsN extends OmniscriptPassword {
  @track labelSize = DEFAULT_LABEL_SIZE;

  initCompVariables() {
    super.initCompVariables();

    this.labelSize =
      this.jsonDef &&
      this._propSetMap &&
      this._propSetMap.labelSize !== undefined
        ? this._propSetMap.labelSize
        : DEFAULT_LABEL_SIZE;
  }

  render() {
    return tmpl;
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector("[data-omni-input]");

    if (elt) {
      if (elt.getErrorDetails) {
        return elt.getErrorDetails();
      }

      console.log("child does not have getErrorDetails api");
    }

    console.log("child not found");
    return null;
  }

  @api scrollTo() {
    const input = this.template.querySelector("[data-omni-input]");
    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }
}
