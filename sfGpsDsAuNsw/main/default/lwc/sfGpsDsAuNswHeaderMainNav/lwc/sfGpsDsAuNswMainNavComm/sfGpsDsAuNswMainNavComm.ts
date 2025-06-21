/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import SfGpsDsNavigationService from "c/SfGpsDsNavigationService";

export default 
class SfGpsDsAuNswMainNavComm
extends SfGpsDsNavigation {
  // @ts-ignore
  @api 
  megaMenu: boolean = false;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  isActive: boolean = false;

  // @ts-ignore
  @api 
  mainNavId?: string;

  /* api: mode */

  // @ts-ignore
  @api
  // @ts-ignore
  get mode() {
    // @ts-ignore
    return super.mode;
  }

  set mode(value) {
    // @ts-ignore
    super.mode = value;

    if (value === "Demo") {
      let cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "InternalLink",
          actionValue: cbp + "/get-involved",
          imageUrl: undefined,
          label: "Get involved",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "InternalLink",
          actionValue: cbp + "/stories",
          imageUrl: undefined,
          label: "Stories",
          subMenu: [],
          target: "CurrentWindow"
        }
      ]);
    }
  }

  /* api: navigationDevName */

  // @ts-ignore
  @api
  // @ts-ignore
  get navigationDevName() {
    // @ts-ignore
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    // @ts-ignore
    super.navigationDevName = value;
  }

  /* api: ipName */

  // @ts-ignore
  @api
  // @ts-ignore
  get ipName() {
    // @ts-ignore
    return super.ipName;
  }

  set ipName(value) {
  // @ts-ignore
    super.ipName = value;
  }

  /* api: inputJSON */

  // @ts-ignore
  @api
  // @ts-ignore
  get inputJSON() {
    // @ts-ignore
    return super.inputJSON;
  }

  set inputJSON(value) {
    // @ts-ignore
    super.inputJSON = value;
  }

  /* api: optionsJSON */

  // @ts-ignore
  @api
  // @ts-ignore
  get optionsJSON() {
    // @ts-ignore
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    // @ts-ignore
    super.optionsJSON = value;
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleCloseMenu(
    _event: CustomEvent
  ): void {
    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }

  handleNavigate(
    event: CustomEvent
  ): void {
    const nav = this.refs.navsvc as unknown as SfGpsDsNavigationService;

    if (this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
