/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  uniqueId 
} from "c/sfGpsDsHelpers";
import cBasePath from "@salesforce/community/basePath";

import type { 
  Stacking 
} from "c/sfGpsDsAuNswHeader";

const STACKING_HORIZONTAL: Stacking = "horizontal";
const STACKING_VERTICAL: Stacking = "vertical";
const STACKING_VALUES: Stacking[] = [STACKING_HORIZONTAL, STACKING_VERTICAL];
const STACKING_DEFAULT = STACKING_HORIZONTAL;

const MOBILE_DEFAULT = false;
const SEARCH_DEFAULT = false;
const PROFILE_DEFAULT = false;

export default 
class SfGpsDsNswHeader
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  masterbrand?: string;

  // @ts-ignore
  @api 
  masterbrandAlt?: string

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
  headerUrl = "#";

  // @ts-ignore
  @api 
  searchAriaLabel = "search";

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  value: string = "";

  /* hidden when used stand alone */
  // @ts-ignore
  @api 
  mainNavId?: string;

  // @ts-ignore
  @api 
  mainNavIsOpen: boolean = false;

  // @ts-ignore
  @track 
  searchIsOpen: boolean = false;

  // @ts-ignore
  @api
  mobile?: boolean;
  _mobile = this.defineBooleanProperty("mobile", {
    defaultValue: MOBILE_DEFAULT
  });

  // @ts-ignore
  @api
  search?: boolean;
  _search = this.defineBooleanProperty("search", {
    defaultValue: SEARCH_DEFAULT
  });

  // @ts-ignore
  @api
  profile?: boolean;
  _profile = this.defineBooleanProperty("profile", {
    defaultValue: PROFILE_DEFAULT
  });

  // @ts-ignore
  @api
  mobileLogoStacking?: Stacking;
  _mobileLogoStacking = this.defineEnumProperty<Stacking>("mobileLogoStacking", {
    validValues: STACKING_VALUES,
    defaultValue: STACKING_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-header": true,
      "nsw-header__has-profile": this._profile.value,
      [this.className || ""]: !!this.className
    };
  }

  _headerSearchId?: string;

  get computedHeaderSearchId(): string {
    if (this._headerSearchId == null) {
      this._headerSearchId = uniqueId("sf-gps-ds-au-nsw-header-search");
    }

    return this._headerSearchId;
  }

  _headerInputId?: string;

  get computedHeaderInputId(): string {
    if (this._headerInputId == null) {
      this._headerInputId = uniqueId("sf-gps-ds-au-nsw-header-search");
    }

    return this._headerInputId;
  }

  get _areLogosHorizontallyStacked(): boolean {
    return (
      (this._mobileLogoStacking.value || STACKING_HORIZONTAL) === STACKING_HORIZONTAL
    );
  }

  get _areLogosVerticallyStacked(): boolean {
    return this._mobileLogoStacking.value === STACKING_VERTICAL;
  }

  get computedHeaderUrl(): string {
    return this.headerUrl || cBasePath || "/";
  }

  /* helpers */

  setSearchVisible(
    visible: boolean
  ): void {
    this.searchIsOpen = visible;
    const element = this.refs.searcharea;

    if (element) {
      element.hidden = !visible;
    }
  }

  /* Event management */

  // eslint-disable-next-line no-unused-vars
  handleCloseSearch(
    _event: MouseEvent
  ): void {
    this.setSearchVisible(false);
  }

  // eslint-disable-next-line no-unused-vars
  handleOpenSearch(
    _event: MouseEvent
  ): void {
    this.setSearchVisible(true);

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = "";

    const element = this.refs.headerinput;

    if (element) {
      element.focus();
    }
  }

  handleChange(
    event: InputEvent
  ): void {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.value = (event.target as HTMLInputElement).value;
  }

  handleKeyUp(
    event: KeyboardEvent
  ): void {
    event.preventDefault();

    if (event.key === "Enter") {
      this.handleSearch(event);
    }
  }

  handleSearch(
    event: KeyboardEvent
  ): void {
    event.preventDefault();
    this.setSearchVisible(false);

    const searchEvent = new CustomEvent("search");
    this.dispatchEvent(searchEvent);
  }

  handleOpenMenu(
    _event: MouseEvent
  ): void {
    const openMenuEvent = new CustomEvent("openmenu");
    this.dispatchEvent(openMenuEvent);
  }

  handleLogoClick(
    event: MouseEvent
  ): void {
    if (this.headerUrl) {
      return;
    }

    event.preventDefault();

    const homeEvent = new CustomEvent("home");
    this.dispatchEvent(homeEvent);
  }
}
