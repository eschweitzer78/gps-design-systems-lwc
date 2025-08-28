/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptBlock from "omnistudio/omniscriptBlock";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import tmpl from "./sfGpsDsAuNswSFormSummaryBlockOsN.html";

export default class extends OmniscriptBlock {
  /* computed */

  get mergedBlockLabel() {
    return omniGetMergedField(this, this.blockLabel);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
