/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  wire 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  NavigationMixin 
} from "lightning/navigation";

import userId from "@salesforce/user/Id";
import isGuest from "@salesforce/user/isGuest";
import userAliasField from "@salesforce/schema/User.Alias";
import { 
  getRecord 
} from "lightning/uiRecordApi";
import type { 
  Stacking 
} from "c/sfGpsDsAuNswHeader";

export default 
class SfGpsDsAuNswHeaderComm 
extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
  // @ts-ignore
  @api 
  masterbrand: string;

  // @ts-ignore
  @api 
  masterbrandAlt: string;

  // @ts-ignore
  @api 
  srMasterbrandLabel: string = "NSW Government";

  // @ts-ignore
  @api 
  logo: string;

  // @ts-ignore
  @api 
  logoAlt: string;

  // @ts-ignore
  @api 
  menuLabel: string = "menu";

  // @ts-ignore
  @api 
  searchLabel: string = "Search site for:";

  // @ts-ignore
  @api 
  siteTitle: string;

  // @ts-ignore
  @api 
  siteDescriptor: string;

  // @ts-ignore
  @api 
  headerUrl: string;

  // @ts-ignore
  @api 
  mobile: boolean = false;

  // @ts-ignore
  @api 
  mobileLogoStacking: Stacking = "horizontal";

  // @ts-ignore
  @api 
  search = false;

  // @ts-ignore
  @api 
  profile = false;

  // @ts-ignore
  @api 
  profileIpName: string;

  // @ts-ignore
  @api 
  profileInputJSON: string;
  // @ts-ignore
  @api 
  profileOptionsJSON: string;

  // @ts-ignore
  @api 
  className: string;

  // @ts-ignore
  @api 
  mainNavId: string;

  // @ts-ignore
  @api 
  mainNavIsOpen: boolean = false;

  userAlias: string;

  // @ts-ignore
  @wire(
    getRecord, 
    { recordId: userId, fields: [userAliasField] }
  )
  getUserDetails({ error, data }): void {
    if (data) {
      this.userAlias = data.fields.Alias.value;
    } else if (error) {
      console.log(error);
    }
  }

  /* computed */

  get _isGuest(): boolean {
    return isGuest;
  }

  /* event management */

  handleSearch(
    event: CustomEvent
  ): void {
    const queryTerm = (event.target as HTMLInputElement).value;

    // Navigate to search page using lightning/navigation API:
    // https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation
    // @ts-ignore
    this[NavigationMixin.Navigate]({
      type: "standard__search",
      state: {
        term: queryTerm
      }
    });
  }

  // eslint-disable-next-line no-unused-vars
  handleOpenMenu(
    _event: CustomEvent
  ): void {
    const openMenuEvent = new CustomEvent("openmenu");
    this.dispatchEvent(openMenuEvent);
  }

  // eslint-disable-next-line no-unused-vars
  handleHome(_event: CustomEvent): void {
    // @ts-ignore
    this[NavigationMixin.GenerateUrl]({
      // Pass in pageReference
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    }).then((url: string) => {
      window.open(url, "_self");
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
