/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormEmailOsN from "c/sfGpsDsFormEmailOsN";
import tmpl from "./sfGpsDsAuQldFormEmailOsN.html";

export default class extends SfGpsDsFormEmailOsN {
  render() {
    return tmpl;
  }
}