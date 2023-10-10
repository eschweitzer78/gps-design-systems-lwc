/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { htmlDecode, computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class SfGpsDsAuNswCardCollectionComm extends SfGpsDsIpLwc {
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

  @api cstyle = "white";
  @api orientation = "vertical";
  @api displayDate = false;
  @api dateStyle = "medium";

  @api xsWidth = "12";
  @api smWidth = "12";
  @api mdWidth = "6";
  @api lgWidth = "6";
  @api xlWidth = "4";
  @api className;

  mapIpData(data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    return data.map((card, index) => ({
      ...card,
      copy: card.copy ? htmlDecode(card.copy) : null,
      footer: card.footer ? htmlDecode(card.footer) : null,
      index: card.index || `card-${index + 1}`
    }));
  }

  get computedClassName() {
    return computeClass({
      "nsw-grid": true,
      [this.className]: this.className
    });
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

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
