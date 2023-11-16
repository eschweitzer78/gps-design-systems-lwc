/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { NavigationMixin } from "lightning/navigation";

export default class SfGpsDsUkGovHeaderComm extends SfGpsDsNavigation {
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
  @api masterbrand;
  @api masterbrandLabel = "GOV.UK";
  @api serviceName;
  @api serviceUrl;
  @api headerUrl;

  @api className;
  @api isActive = false;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("govuk-scope");
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
