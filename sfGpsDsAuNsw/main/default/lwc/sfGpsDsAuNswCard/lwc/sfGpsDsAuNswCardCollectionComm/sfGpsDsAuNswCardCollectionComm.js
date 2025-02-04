/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { htmlDecode, isArray } from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class extends SfGpsDsIpLwc {
  @api cstyle = "white";
  @api headline = false;
  @api orientation = "vertical";
  @api displayDate = false;
  @api dateStyle = "medium";

  @api xsWidth = "12";
  @api smWidth = "12";
  @api mdWidth = "6";
  @api lgWidth = "6";
  @api xlWidth = "4";
  @api className;

  /* api: ipName, String */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON, String */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-grid": true,
      [this.className]: this.className
    };
  }

  get computedColClassName() {
    return {
      "nsw-col": true,
      ["nsw-col-xs-" + this.xsWidth]: this.xsWidth,
      ["nsw-col-sm-" + this.smWidth]: this.smWidth,
      ["nsw-col-md-" + this.mdWidth]: this.mdWidth,
      ["nsw-col-lg-" + this.lgWidth]: this.lgWidth,
      ["nsw-col-xl-" + this.xlWidth]: this.xlWidth
    };
  }

  get isEmpty() {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  /* methods */

  mapIpData(data) {
    if (!data) {
      return null;
    }

    if (!isArray(data)) {
      data = [data];
    }

    return data.map((card, index) => ({
      ...card,
      title: card.title || card.headline, // it used to be called headline in v1
      copy: card.copy ? htmlDecode(card.copy) : null,
      footer: card.footer ? htmlDecode(card.footer) : null,
      index: card.index || `card-${index + 1}`
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
