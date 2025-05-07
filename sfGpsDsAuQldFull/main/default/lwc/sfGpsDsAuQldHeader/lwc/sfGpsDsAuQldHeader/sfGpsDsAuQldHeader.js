/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.13
 */

import { LightningElement, api, track, wire } from "lwc";
import { normaliseString, uniqueId } from "c/sfGpsDsHelpers";
import { publish, MessageContext } from "lightning/messageService";
import mainNavToggleChannel from "@salesforce/messageChannel/sfGpsDsAuQldMainNavToggle__c";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";
import cBasePath from "@salesforce/community/basePath";

const I18N = {
  skipLinksAriaLabel: "Skip links",
  skipToMainContent: "Skip to main content",
  skipToMainNav: "Skip to main navigation",
  searchButtonAriaLabel: "Search",
  searchFormAriaLabel: "Sitewide search"
};

const PREHEADER_STYLE_DEFAULT = "dark";
const PREHEADER_STYLE_VALUES = {
  light: "",
  dark: "qld__header__pre-header--dark",
  "dark-alternate": "qld__header__pre-header--dark-alt"
};

const HEADER_STYLE_DEFAULT = "light";
const HEADER_STYLE_VALUES = {
  light: "",
  dark: "qld__header__main--dark",
  "dark-alternate": "qld__header__main--dark-alt"
};

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

export default class extends LightningElement {
  static renderMode = "light";

  /* general */
  /* ------- */

  @api className;
  @wire(MessageContext) _messageContext;

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      qld__header: true,
      [this.className]: this.className
    };
  }

  /* preHeader */
  /* --------- */

  @api contentId = "content";
  @api mainNavId = "main-nav";
  @api preHeaderLink;
  @api preHeaderLogo;
  @api preHeaderLogoAlt;
  @api ctaOneLink;
  @api ctaOneIcon = "fa-phone";
  @api ctaTwoLink;
  @api ctaTwoIcon;

  /* api: preHeaderStyle */

  _preHeaderStyle = PREHEADER_STYLE_VALUES[PREHEADER_STYLE_DEFAULT];
  _preHeaderStyleOriginal = PREHEADER_STYLE_DEFAULT;

  @api
  get preHeaderStyle() {
    return this._preHeaderStyleOriginal;
  }

  set preHeaderStyle(value) {
    this._preHeaderStyleOriginal = value;
    this._preHeaderStyle = normaliseString(value, {
      validValues: PREHEADER_STYLE_VALUES,
      fallbackValue: PREHEADER_STYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* getters */

  get computedPreHeaderClassName() {
    return {
      "qld__header__pre-header": true,
      [this._preHeaderStyle]: this._preHeaderStyle
    };
  }

  get preHeaderText() {
    return this.preHeaderLink?.text;
  }

  get preHeaderUrl() {
    return this.preHeaderLink?.url || "#";
  }

  get computedContentIdRef() {
    return `#${this.contentId}`;
  }

  get computedMainNavIdRef() {
    return `#${this.mainNavId}`;
  }

  get ctaOneText() {
    return this.ctaOneLink?.text;
  }

  get ctaOneUrl() {
    return this.ctaOneLink?.url || "#";
  }

  get ctaTwoText() {
    return this.ctaTwoLink?.text;
  }

  get ctaTwoUrl() {
    return this.ctaTwoLink?.url || "#";
  }

  /* header */
  /* ------ */

  @api searchLabel = "Search";
  @api menuLabel = "Menu";

  @track _menuIsOpen = false;
  @track _searchIsOpen = false;

  @api headerUrl;
  @api siteLogo;
  @api siteLogoAlt;
  @api siteLogoSecondary;
  @api siteLogoSecondaryMobile;

  get hasSiteLogoSecondary() {
    return this.siteLogoSecondary || this.siteLogoSecondaryMobile;
  }

  @api title;
  @api subtitle;
  @api searchFieldLabel = "Search this website";

  /* api: headerStyle */

  _headerStyle = HEADER_STYLE_VALUES[HEADER_STYLE_DEFAULT];
  _headerStyleOriginal = HEADER_STYLE_DEFAULT;

  @api
  get headerStyle() {
    return this._headerStyleOriginal;
  }

  set headerStyle(value) {
    this._headerStyleOriginal = value;
    this._headerStyle = normaliseString(value, {
      validValues: HEADER_STYLE_VALUES,
      fallbackValue: HEADER_STYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* getters */

  get showSiteLogo() {
    return !!this.siteLogoAlt;
  }

  get computedMainClassName() {
    return {
      qld__header__main: true,
      [this._headerStyle]: this._headerStyle
    };
  }

  get computedHeaderUrl() {
    return this.headerUrl || cBasePath || "/";
  }

  get computedIconSearchUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#search";
  }

  get computedIconCloseUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#close";
  }

  get computedIconMenuUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#menu";
  }

  get computedSearchButtonClassName() {
    return {
      "qld__header__toggle-main-nav": true,
      "qld__main-nav__toggle-search": true,
      "qld__main-nav__toggle-search--open": !this._searchIsOpen,
      "qld__main-nav__toggle-search--close": this._searchIsOpen
    };
  }

  get computedHeaderSearchClassName() {
    return {
      qld__header__search: true,
      "qld__main-nav__search--open": this._searchIsOpen
    };
  }

  _headerSearchId;

  get computedHeaderSearchId() {
    if (this._headerSearchId == null) {
      this._headerSearchId = uniqueId("sf-gps-ds-au-qld-header-search");
    }

    return this._headerSearchId;
  }

  _headerSearchInputId;

  get computedHeaderSearchInputId() {
    if (this._headerSearchInputId == null) {
      this._headerSearchInputId = uniqueId(
        "sf-gps-ds-au-nsw-header-search-input"
      );
    }

    return this._headerSearchInputId;
  }

  /* event management */

  handleSkipToMainContent(event) {
    event.preventDefault();
    /* eslint-disable @lwc/lwc/no-document-query */
    const content = document.getElementById(this.contentId);

    if (content) {
      content.focus();
    }
  }

  handleSkipToMainNav(event) {
    event.preventDefault();
    /* eslint-disable @lwc/lwc/no-document-query */
    const content = document.getElementById(this.mainNavId);

    if (content) {
      content.focus();
    }
  }

  handleSearchButtonClick() {
    this._searchIsOpen = !this._searchIsOpen;
  }

  handleMainNavButtonClick() {
    publish(this._messageContext, mainNavToggleChannel, {
      type: "toggle",
      detail: null
    });
  }
}
