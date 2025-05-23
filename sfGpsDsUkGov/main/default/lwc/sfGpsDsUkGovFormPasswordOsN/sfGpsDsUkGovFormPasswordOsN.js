/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormPasswordOsN from "c/sfGpsDsFormPasswordOsN";
import tmpl from "./sfGpsDsUkGovFormPasswordOsN.html";

export default class extends SfGpsDsFormPasswordOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
