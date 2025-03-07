/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormTextareaOsN from "c/sfGpsDsFormTextareaOsN";
import tmpl from "./sfGpsDsAuVic2FormTextareaOsN.html";

export default class extends SfGpsDsFormTextareaOsN {
  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.classList.add("rpl-form__outer");
    this.hostElement.style.display = "block";
  }
}
