/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDateTime from "c/sfGpsDsFormDateTime";
import tmpl from "./sfGpsDsAuNswFormDateTime.html";

export default class extends SfGpsDsFormDateTime {
  initCompVariables() {
    super.initCompVariables();

    this._messageWhenRangeOverflow =
      String(
        this.allCustomLabelsUtil.OmniDateDisabledDay +
          " " +
          this.allCustomLabelsUtil.OmniDateMax
      ) + " {max}.";
    this._messageWhenRangeUnderflow =
      String(
        this.allCustomLabelsUtil.OmniDateDisabledDay +
          " " +
          this.allCustomLabelsUtil.OmniDateMin
      ) + " {min}.";
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdsaunsw-read-only";
  }
}
