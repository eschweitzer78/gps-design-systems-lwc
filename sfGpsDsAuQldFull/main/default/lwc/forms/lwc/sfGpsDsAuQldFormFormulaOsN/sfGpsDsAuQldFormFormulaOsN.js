/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormFormulaOsN from "c/sfGpsDsFormFormulaOsN";
import tmpl from "./sfGpsDsAuQldFormFormulaOsN.html";

export default class extends SfGpsDsFormFormulaOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
