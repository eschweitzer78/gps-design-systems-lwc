/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, wire } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { NavigationMixin } from "lightning/navigation";

import userId from "@salesforce/user/Id";
import isGuest from "@salesforce/user/isGuest";
import userAliasField from "@salesforce/schema/User.Alias";
import { getRecord } from "lightning/uiRecordApi";

export default class extends NavigationMixin(SfGpsDsLwc) {
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

  userAlias;

  @wire(getRecord, { recordId: userId, fields: [userAliasField] })
  getUserDetails({ error, data }) {
    if (data) {
      this.userAlias = data.fields.Alias.value;
    } else if (error) {
      console.log(error);
    }
  }

  /* computed */

  get _isGuest() {
    return isGuest;
  }

  /* event management */

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
    this[NavigationMixin.GenerateUrl]({
      // Pass in pageReference
      type: "standard__namedPage",
      attributes: {
        pageName: "home"
      }
    }).then((url) => {
      window.open(url, "_self");
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
