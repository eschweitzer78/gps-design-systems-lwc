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

import SfGpsDsFormTextareaOsN from "c/sfGpsDsFormTextareaOsN";
import tmpl from "./sfGpsDsUkGovFormTextareaWithCounterOsN.html";

export default class SfGpsDsUkGovFormTextAreaOsN extends SfGpsDsFormTextareaOsN {
  render() {
    return tmpl;
  }
}
