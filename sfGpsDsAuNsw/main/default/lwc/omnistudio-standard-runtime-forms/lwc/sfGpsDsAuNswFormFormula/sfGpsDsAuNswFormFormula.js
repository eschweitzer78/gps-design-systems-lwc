/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* notes
      field-level-help-position={_propSetMap.helpTextPos} not supported
      required-label={allCustomLabelsUtil.OmniRequired} not suppported
      icon-name="utility:info" not supported
*/

import SfGpsDsFormFormula from "c/sfGpsDsFormFormula";
import tmpl from "./sfGpsDsAuNswFormFormula.html";

export default class extends SfGpsDsFormFormula {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
