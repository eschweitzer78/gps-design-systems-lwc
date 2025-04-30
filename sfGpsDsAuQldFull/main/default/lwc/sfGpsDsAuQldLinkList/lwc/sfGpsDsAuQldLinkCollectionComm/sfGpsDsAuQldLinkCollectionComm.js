/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { toArray } from "c/sfGpsDsHelpers";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldLinkCollectionComm";

export default class extends SfGpsDsNavigation {
  @api listMode;
  @api title;
  @api titleClassName;
  @api linkClassName;
  @api anchorClassName;
  @api className;

  /* api: mode */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      this._items = this.mapIpData([
        {
          actionType: "ExternalLink",
          actionValue:
            "https://www.health.qld.gov.au/global/copyright-statement",
          imageUrl: null,
          label: "Copyright",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.health.qld.gov.au/global/disclaimer",
          imageUrl: null,
          label: "Disclaimer",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.health.qld.gov.au/global/privacy",
          imageUrl: null,
          label: "Privacy",
          subMenu: [],
          target: "CurrentWindow"
        }
      ]);
    }
  }

  /* api: navigationDevName */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

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

  /* api: cvaLink */

  _cvaLink;
  _cvaLinkOriginal;

  @api
  get cvaLink() {
    return this._cvaLinkOriginal;
  }

  set cvaLink(markdown) {
    try {
      this._cvaLinkOriginal = markdown;
      this._cvaLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError(
        "HL-MD",
        "Issue when parsing Column View All Link markdown"
      );
      if (DEBUG) console.debug(CLASS_NAME, "set cvaLink", e);
    }
  }

  /* computed */

  get _cvaText() {
    return this._cvaLink?.text;
  }

  get _cvaUrl() {
    return this._cvaLink?.url;
  }

  /* methods */

  mapIpData(data) {
    if (!data) {
      return null;
    }

    return toArray(data).map((item, index) => ({
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
    this.classList.add("qld-scope");
  }
}
