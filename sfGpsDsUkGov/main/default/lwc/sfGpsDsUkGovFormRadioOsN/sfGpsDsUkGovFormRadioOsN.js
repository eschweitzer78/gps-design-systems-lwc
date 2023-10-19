/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
  required-label={allCustomLabelsUtil.OmniRequired} not supported
  field-level-help-position={_propSetMap.helpTextPos} not supported
  theme={_theme} not supported
  alignment={_horizontalMode} not supported
*/

import { api, track } from "lwc";
import OmniscriptRadio from "omnistudio/omniscriptRadio";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsUkGovFormRadioOsN.html";

const DEFAULT_LABEL_SIZE = "large";

export default class SfGpsDsUkGovFormRadioOsN extends OmniscriptRadio {
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

      console.log(
        "SfGpsDsUkGovFormRadioOsN: child does not have getErrorDetails api"
      );
    }

    console.log("SfGpsDsUkGovFormRadioOsN: child not found");
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
