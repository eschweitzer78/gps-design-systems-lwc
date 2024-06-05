/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsIp from "c/sfGpsDsIpLwc";
// import { uniqueId } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswHeaderMainNavComm extends SfGpsDsIp {
  @api mode = "Integration Procedure";
  @api navigationDevName;

  @api ipName;
  @api inputJSON;
  @api optionsJSON;

  // Header

  @api masterbrand;
  @api masterbrandAlt;
  @api srMasterbrandLabel = "NSW Government";
  @api logo;
  @api logoAlt;
  @api menuLabel = "menu";
  @api searchLabel = "Search site for:";

  @api siteTitle;
  @api siteDescriptor;
  @api headerUrl;
  @api mobile = false;
  @api mobileLogoStacking = "horizontal";
  @api search = false;

  @api profileIpName;
  @api profileInputJSON;
  @api profileOptionsJSON;

  @api headerClassName;
  @track menuActive = false;

  // MainNav
  @api megaMenu = false;
  @api mainNavClassName;

  @api mainNavId = "nav";

  // Events

  handleOpenMenu() {
    this.menuActive = true;
  }

  handleCloseMenu() {
    this.menuActive = false;
  }
}
