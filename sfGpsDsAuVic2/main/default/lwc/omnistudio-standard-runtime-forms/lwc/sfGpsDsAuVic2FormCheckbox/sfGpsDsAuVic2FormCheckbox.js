/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormCheckbox from "c/sfGpsDsFormCheckbox";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixin";
import tmpl from "./sfGpsDsAuVic2FormCheckbox.html";

export default class extends SfGpsDsAuVic2FormElementMixin(
  SfGpsDsFormCheckbox
) {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
