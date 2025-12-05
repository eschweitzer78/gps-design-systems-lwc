import { LightningElement, api, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import cBasePath from "@salesforce/community/basePath";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const I18N = {
  ariaLabel: "Left navigation",
  home: "Home",
  toggleNavigation: "Toggle navigation"
};

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

export default class extends LightningElement {
  @api className;

  /* api: navItems, Array of navigation item objects { url, text, subNav: ... } */

  _navItemsOriginal;
  _navItems;
  _mapItems;

  @api
  get navItems() {
    return this._navItemsOriginal;
  }

  set navItems(items) {
    this._navItemsOriginal = items;
    this._openSet = new Set();

    this.navItemsMapping();
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

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      "qld__left-nav": true,
      js: true,
      [this.className]: this.className
    };
  }

  get computedChevronUpIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#chevron-up";
  }

  /* methods */

  mapItems(parentIndex, parentLevel, map, items) {
    const currentUrl = document.URL.split("?")[0];
    let index = 0;

    return items.map((item) => {
      let isActive = currentUrl && currentUrl.includes(item.url);
      let isCurrent = currentUrl && currentUrl.endsWith(item.url);
      let isHome = item.url === cBasePath + "/";

      let result = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        id: `vertical-nav-item-${parentIndex}-${index}`,
        url: item.url || `javascript${":"}void(0)`,
        level: parentLevel + 1,
        isActive: isActive,
        isHome: isHome,
        liClassName: isCurrent ? "active" : null, // QLD DS does not have the concept of active parent, replaced isActive by isCurrent
        ariaCurrent: isCurrent ? "page" : null,
        ariaSelected: false,
        ariaLabel: `${I18N.toggleNavigation}, ${item.text}`,
        subNav: []
      };

      if (item.subNav) {
        result.subNav = this.mapItems(
          result.index,
          parentLevel + 1,
          map,
          item.subNav
        );

        // Assuming parent label will be hierarchical in exp cloud navs -- which have no attached urls */
        if (
          !item.url &&
          result.subNav.filter(
            (subNavItem) => subNavItem.isActive || subNavItem.ariaCurrent
          ).length
        ) {
          // result.liClassName = "active";
          // commented out as QLD DS does not have the concept of active parent
          result.isActive = true;
        }
      } else {
        delete result.subNav;
      }

      if (result.isActive && result.subNav) {
        this._openSet.add(result.index);
      }

      map[result.index] = result;
      return result;
    });
  }

  navItemsMapping() {
    let map = {};
    this._navItems = this._navItemsOriginal
      ? this.mapItems("navitem", 0, map, this._navItemsOriginal)
      : null;
    this._mapItems = map;
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleToggleButtonClick(event) {
    this._isOpen = !this._isOpen;
  }

  handleClickNavigate(event) {
    event.preventDefault();

    const index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  handleClick(event) {
    event.preventDefault();
    this.handleClickNavigate(event);
  }

  @track _openSet = new Set();

  handleItemToggle(event) {
    let index = event.currentTarget.dataset.ndx;

    if (this._openSet.has(index)) {
      this._openSet.delete(index);
    } else {
      this._openSet.add(index);
    }

    this._openSet = new Set(this._openSet);
  }

  mapDecoratedNavItems(items) {
    return items.map((item) => {
      const isOpen = this._openSet.has(item.index);

      let rv = {
        ...item,
        anchorClassName: {
          "qld__left-nav__item-link": true,
          "qld__left-nav__item-link--open": isOpen
        },
        buttonClassName: {
          "qld__left-nav__item-toggle": true,
          "qld__accordion--closed": !isOpen,
          "qld__accordion--open": isOpen
        },
        ulClassName: {
          "qld__link-list": true,
          "qld__accordion--closed": !isOpen,
          "qld__accordion--open": isOpen,
          qld__accordion__body: true
        },
        ariaExpanded: isOpen
      };

      if (rv.subNav) {
        rv.subNav = this.mapDecoratedNavItems(rv.subNav);
      }

      return rv;
    });
  }

  get _decoratedNavItems() {
    return this.mapDecoratedNavItems(this._navItems);
  }
}
