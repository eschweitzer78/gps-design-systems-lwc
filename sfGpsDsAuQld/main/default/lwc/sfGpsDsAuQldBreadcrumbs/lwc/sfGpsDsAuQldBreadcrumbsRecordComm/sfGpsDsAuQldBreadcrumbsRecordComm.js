/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import getRecordSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getRecordSummary";
import getObjectSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getObjectSummary";

export default class extends SfGpsDsLwc {
  @api mode;
  @api label = "Breadcrumb";
  @api objectLabel;
  @api homeLabel;
  @api className = "";

  @track _itemsArray = [];

  /* api: recordId */

  _recordIdOriginal;

  @api set recordId(recordId) {
    this._recordIdOriginal = recordId;
    this.updateBreadcrumbs();
  }

  get recordId() {
    return this._recordIdOriginal;
  }

  /* api: objectApiName */

  _objectApiName;

  @api set objectApiName(oan) {
    this._objectApiNameOriginal = oan;
    this.updateBreadcrumbs();
  }

  get objectApiName() {
    return this._objectApiNameOriginal;
  }

  /* methods */

  updateBreadcrumbs() {
    if (this._recordIdOriginal) {
      getRecordSummary({ recordId: this._recordIdOriginal })
        .then((data) => {
          this._itemsArray = [
            { index: 0, text: this.homeLabel || "Home", url: "../" },
            {
              index: 1,
              text: this.objectLabel || data[0] || "Object",
              url: `../${data[1] || "object"}/Default`
            },
            { index: 2, text: data[2] || "This record", url: "" }
          ];
        })
        .catch((error) => {
          console.log(error);
          this.addError("FR-RS", "Cannot fetch record summary");
        });
    } else if (this._objectApiNameOriginal) {
      getObjectSummary({ objectApiName: this._objectApiNameOriginal })
        .then((data) => {
          this._itemsArray = [
            { index: 0, text: this.homeLabel || "Home", url: "./" },
            { index: 1, text: this.objectLabel || data || "Object", url: "" }
          ];
        })
        .catch((error) => {
          console.log(error);
          this.addError("FR-OS", "Cannot fetch object summary");
        });
    } else {
      this._itemsArray = [
        { index: 0, text: this.homeLabel || "Home", url: "./" },
        { index: 1, text: "This page", url: "" }
      ];
    }
  }
  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
