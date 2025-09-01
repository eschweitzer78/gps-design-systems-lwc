/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormSelect from "c/sfGpsDsFormSelectOsN";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixinOsN";
import tmpl from "./sfGpsDsAuVic2FormSelectOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixin(SfGpsDsFormSelect) {
  get decoratedRealtimeOptions() {
    return this._realtimeOptions.slice(1);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
