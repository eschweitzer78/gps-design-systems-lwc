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
import { NavigationMixin } from "lightning/navigation";
import mainNavToggleChannel from "@salesforce/messageChannel/sfGpsDsAuQldMainNavToggle__c";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";
import cBasePath from "@salesforce/community/basePath";
import isGuest from "@salesforce/user/isGuest";

import sfGpsDsAuthLoginButtonLabel from "@salesforce/label/c.sfGpsDsAuthLoginButtonLabel";
import sfGpsDsAuthLogoutButtonLabel from "@salesforce/label/c.sfGpsDsAuthLogoutButtonLabel";

const I18N = {
  skipLinksAriaLabel: "Skip links",
  skipToMainContent: "Skip to main content",
  skipToMainNav: "Skip to main navigation",
  searchButtonAriaLabel: "Search",
  searchFormAriaLabel: "Sitewide search",
  loginButtonLabel: sfGpsDsAuthLoginButtonLabel,
  logoutButtonLabel: sfGpsDsAuthLogoutButtonLabel
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

const AUTH_MODE_HIDE = "hide";
const AUTH_MODE_LILO = "login-logout";
const AUTH_MODE_ALL = "all";
const AUTH_MODE_VALUES = [AUTH_MODE_HIDE, AUTH_MODE_LILO, AUTH_MODE_ALL];
const AUTH_MODE_DEFAULT = AUTH_MODE_HIDE;

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuQldHeader";

export default class extends NavigationMixin(LightningElement) {
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
  @api profileLink;
  @api profileIcon;

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

  /* api: authMode */

  _authMode;
  _authModeOriginal;

  @api
  get authMode() {
    return this._authModeOriginal;
  }

  set authMode(value) {
    this._authModeOriginal = value;
    this._authMode = normaliseString(value, {
      validValues: AUTH_MODE_VALUES,
      fallbackValue: AUTH_MODE_DEFAULT
    });
  }

  /* getters */

  get computedAuthShowProfile() {
    return this.authMode === AUTH_MODE_ALL && !isGuest;
  }

  get computedAuthShowLogin() {
    return this._authMode !== AUTH_MODE_HIDE;
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

  /* tracked */

  loginUrl;
  logoutUrl;

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

  get profileText() {
    return this.profileLink?.text;
  }

  get profileUrl() {
    return this.profileLink?.url;
  }

  get computedAuthUrl() {
    return isGuest ? this.loginUrl : this.logoutUrl;
  }

  get computedAuthText() {
    return isGuest
      ? I18N.loginButtonLabel || "Log in"
      : I18N.logoutButtonLabel || "Log out";
  }

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

  get computedDefaultLogoUrl() {
    return sfGpsDsAuQldStaticResource + "/assets/img/qgov-coa.svg#logo";
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

  get computedCtaOneIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#" + this.ctaOneIcon;
  }

  get computedCtaTwoIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#" + this.ctaTwoIcon;
  }

  get computedProfileIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#" + this.profileIcon;
  }

  get computedAuthIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#" + (isGuest ? "log-in" : "log-out");
  }

  get computedGlobalSearchActionUrl() {
    return cBasePath + "/global-search";
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
        "sf-gps-ds-au-qld-header-search-input"
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

  handleSearch(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleSearch");

    event.preventDefault();
    this._searchIsOpen = false;

    const queryTerm = this.refs.query.value;
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: queryTerm
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< handleSearch", queryTerm);
  }

  handleMainNavButtonClick() {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleMainNavButtonClick");
    }

    publish(this._messageContext, mainNavToggleChannel, {
      type: "toggle",
      detail: null
    });

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleMainNavButtonClick");
    }
  }

  /* lifecycle */

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();

    this[NavigationMixin.GenerateUrl]({
      type: "comm__loginPage",
      attributes: {
        actionName: isGuest ? "login" : "logout"
      }
    })
      .then((url) => {
        if (isGuest) {
          this.loginUrl = url;
        } else {
          this.logoutUrl = url;
        }
      })
      .catch((error) => {
        if (DEBUG)
          console.error(CLASS_NAME, "connectedCallback.generateUrl", error);
      });
  }
}
