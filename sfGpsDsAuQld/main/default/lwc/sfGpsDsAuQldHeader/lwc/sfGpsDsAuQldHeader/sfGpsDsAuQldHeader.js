import { LightningElement, api, track } from "lwc";
import { computeClass, normaliseString, uniqueId } from "c/sfGpsDsHelpers";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";
import cBasePath from "@salesforce/community/basePath";

const I18N = {
  skipLinksAriaLabel: "Skip links",
  skipToMainContent: "Skip to main content",
  skitToMainNav: "Skip to main navigation",
  searchButtonAriaLabel: "Search",
  searchFormAriaLabel: "Sitewide search"
};

const CSTYLE_LIGHT = "light";
const CSTYLE_DARK = "dark";
const CSTYLE_DARKALT = "dark-alt";

const PREHEADER_STYLE_VALUES = [CSTYLE_LIGHT, CSTYLE_DARK, CSTYLE_DARKALT];
const PREHEADER_STYLE_DEFAULT = CSTYLE_DARK;

const HEADER_STYLE_VALUES = [CSTYLE_LIGHT, CSTYLE_DARK, CSTYLE_DARKALT];
const HEADER_STYLE_DEFAULT = CSTYLE_LIGHT;

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/svg-icons.svg";

export default class extends LightningElement {
  static renderMode = "light";

  /* general */
  /* ------- */

  @api className;

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return computeClass({
      qld__header: true,
      [this.className]: this.className
    });
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

  _preHeaderStyle = PREHEADER_STYLE_DEFAULT;
  _preHeaderStyleOriginal = PREHEADER_STYLE_DEFAULT;

  @api get preHeaderStyle() {
    return this._preHeaderStyleOriginal;
  }

  set preHeaderStyle(value) {
    this._preHeaderStyleOriginal = value;
    this._preHeaderStyle = normaliseString(value, {
      validValues: PREHEADER_STYLE_VALUES,
      fallbackValue: PREHEADER_STYLE_DEFAULT
    });
  }

  /* getters */

  get computedPreHeaderClassName() {
    return computeClass({
      "qld__header__pre-header": true,
      "qld__header__pre-header--dark": this._preHeaderStyle === CSTYLE_DARK,
      "qld__header__pre-header--dark-alt":
        this._preHeaderStyle === CSTYLE_DARKALT
    });
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
  @api siteLogoSecondaryMobile;
  @api siteLogoSecondary;

  get hasSiteLogoSecondary() {
    return this.siteLogoSecondary || this.siteLogoSecondaryMobile;
  }

  @api title;
  @api subtitle;
  @api searchFieldLabel = "Search this website";

  /* api: headerStyle */

  _headerStyle = HEADER_STYLE_DEFAULT;
  _headerStyleOriginal = HEADER_STYLE_DEFAULT;

  @api get headerStyle() {
    return this._headerStyleOriginal;
  }

  set headerStyle(value) {
    this._headerStyleOriginal = value;
    this._headerStyle = normaliseString(value, {
      validValues: HEADER_STYLE_VALUES,
      fallbackValue: HEADER_STYLE_DEFAULT
    });
  }

  /* getters */

  get showSiteLogo() {
    return !!this.siteLogoAlt;
  }

  get computedMainClassName() {
    return computeClass({
      qld__header__main: true,
      "qld__header__main--dark": this._headerStyle === "dark",
      "qld__header__main--dark-alt": this._headerStyle === "dark-alt"
    });
  }

  get computedHeaderUrl() {
    return this.headerUrl || cBasePath;
  }

  get computedIconSearchUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__search";
  }

  get computedIconCloseUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__close";
  }

  get computedIconHomeUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__home";
  }

  get computedIconMenuUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__mobile-menu";
  }

  get computedSearchButtonClassName() {
    return computeClass({
      "qld__header__toggle-main-nav": true,
      "qld__main-nav__toggle-search": true,
      "qld__main-nav__toggle-search--open": !this._searchIsOpen,
      "qld__main-nav__toggle-search--close": this._searchIsOpen
    });
  }

  get computedHeaderSearchClassName() {
    return computeClass({
      qld__header__search: true,
      "qld__main-nav__search--open": this._searchIsOpen
    });
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

  handleSearchButtonClick() {
    this._searchIsOpen = !this._searchIsOpen;
  }
}
