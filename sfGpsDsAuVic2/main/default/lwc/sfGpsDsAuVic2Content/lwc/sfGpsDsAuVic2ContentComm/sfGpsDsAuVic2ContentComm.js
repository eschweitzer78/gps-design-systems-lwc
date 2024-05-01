/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class sfGpsDsAuVic2ContentComm extends SfGpsDsLwc {
  @api markup;
  @api className;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
