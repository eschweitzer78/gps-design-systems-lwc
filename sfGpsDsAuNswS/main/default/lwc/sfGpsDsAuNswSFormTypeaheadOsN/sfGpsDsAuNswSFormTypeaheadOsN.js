/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* 19-OCT-2023: omni246.5 added a readOnly mapping to the contained typeahead but that attribute apparently
   does not exist in the original widget anyway. */

import SfGpsDsFormTypeaheadOsN from "c/sfGpsDsFormTypeaheadOsN";
import tmpl from "./sfGpsDsAuNswSFormTypeaheadOsN.html";

export default class SfGpsDsAuNswSFormTypeaheadOsN extends SfGpsDsFormTypeaheadOsN {
  render() {
    return tmpl;
  }
}
