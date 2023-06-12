/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswHeader extends LightningElement {
  static renderMode = "light";

  @api masterbrand;
  @api masterbrandAlt;
  @api srMasterbrandLabel = "NSW Government";
  @api logo;
  @api logoAlt;
  @api menuLabel = "menu";
  @api searchLabel = "Search site for:";

  @api siteTitle;
  @api siteDescriptor;
  @api headerUrl = "#";
  @api mobile = false;
  @api mobileLogoStacking = "horizontal"; // one of horizontal, vertical
  @api search = false;
  @api profile = false;

  @api searchAriaLabel = "search";
  @api className;

  @track searchIsOpen = false;
  @api value = "";

  /* hidden when used stand alone */
  @api mainNavId;
  @api mainNavIsOpen = false;

  get computedClassName() {
    return computeClass({
      "nsw-header": true,
      "nsw-header__has-profile": this.profile,
      [this.className]: this.className
    });
  }

  _headerSearchId;

  get computedHeaderSearchId() {
    if (this._headerSearchId == null) {
      this._headerSearchId = uniqueId("sf-gps-ds-au-nsw-header-search");
    }

    return this._headerSearchId;
  }

  _headerInputId;

  get computedHeaderInputId() {
    if (this._headerInputId == null) {
      this._headerInputId = uniqueId("sf-gps-ds-au-nsw-header-search");
    }

    return this._headerInputId;
  }

  get areLogosHorizontallyStacked() {
    return (this.mobileLogoStacking || "horizontal") === "horizontal";
  }

  get areLogosVerticallyStacked() {
    return this.mobileLogoStacking === "vertical";
  }

  /* helpers */

  setSearchVisible(visible) {
    this.searchIsOpen = visible;
    let element = this.querySelector(".nsw-header__search-area");

    if (element) {
      element.hidden = !visible;
    }
  }

  /* Event handling */

  handleCloseSearch() {
    this.setSearchVisible(false);
  }

  handleOpenSearch() {
    this.setSearchVisible(true);

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = "";

    let element = this.querySelector(".nsw-header__input");
    if (element) {
      element.focus();
    }

    return false;
  }

  handleChange(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = event.target.value;
  }

  handleKeyUp(event) {
    const isEnterKey = event.keyCode === 13;
    if (isEnterKey) {
      this.handleSearch(event);
    }

    return false; // avoid submission of form
  }

  handleSearch(event) {
    event.preventDefault();
    this.setSearchVisible(false);

    const searchEvent = new CustomEvent("search");
    this.dispatchEvent(searchEvent);
  }

  handleOpenMenu() {
    const openMenuEvent = new CustomEvent("openmenu");
    this.dispatchEvent(openMenuEvent);
  }

  handleLogoClick(event) {
    if (this.headerUrl) {
      return;
    }

    event.preventDefault();

    const homeEvent = new CustomEvent("home");
    this.dispatchEvent(homeEvent);
  }
}
