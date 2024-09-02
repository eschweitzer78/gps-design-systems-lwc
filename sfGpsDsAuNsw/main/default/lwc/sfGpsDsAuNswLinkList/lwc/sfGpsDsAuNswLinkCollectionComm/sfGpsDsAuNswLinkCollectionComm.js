/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class SfGpsDsAuNswLinkCollectionComm extends NavigationMixin(
  SfGpsDsIpLwc
) {
  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      /* eslint-disable no-unused-vars */
      let cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/accessibility-statement",
          imageUrl: null,
          label: "Accessibility statement",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government/copyright",
          imageUrl: null,
          label: "Copyright",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government/disclaimer",
          imageUrl: null,
          label: "Disclaimer",
          subMenu: [],
          target: "CurrentWindow"
        }
      ]);
    }
  }

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

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

  @api className;

  mapIpData(data) {
    if (!data) {
      return null;
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    return data.map((item, index) => ({
      ...item,
      index: item.index || `item-${index + 1}`,
      text: item.text || item.label,
      url: item.url || item.actionValue
    }));
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
