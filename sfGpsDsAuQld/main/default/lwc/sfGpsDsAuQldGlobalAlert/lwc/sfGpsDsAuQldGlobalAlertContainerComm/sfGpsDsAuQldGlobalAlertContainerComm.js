/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { htmlDecode, toArray } from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class extends SfGpsDsIpLwc {
  @api className;

  /* api: ipName */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* methods */

  mapIpData(data) {
    if (!data) {
      return null;
    }

    return toArray(data).map((alert, index) => ({
      ...alert,
      content: alert.content ? htmlDecode(alert.content) : null,
      id: alert.id || `alert-${index + 1}`,
      _isOpen: true
    }));
  }

  get computedClassName() {
    return {
      "qld__global-alerts": true,
      [this.className]: this.className
    };
  }

  /* event management */

  handleClose(event) {
    const targetItem = this._items.find(
      (alert) => alert.id === event.target.alertId
    );

    if (targetItem?.dismissible) {
      targetItem._isOpen = false;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("qld-scope");
  }
}
