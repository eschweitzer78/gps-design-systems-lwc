/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormCurrencyOsN from "c/sfGpsDsFormCurrencyOsN";
import tmpl from "./sfGpsDsAuNswSFormCurrencyOsN.html";

export default class extends SfGpsDsFormCurrencyOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
