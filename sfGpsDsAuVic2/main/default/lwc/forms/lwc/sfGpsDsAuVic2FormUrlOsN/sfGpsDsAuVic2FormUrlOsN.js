/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormUrlOsN from "c/sfGpsDsFormUrlOsN";
import tmpl from "./sfGpsDsAuVic2FormUrlOsN.html";

export default class extends SfGpsDsFormUrlOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdsauvic2-read-only";
    this.classList.add("rpl-form__outer");
    this.hostElement.style.display = "block";
  }
}
