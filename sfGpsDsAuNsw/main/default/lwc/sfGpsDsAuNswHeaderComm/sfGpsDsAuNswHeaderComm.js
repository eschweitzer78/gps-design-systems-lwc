/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track, wire } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { NavigationMixin } from "lightning/navigation";

import userId from "@salesforce/user/Id";
import isGuest from "@salesforce/user/isGuest";
import { getRecord } from "lightning/uiRecordApi";
import userAliasField from "@salesforce/schema/User.Alias";

export default class SfGpsDsAuHeaderComm extends NavigationMixin(SfGpsDsLwc) {
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
  @api profile = false;

  @api profileIpName;
  @api profileInputJSON;
  @api profileOptionsJSON;

  @api className;

  @api mainNavId;
  @api mainNavIsOpen = false;

  @track userAlias;

  @wire(getRecord, { recordId: userId, fields: [userAliasField] })
  getUserDetails({ error, data }) {
    if (data) {
      this.userAlias = data.fields.Alias.value;
    } else if (error) {
      console.log(error);
    }
  }

  get isGuest() {
    return isGuest;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  /* events */

  handleSearch(event) {
    const queryTerm = event.target.value;

    // Navigate to search page using lightning/navigation API:
    // https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation

    this[NavigationMixin.Navigate]({
      type: "standard__search",
      state: {
        term: queryTerm
      }
    });
  }

  handleOpenMenu() {
    const openMenuEvent = new CustomEvent("openmenu");
    this.dispatchEvent(openMenuEvent);
  }

  handleHome() {
    this[NavigationMixin.Navigate]({
      // Pass in pageReference
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    });
  }
}
