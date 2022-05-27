/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { htmlDecode } from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class SfGpsDsAuNswContentBlockCollectionComm extends SfGpsDsIpLwc {
  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  @api xsWidth = "12";
  @api smWidth = "12";
  @api mdWidth = "6";
  @api lgWidth = "6";
  @api xlWidth = "4";
  @api className;

  mapIpData(data) {
    return data.map((block) => ({
      ...block,
      copy: block.copy ? htmlDecode(block.copy) : null
    }));
  }

  get computedClassName() {
    return `nsw-grid ${this.className ? this.className : ""}`;
  }

  get computedColClassName() {
    return `nsw-col ${this.xsWidth ? "nsw-col-xs-" + this.xsWidth : ""} ${
      this.smWidth ? "nsw-col-sm-" + this.smWidth : ""
    } ${this.mdWidth ? "nsw-col-md-" + this.mdWidth : ""}  ${
      this.lgWidth ? "nsw-col-lg-" + this.lgWidth : ""
    }  ${this.xlWidth ? "nsw-col-xl-" + this.xlWidth : ""}`;
  }

  get isEmpty() {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
