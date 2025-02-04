/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormTimeOsN from "c/sfGpsDsFormTimeOsN";
import tmpl from "./sfGpsDsAuVicFormTimeOsN.html";

export default class extends SfGpsDsFormTimeOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
