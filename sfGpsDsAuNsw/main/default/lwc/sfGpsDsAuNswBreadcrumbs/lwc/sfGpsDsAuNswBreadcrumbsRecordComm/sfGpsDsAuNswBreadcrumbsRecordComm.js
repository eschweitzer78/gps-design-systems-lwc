/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import getRecordSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getRecordSummary";
import getObjectSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getObjectSummary";

export default class extends SfGpsDsLwc {
  @api label = "Breadcrumb";
  @api linkComponent = "a";
  @api className = "";

  /* api: homeLabel */

  @api
  get homeLabel() {
    return this._homeLabel || "Home";
  }

  set homeLabel(value) {
    this._homeLabel = value;
  }

  /* api: recordId */

  _recordIdOriginal;

  @api
  get recordId() {
    return this._recordIdOriginal;
  }

  set recordId(recordId) {
    this._recordIdOriginal = recordId;
    this.updateBreadcrumbs();
  }

  /* api: objectApiName */

  _objectApiName;
  _objectApiNameOriginal;

  @api
  get objectApiName() {
    return this._objectApiNameOriginal;
  }

  set objectApiName(oan) {
    this._objectApiNameOriginal = oan;
    this.updateBreadcrumbs();
  }

  /* methods */

  _items = [];

  updateBreadcrumbs() {
    if (this._recordIdOriginal) {
      getRecordSummary({ recordId: this._recordIdOriginal })
        .then((data) => {
          this._items = [
            { index: 0, text: this.homeLabel, url: "../" },
            {
              index: 1,
              text: data[0] || "Object",
              url: `../recordlist/${data[1] || "object"}/Default`
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
          this._items = [
            { index: 0, text: this.homeLabel, url: "./" },
            { index: 1, text: data || "Object", url: "" }
          ];
        })
        .catch((error) => {
          console.log(error);
          this.addError("FR-OS", "Cannot fetch object summary");
        });
    } else {
      this._items = [
        { index: 0, text: this.homeLabel || "Home", url: "./" },
        { index: 1, text: "This page", url: "" }
      ];
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
