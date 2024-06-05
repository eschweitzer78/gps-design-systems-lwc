/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class SfGpsDsAuNswMainNavComm extends SfGpsDsNavigation {
  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      let cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "InternalLink",
          actionValue: cbp + "/get-involved",
          imageUrl: null,
          label: "Get involved",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "InternalLink",
          actionValue: cbp + "/stories",
          imageUrl: null,
          label: "Stories",
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

  //

  @api megaMenu = false;
  @api className;
  @api isActive = false;
  @api mainNavId;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  /* events */

  handleCloseMenu() {
    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }

  handleNavigate(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }
}
