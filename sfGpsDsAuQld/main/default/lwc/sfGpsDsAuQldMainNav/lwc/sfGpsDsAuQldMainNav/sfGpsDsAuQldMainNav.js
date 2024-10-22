import { LightningElement, api, track, wire } from "lwc";
import { computeClass, uniqueId, normaliseString } from "c/sfGpsDsHelpers";
import { CurrentPageReference } from "lightning/navigation";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const I18N = {
  mainNavAriaLabel: "main",
  menuLabel: "Menu",
  closeLabel: "Close",
  homeLabel: "Home"
};

const CSTYLE_LIGHT = "light";
const CSTYLE_DARK = "dark";
const CSTYLE_DARKALT = "dark-alt";
const CSTYLE_VALUES = [CSTYLE_LIGHT, CSTYLE_DARK, CSTYLE_DARKALT];
const CSTYLE_DEFAULT = CSTYLE_DARK;

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/svg-icons.svg";

export default class SfGpsDsAuQldMainNav extends LightningElement {
  @api showHomeIcon;
  @api isActive;
  megaMenu = true;

  /* api: cStyle */

  _cstyle = CSTYLE_DEFAULT;
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT
    });
  }

  /*
   * navItems
   * Array of navigation item objects, format { url: '', text: '', subNav: ... }
   */

  _originalNavItems;
  @track _navItems;
  @track _mapItems;

  mapSingleItemClasses(item, isActive) {
    return {
      className:
        "qld__main-nav__item" + (isActive && !this._megaMenu ? " active" : ""),
      anchorClassName: computeClass({
        "qld__main-nav__item-link": true,
        "qld__main-nav__item-link--desktop-hide": item.subNav && this.megaMenu,
        "qld__main-nav__item-link--open": isActive
      }),
      buttonClassName: computeClass({
        "qld__main-nav__item-toggle": true,
        "qld__accordion--open": isActive,
        "qld__accordion--closed": !isActive
      }),
      subNavClassName: computeClass({
        "qld__main-nav__menu-sub": true,
        qld__accordion__body: true,
        "qld__accordion--open": isActive,
        "qld__accordion--closed": !isActive
      })
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

  @api get navItems() {
    return this._originalNavItems;
  }

  set navItems(items) {
    this._originalNavItems = items;
    this.navItemsMapping();
  }

  _navItemId = uniqueId("sf-gps-ds-au-qld-main-nav-item");

  navItemsMapping() {
    let map = {};
    this._navItems = this._originalNavItems
      ? this.mapItems(this._navItemId, 0, map, this._originalNavItems)
      : null;
    this._mapItems = map;
  }

  /* getters */

  get i18n() {
    return I18N;
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
    return computeClass({
      "qld__main-nav__menu": true,
      "qld__main-nav__menu--dark": this._cstyle === CSTYLE_DARK,
      "qld__main-nav__menu--dark-alt": this._cstyle === CSTYLE_DARKALT
    });
  }

  /* methods */

  @api close() {
    console.log("> close");
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = false;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      item.key = `item-${this.keyIndex++}`;
      item.isActive = false;

      Object.assign(item, this.mapSingleItemClasses(item, false));
    }
    //this._navItems = [...this._navItems];
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

      //item.className = item.isActive ? "active" : "";
      /*
      item.className = item.isActive && !this._megaMenu ? "active" : "";
      item.anchorClassName = item.isActive && this._megaMenu ? "active" : "";
      item.subNavClassName = item.isActive
        ? "nsw-main-nav__sub-nav active"
        : "nsw-main-nav__sub-nav";
        */

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
}
