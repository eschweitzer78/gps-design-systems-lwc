/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDateOsN from "c/sfGpsDsFormDateOsN";
import tmpl from "./sfGpsDsFrGovFormDateOsN.html";

export default class extends SfGpsDsFormDateOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
