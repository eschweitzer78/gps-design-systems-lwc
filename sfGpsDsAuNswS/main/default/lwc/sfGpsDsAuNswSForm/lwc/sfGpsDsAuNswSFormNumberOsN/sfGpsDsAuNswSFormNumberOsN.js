/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormNumberOsN from "c/sfGpsDsFormNumberOsN";
import tmpl from "./sfGpsDsAuNswSFormNumberOsN.html";

export default class extends SfGpsDsFormNumberOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
