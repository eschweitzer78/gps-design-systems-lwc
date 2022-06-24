/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { NavigationMixin } from "lightning/navigation";

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
  @api search = false;

  @api className;

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
