// Based on RplPrimaryNavBar v2.6.2

import { LightningElement, api } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";
import cBasePath from "@salesforce/community/basePath";
import STATIC_RESOURCE from "@salesforce/resourceUrl/sfGpsDsAuVic2";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2PrimaryNavBar";
const I18N = {
  mobileToggleLabel: "Menu"
};

export default class extends FocusMixin(
  LightningElement,
  function () {
    const uaSlot = this.querySelectorAll("*[slot='userAction']");
    console.log("found slot", uaSlot);
  },
  "user-actions"
) {
  @api primaryLogo;
  @api secondaryLogo;
  @api showSearch;
  @api showQuickExit;
  @api isMegaNavActive;
  @api isSearchActive;
  @api activeNavItems;

  /* api: items */

  _items;
  _itemsOriginal;
  _itemsById;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set items", JSON.stringify(value));

    this._itemsOriginal = value;
    this._itemsById = new Map();
    this._items = this.itemsMapper(value);

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< set items",
        JSON.stringify(this._items),
        JSON.stringify(this._itemsById)
      );
  }

  get decoratedItems() {
    if (DEBUG)
      console.log(CLASS_NAME, "> decoratedItems", JSON.stringify(this._items));

    const rv = (this._items || []).map((item) => ({
      ...item,
      _isItemActive: this.isItemActive(item),
      _focusKey: `list:1:${item.id}`
    }));

    if (DEBUG) console.log(CLASS_NAME, "< decoratedItems", JSON.stringify(rv));

    return rv;
  }

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      "rpl-primary-nav__nav-bar": true,
      "rpl-primary-nav__nav-bar--search-active": this.isSearchActive
    };
  }

  get computedLogosClassName() {
    return {
      "rpl-primary-nav__logos": true,
      "rpl-primary-nav__logos--has-secondary-logo": this.secondaryLogo
    };
  }

  get computedDisablePrimaryLogo() {
    return false;
  }

  get computedHasPrimaryLogo() {
    return this.primaryLogo?.src;
  }

  get computedPrimaryLogoHref() {
    return `${STATIC_RESOURCE}/assets/logos/logo-vic-gov.svg#logo`;
  }

  get decoratedPrimaryLogo() {
    return {
      ...this.primaryLogo,
      href: this.primaryLogo?.href || cBasePath,
      altText: this.primaryLogo?.altText || "Government of Victoria Logo",
      printSrc: this.primaryLogo?.printSrc || this.primaryLogo?.src
    };
  }

  get computedShowLogoDivider() {
    return this.secondaryLogo && !this.computedDisablePrimaryLogo;
  }

  /* methods */

  itemsMapper(items) {
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.items) {
          this.itemsMapper(item.items);
        }

        this._itemsById.set(item.id, item);
      }
    }

    return items;
  }

  getItemById(id) {
    const rv = id ? this._itemsById.get(id) : null;
    if (DEBUG) console.log(CLASS_NAME, "getItemById", id, JSON.stringify(rv));
    return rv;
  }

  isItemActive(item) {
    return this.activeNavItems.level1?.id === item.id;
  }

  @api focus() {
    if (this.refs.primaryLogo) {
      this.refs.primaryLogo.focus();
    } else if (this.refs.secondaryLogo) {
      this.refs.secondaryLogo.focus();
    }
  }

  /* event management */

  handleMobileToggleItem() {
    this.dispatchEvent(
      new CustomEvent("togglemobilemenu", {
        detail: I18N.mobileToggleLabel
      })
    );
  }

  handleDesktopToggleItem(event) {
    const itemId = event.detail;
    const item = this.getItemById(itemId);

    this.dispatchEvent(
      new CustomEvent("toggleitem", {
        detail: {
          action: this.isItemActive(item) ? "open" : "close",
          level: 1,
          item: item
        }
      })
    );
  }

  handleToggleSearch() {
    this.dispatchEvent(new CustomEvent("togglesearch"));
  }
}
