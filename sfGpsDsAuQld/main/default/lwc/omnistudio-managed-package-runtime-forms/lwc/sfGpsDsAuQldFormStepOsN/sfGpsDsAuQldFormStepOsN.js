/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.11
 */

import SfGpsDsFormStep from "c/sfGpsDsFormStepOsN";
import tmpl from "./sfGpsDsAuQldFormStepOsN.html";

export default class extends SfGpsDsFormStep {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
