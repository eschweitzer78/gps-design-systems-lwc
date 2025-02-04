/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormPlacesTypeahead from "c/sfGpsDsFormPlacesTypeaheadOsN";
import tmpl from "./sfGpsDsUkGovFormPlacesTypeaheadOsN.html";

export default class extends SfGpsDsFormPlacesTypeahead {
  /* computed */

  get trueValue() {
    return true;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
