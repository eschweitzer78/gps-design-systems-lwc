import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicMenu extends LightningElement {
  static renderMode = "light";

  @api depth;

  /* api: layout */

  _layout = "horizontal";

  @api get layout() {
    return this._layout;
  }

  set layout(value) {
    this._layout = value;
    this.refreshContents();
  }

  @api className;
  @api index;

  @track visibleDepth = 0;

  /* api: menu */
  _menuOriginal;
  @track _menu;

  @api get menu() {
    return this._menuOriginal;
  }

  set menu(value) {
    this._menuOriginal = value;
    this.refreshContents();
  }

  refreshContents() {
    let value = this._menuOriginal;

    if (value == null || !Array.isArray(value)) {
      this._menu = [];
      return;
    }

    //this._menu = value;
    this._menu = value.map((entry, index) => ({
      ...entry,
      parentIcon:
        this.isRoot && !this.isVerticalLayout
          ? entry.open
            ? "up"
            : "down"
          : "right",
      liClass: computeClass({
        "rpl-menu__item": true,
        "rpl-menu__item--active": entry.open,
        "rpl-menu__item--after-active": index > 0 && value[index - 1].open,
        "rpl-menu__item--before-active":
          index < value.length - 1 && value[index + 1].open
      }),
      buttonClass: computeClass({
        "rpl-menu__item-link": true,
        "rpl-menu__item-link--active": entry.open
      })
    }));
  }

  get decoratedMenu() {
    if (this._menu == null) {
      return [];
    }

    let result = this._menu.map((entry, index) => ({
      ...entry,
      parentIcon:
        this.isRoot && !this.isVerticalLayout
          ? entry.open
            ? "up"
            : "down"
          : "right",
      liClass: computeClass({
        "rpl-menu__item": true,
        "rpl-menu__item--active": entry.open,
        "rpl-menu__item--after-active": index > 0 && this._menu[index - 1].open,
        "rpl-menu__item--before-active":
          index < this._menu.length - 1 && this._menu[index + 1].open
      }),
      buttonClass: computeClass({
        "rpl-menu__item-link": true,
        "rpl-menu__item-link--active": entry.open
      })
    }));

    return result;
  }

  @api open;
  @api title = "Menu";
  @api backTitle = "Back";
  @api parent;

  get isRoot() {
    return this.depth === undefined;
  }

  get isVerticalLayout() {
    return this.layout === "vertical";
  }

  @api rootVerticalDepth = 0;

  @api quickExitLabel;
  @api quickExitTarget;

  get computedClass() {
    return (
      computeClass({
        "rpl-menu": true,
        "rpl-menu--open": this.open,
        "rpl-menu--root": this.isRoot,
        "rpl-menu--vertical": this.isVerticalLayout, //(this.isRoot && this.isVerticalLayout), deal with css containment
        "rpl-menu--horizontal": !this.isVerticalLayout, //(this.isRoot && !this.isVerticalLayout), deal with css containment
        "rpl-menu--horizontal-floating-wrapper":
          !this.isVerticalLayout && this.depth === 1,
        "rpl-menu--subs": !this.isVerticalLayout && this.depth > 1
      }) + (this.className ? " " + this.className : "")
    );
  }

  get hasQuickExit() {
    return this.quickExitLabel && this.quickExitTarget;
  }

  get computedShowQuickExit() {
    return (
      this.hasQuickExit &&
      this.open &&
      ((!this.isVerticalLayout && this.depth === 1) || this.isVerticalLayout)
    );
  }

  get computedShowCloseMenu() {
    return !this.isRoot && this.isVerticalLayout;
  }

  get computedShowMenuHeading() {
    let showMenuHeading = !this.isVerticalLayout && this.depth === 1;
    return showMenuHeading && this.parent;
  }

  get computedMenuHeadingClass() {
    return computeClass({
      "rpl-menu__heading": this.depth === 1,
      "rpl-menu__heading--horizontal-sub":
        !this.isVerticalLayout && this.depth > 1,
      "rpl-link rpl-menu__item-link rpl-menu__item-link--parent":
        !this.isVerticalLayout && this.depth > 1
    });
  }

  get computedShowMenuItem() {
    return this.isRoot && this.isVerticalLayout;
  }

  get computedMenuItemsClass() {
    return computeClass({
      "rpl-menu__items": true,
      "rpl-menu__items--root": this.isRoot
    });
  }

  get computedSubMenuDepth() {
    return this.depth ? this.depth + 1 : 1;
  }

  get computedVisibleDepth() {
    return this.isRoot ? this.visibleDepth : null;
  }

  get computedRootVerticalDepth() {
    return this.isRoot ? this.rootVerticalDepth : null;
  }

  get computedShowParentLink() {
    return (
      (this.isVerticalLayout && this.parent) || (this.depth > 1 && this.parent)
    );
  }

  handleMenuLinkClick(event) {
    event.preventDefault();
    let index = event.currentTarget.dataset.menuIndex;

    if (this.isRoot && !this.isVerticalLayout) {
      this.visibleDepth = 1;
      this.dispatchEvent(
        new CustomEvent("rootmenuclicked", {
          detail: {
            index: index
          }
        })
      );

      return;
    }

    this._menu = this._menu.map((entry) => ({
      ...entry,
      open: entry.index === index ? true : false,
      children:
        entry.index === index && entry.children
          ? entry.children.map((entry2) => ({
              ...entry2,
              open: false
            }))
          : entry.children
    }));

    this.visibleDepth = this.depth ? this.depth + 1 : 1;

    this.dispatchEvent(
      new CustomEvent("openmenu", {
        detail: {
          index: index,
          depth: this.visibleDepth
        }
      })
    );

    if (this.isRoot) {
      // eslint-disable-next-line @lwc/lwc/no-api-reassignments
      this.rootVerticalDepth = 1;
    }
  }

  handleItemClick(event) {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: event.currentTarget.dataset.menuIndex
      })
    );
  }

  handleNavigate(event) {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: event.detail
      })
    );
  }

  handleOpenMenu(event) {
    this.dispatchEvent(
      new CustomEvent("openmenu", {
        detail: event.detail
      })
    );

    this.visibleDepth = event.detail.depth;
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.rootVerticalDepth = this.visibleDepth; // ESC
  }

  handleCloseMenu(event) {
    this.dispatchEvent(
      new CustomEvent("closemenu", {
        detail: event.detail
      })
    );

    if (this.index === event.detail.index) {
      this.closeAllItems();
    } else {
      this.closeItem(event);
    }

    if (this.isRoot) {
      this.rootVerticalDepth--;
      if (this.rootVerticalDepth === 0) {
        this.visibleDepth = 0;
      }
    } else {
      this.visibleDepth = event.detail.depth;
    }
  }

  handleVerticalGoBack(event) {
    event.preventDefault();

    this.dispatchEvent(
      new CustomEvent("closemenu", {
        detail: {
          index: this.index,
          depth: this.depth
        }
      })
    );
  }

  closeAllItems() {
    if (this._menu) {
      this._menu = this._menu.map((element) => ({
        ...element,
        open: false
      }));
    }
  }

  isItemOpen(index) {
    if (this._menu && this._menu[index]) {
      return this._menu[index].open;
    }

    return false;
  }

  openItem(index) {
    if (this._menu && this._menu[index]) {
      this._menu[index].open = true;
      this._menu = [...this._menu];
    }
  }

  closeItem(index) {
    if (this._menu && this._menu[index]) {
      this._menu[index].open = false;
      this._menu = [...this._menu];
    }
  }
}
