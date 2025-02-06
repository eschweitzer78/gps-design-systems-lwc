/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { uniqueId, normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";
import cBasePath from "@salesforce/community/basePath";

const STACKING_HORIZONTAL = "horizontal";
const STACKING_VERTICAL = "vertical";
const STACKING_VALUES = [STACKING_HORIZONTAL, STACKING_VERTICAL];
const STACKING_DEFAULT = STACKING_HORIZONTAL;

const MOBILE_DEFAULT = false;
const SEARCH_DEFAULT = false;
const PROFILE_DEFAULT = false;

export default class extends LightningElement {
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

  @api searchAriaLabel = "search";
  @api className;

  @api value = "";

  /* hidden when used stand alone */
  @api mainNavId;
  @api mainNavIsOpen = false;

  @track searchIsOpen = false;

  /* api: mobile */

  _mobile = MOBILE_DEFAULT;
  _mobileOriginal = MOBILE_DEFAULT;

  @api
  get mobile() {
    return this._mobileOriginal;
  }

  set mobile(value) {
    this._mobileOriginal = value;
    this._mobile = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: MOBILE_DEFAULT
    });
  }

  /* api: search */

  _search = SEARCH_DEFAULT;
  _searchOriginal = SEARCH_DEFAULT;

  @api
  get search() {
    return this._searchOriginal;
  }

  set search(value) {
    this._searchOriginal = value;
    this._search = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SEARCH_DEFAULT
    });
  }

  /* api: profile */

  _profile = PROFILE_DEFAULT;
  _profileOriginal = PROFILE_DEFAULT;

  @api
  get profile() {
    return this._profileOriginal;
  }

  set profile(value) {
    this._profileOriginal = value;
    this._profile = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PROFILE_DEFAULT
    });
  }

  /* api: mobileLogoStacking */

  _mobileLogoStacking = STACKING_HORIZONTAL;
  _mobileLogoStackingOriginal = STACKING_HORIZONTAL;

  @api
  get mobileLogoStacking() {
    return this._mobileLogoStackingOriginal;
  }

  set mobileLogoStacking(value) {
    this._mobileLogoStackingOriginal = value;
    this._mobileLogoStacking = normaliseString(value, {
      validValues: STACKING_VALUES,
      fallbackValue: STACKING_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-header": true,
      "nsw-header__has-profile": this._profile,
      [this.className]: this.className
    };
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

  get _areLogosHorizontallyStacked() {
    return (
      (this.mobileLogoStacking || STACKING_HORIZONTAL) === STACKING_HORIZONTAL
    );
  }

  get _areLogosVerticallyStacked() {
    return this.mobileLogoStacking === STACKING_VERTICAL;
  }

  get computedHeaderUrl() {
    return this.headerUrl || cBasePath || "/";
  }

  /* helpers */

  setSearchVisible(visible) {
    this.searchIsOpen = visible;
    const element = this.refs.searcharea;

    if (element) {
      element.hidden = !visible;
    }
  }

  /* Event management */

  handleCloseSearch() {
    this.setSearchVisible(false);
  }

  handleOpenSearch() {
    this.setSearchVisible(true);

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = "";

    const element = this.refs.headerinput;

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
    if (event.keyCode === 13) {
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
