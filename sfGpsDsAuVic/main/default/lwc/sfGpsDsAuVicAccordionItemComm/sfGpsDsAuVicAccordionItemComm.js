/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicAccordionItemComm extends SfGpsDsLwc {
  @api index; // only used if part of a group
  @api title;

  // closed

  _closed = true;

  @api get closed() {
    return this._closed;
  }

  set closed(value) {
    this._closed = value;
  }

  @api content;
  @api className;

  handleExpand() {
    this._closed = false;
    this.dispatchEvent(new CustomEvent("expand"));
  }

  handleCollapse() {
    this._closed = true;
    this.dispatchEvent(new CustomEvent("collapse"));
  }
}
