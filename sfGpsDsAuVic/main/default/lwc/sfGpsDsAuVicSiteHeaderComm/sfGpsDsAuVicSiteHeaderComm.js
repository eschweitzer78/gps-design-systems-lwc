/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class sfGpsDsAuVicSiteHeaderComm extends SfGpsDsNavigation {
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

  @api masterbrand;
  @api masterbrandAlt;
  @api masterbrandLink;
  @api logo;
  @api logoAlt;
  @api logoLink;

  @api breakpoint = 992; // Number
  @api sticky;
  @api hideOnScroll;

  @api label = "Menu"; // Menu Aria label
  @api title = "Main Menu"; // Menu title
  @api menuLabel = "Menu";
  @api closeMenuLabel = "Close menu";
  @api searchLabel = "Search";
  @api closeSearchLabel = "Close search";
  @api logoutLabel = "Logout";

  @api quickExitLabel = "Quick exit";
  @api quickExitTarget = "https://www.google.com";
  // quickExit is non sticky as it's located in the menu anyway

  @api className;

  get computedMasterbrand() {
    return (
      this.masterbrand ||
      "/sfsites/c/resource/sfGpsDsAuVic/images/logo-primary.png"
    );
  }

  get computedMasterbrandAlt() {
    return this.masterbrandAlt || "Government of Victoria logo";
  }

  _navService;

  get navService() {
    if (!this._navService) {
      this._navService = this.template.querySelector(
        "c-sf-gps-ds-navigation-service"
      );
    }

    return this._navService;
  }

  // Events

  handleNavigate(event) {
    let nav = this.navService;

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }

  handleImageClick() {
    let nav = this.navService;
    if (nav?.navigateHome) nav.navigateHome();
  }

  handleCobrandImageClick() {
    let nav = this.navService;
    if (nav?.navigateHome) nav.navigateHome();
  }

  handleLogoutClick() {
    let nav = this.navService;
    if (nav?.navigateHome) nav.logout();
  }
}
