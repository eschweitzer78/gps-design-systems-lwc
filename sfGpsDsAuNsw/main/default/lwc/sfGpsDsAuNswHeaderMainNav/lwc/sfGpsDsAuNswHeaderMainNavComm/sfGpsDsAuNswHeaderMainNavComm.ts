/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

import type { 
  NavigationMode 
} from "c/sfGpsDsNavigation"
import type { 
  Stacking,
  ProfileNavigationMode 
} from "c/sfGpsDsAuNswHeaderV2Comm";

export default 
class SfGpsDsAuNswHeaderMainNavComm
extends SfGpsDsIpLwc {
  // @ts-ignore
  @api 
  mode: NavigationMode = "Integration Procedure";

  // @ts-ignore
  @api 
  navigationDevName?: string;

  // @ts-ignore
  @api 
  get ipName(): string | undefined {
    return super.ipName;
  }

  set ipName(value: string) {
    super.ipName = value;
  }

  // @ts-ignore
  @api 
  get inputJSON(): string | undefined {
    return super.inputJSON;
  }

  set inputJSON(value: string) {
    super.inputJSON = value;
  }
    
  // @ts-ignore
  @api 
  get optionsJSON(): string | undefined {
    return super.optionsJSON;
  }

  set optionsJSON(value: string) {
    super.optionsJSON = value;
  }
  // Header

  // @ts-ignore
  @api 
  masterbrand?: string;

  // @ts-ignore
  @api 
  masterbrandAlt?: string;

  // @ts-ignore
  @api 
  srMasterbrandLabel = "NSW Government";

  // @ts-ignore
  @api 
  logo?: string;

  // @ts-ignore
  @api 
  logoAlt?: string;

  // @ts-ignore
  @api 
  menuLabel = "menu";

  // @ts-ignore
  @api 
  searchLabel = "Search site for:";

  // @ts-ignore
  @api 
  siteTitle?: string;

  // @ts-ignore
  @api 
  siteDescriptor?: string;

  // @ts-ignore
  @api 
  headerUrl?: string;

  // @ts-ignore
  @api 
  mobile: boolean = false;

  // @ts-ignore
  @api 
  mobileLogoStacking: Stacking = "horizontal";

  // @ts-ignore
  @api 
  search: boolean = false;

  // @ts-ignore
  @api 
  profileMode?: ProfileNavigationMode;

  // @ts-ignore
  @api 
  profileNavigationDevName?: string;

  // @ts-ignore
  @api 
  profileIpName?: string;

  // @ts-ignore
  @api 
  profileInputJSON?: string;

  // @ts-ignore
  @api 
  profileOptionsJSON?: string;


  // @ts-ignore
  @api 
  headerClassName?: string;

  // MainNav

  // @ts-ignore
  @api 
  megaMenu: boolean = false;

  // @ts-ignore
  @api 
  mainNavClassName?: string;

  // @ts-ignore
  @api 
  mainNavId: string = "nav";

  /* event management */

  _isActive = false;

  // eslint-disable-next-line no-unused-vars
  handleOpenMenu(
    _event: CustomEvent
  ): void {
    this._isActive = true;
  }

  // eslint-disable-next-line no-unused-vars
  handleCloseMenu(
    _event: CustomEvent
  ): void {
    this._isActive = false;
  }
}
