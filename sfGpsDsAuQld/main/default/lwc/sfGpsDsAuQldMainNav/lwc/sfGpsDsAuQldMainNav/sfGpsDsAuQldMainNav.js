import { LightningElement, api, track, wire } from "lwc";
import { uniqueId, normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";
import { CurrentPageReference } from "lightning/navigation";
import {
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";
import mainNavToggleChannel from "@salesforce/messageChannel/sfGpsDsAuQldMainNavToggle__c";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const I18N = {
  mainNavAriaLabel: "main",
  menuLabel: "Menu",
  closeLabel: "Close",
  homeLabel: "Home"
};

const HOME_SHOW_DEFAULT = true;

const CSTYLE_DEFAULT = "dark";
const CSTYLE_VALUES = {
  light: "",
  dark: "qld__main-nav__menu--dark",
  "dark-alternate": "qld__main-nav__menu--dark-alt"
};

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/svg-icons.svg";

export default class extends LightningElement {
  static renderMode = "light";

  @api homeUrl;
  @api isActive;
  @api mainNavId = "mainmenu";
  @track _open;

  /* api: homeShow */

  _homeShow = HOME_SHOW_DEFAULT;
  _homeShowOriginal = HOME_SHOW_DEFAULT;

  @api
  get homeShow() {
    return this._homeShowOriginal;
  }

  set homeShow(value) {
    this._homeShowOriginal = value;
    this._homeShow = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HOME_SHOW_DEFAULT
    });
  }

  /* api: megaMenu */

  _megaMenu;
  _megaMenuOriginal;

  @api
  get megaMenu() {
    return this._megaMenuOriginal;
  }

  set megaMenu(value) {
    this._megaMenuOriginal = value;
    this._megaMenu = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: cStyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: navItems, Array of navigation item objects, format { url, text, subNav: ... } */

  @track _navItems;
  _navItemsOriginal;
  @track _mapItems;

  @api
  get navItems() {
    return this._navItemsOriginal;
  }

  set navItems(items) {
    this._navItemsOriginal = items;
    this.navItemsMapping();
  }

  _navItemId = uniqueId("sf-gps-ds-au-qld-main-nav-item");

  @wire(MessageContext) _messageContext;

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      "qld__main-nav": true,
      "qld__main-nav--mega": this._megaMenu
    };
  }

  get computedNavContentClassName() {
    return {
      "qld__main-nav__content": true,
      "qld__main-nav__content--open": this._open,
      "qld__main-nav__content--closed": !this._open
    };
  }

  get computedHomeClassName() {
    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname;

    return {
      "qld__main-nav__item": true,
      active: this.homeUrl === pathname || this.homeUrl + "/" === pathname
    };
  }

  get computedHomeUrl() {
    return this.homeUrl || "#";
  }

  get computedHomeIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__home";
  }

  get computedCloseIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__close";
  }

  get computedArrowRightIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__arrow-right";
  }

  get computedChevronUpIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__chevron-up";
  }

  get computedMainNavMenuClassName() {
    return {
      "qld__main-nav__menu": true,
      [this._cstyle]: this._cstyle
    };
  }

  /* methods */

  mapSingleItemClasses(item, isActive) {
    return {
      className: {
        "qld__main-nav__item": true,
        active: isActive && !this._megaMenu
      },
      anchorClassName: {
        "qld__main-nav__item-link": true,
        "qld__main-nav__item-link--desktop-hide": item.subNav && this.megaMenu,
        "qld__main-nav__item-link--open": isActive
      },
      buttonClassName: {
        "qld__main-nav__item-toggle": true,
        "qld__accordion--open": isActive,
        "qld__accordion--closed": !isActive
      },
      subNavClassName: {
        "qld__main-nav__menu-sub": true,
        qld__accordion__body: true,
        "qld__accordion--open": isActive,
        "qld__accordion--closed": !isActive
      }
    };
  }

  mapItems(parentIndex, parentLevel, map, items) {
    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname;

    return items.map((item, index) => {
      const isCurrentPage =
        item.url === pathname ||
        (item.url && pathname.startsWith(item.url + "/"));
      const isActive = isCurrentPage && !parentLevel && !this._megaMenu;

      let result = {
        ...item,
        id: `${parentIndex}-${index}`,
        index: item.index || `${parentIndex}-${index}`,
        level: parentLevel + 1,
        isActive: isActive,
        ...this.mapSingleItemClasses(item, isActive)
      };

      if (!this.megaMenu) {
        delete result.subNav;
      } else if (item.subNav) {
        result.subNav = this.mapItems(
          result.index,
          parentLevel + 1,
          map,
          item.subNav
        );
      }

      map[result.index] = result;
      return result;
    });
  }

  navItemsMapping() {
    let map = {};
    this._navItems = this._navItemsOriginal
      ? this.mapItems(this._navItemId, 0, map, this._navItemsOriginal)
      : null;
    this._mapItems = map;
  }

  @api close() {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = false;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      item.key = `item-${this.keyIndex++}`;
      item.isActive = false;

      Object.assign(item, this.mapSingleItemClasses(item, false));
    }
  }

  /* Event management */

  handleClickNavigate(event) {
    event.preventDefault();

    this.close();

    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);

    let index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  handleClick(event) {
    event.preventDefault();

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = true;
    let index = event.currentTarget.dataset.ndx;
    let clickLevel = this._mapItems[index]?.level;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      if (prop === index) {
        item.isActive = !item.isActive;
      } else if (item.level === 1 && clickLevel === 1) {
        // if level1 item was clicked, we need to deactivate all other level 1s
        item.isActive = false;
      }

      Object.assign(item, this.mapSingleItemClasses(item, item.isActive));
    }

    this._navItems = [...this._navItems];

    // If there is no subNav to expand, we're really navigating
    // Unless it's level-2 nav on desktop as there is a subNav - it's just not visible and we have to navigate
    if (
      !this._mapItems[index]?.subNav ||
      (clickLevel === 2 && this._isDesktop)
    ) {
      this.handleClickNavigate(event);
    }
  }

  /* methods */

  handleCloseNav() {
    this._open = false;
  }

  handleMainNavToggle() {
    this._open = !this._open;
  }

  /* wire: handlePageReference */

  _pageReference;

  @wire(CurrentPageReference) handlePageReference(pageReference) {
    /* This is called when we navigate off the current page... */

    if (this._pageReference && this._pageReference !== pageReference) {
      /* update menu */
      this.navItemsMapping();
    }

    this._pageReference = pageReference;
  }

  /* lifecycle */

  connectedCallback() {
    this.classList.add("js");

    if (!this._subscription) {
      this._subscription = subscribe(
        this._messageContext,
        mainNavToggleChannel,
        (message) => this.handleMainNavToggle(message)
      );
    }
  }

  disconnectedCallback() {
    if (this._subscription) {
      unsubscribe(this._subscription);
      this._subscription = null;
    }
  }
}
