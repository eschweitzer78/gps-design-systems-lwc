/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import getRecordSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getRecordSummary";
import getObjectSummary from "@salesforce/apex/SfGpsDsRecordDetailController.getObjectSummary";

import type { 
  Link 
} from "c/sfGpsDsMarkdown"

export default 
class sfGpsDsAuNswBreadcrumbsRecordComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  label: string = "Breadcrumb";

  // @ts-ignore
  @api 
  linkComponent: string = "a";

  // @ts-ignore
  @api 
  className: string = "";

  /* api: homeLabel */

  _homeLabel?: string;

  // @ts-ignore
  @api
  get homeLabel(): string {
    return this._homeLabel || "Home";
  }

  set homeLabel(value: string) {
    this._homeLabel = value;
  }

  // @ts-ignore
  @api 
  recordId?: string;
  _recordId = this.defineStringProperty("recordId", {
    watcher: () => this.updateBreadcrumbs()
  });

  // @ts-ignore
  @api 
  objectApiName?: string;
  _objectApiName = this.defineStringProperty("objectApiName", {
    watcher: () => this.updateBreadcrumbs()
  });

  /* methods */

  _items: Link[] = [];

  updateBreadcrumbs(): void {
    if (this._recordId.value) {
      getRecordSummary({ recordId: this._recordId.value })
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
          console.debug(error);
          this.addError("FR-RS", "Cannot fetch record summary");
        });
    } else if (this._objectApiName.value) {
      getObjectSummary({ objectApiName: this._objectApiName.value })
        .then((data) => {
          this._items = [
            { index: 0, text: this.homeLabel, url: "./" },
            { index: 1, text: data || "Object", url: "" }
          ];
        })
        .catch((error) => {
          console.debug(error);
          this.addError("FR-OS", "Cannot fetch object summary");
        });
    } else {
      this._items = [
        { index: 0, text: this.homeLabel, url: "./" },
        { index: 1, text: "This page", url: "" }
      ];
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
