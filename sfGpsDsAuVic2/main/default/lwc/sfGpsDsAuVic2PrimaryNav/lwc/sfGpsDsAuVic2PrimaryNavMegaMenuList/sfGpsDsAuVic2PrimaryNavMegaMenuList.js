import { LightningElement, api } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";

export default class extends FocusMixin(LightningElement) {
  @api parent; // ?IRplPrimaryNavItem
  @api items; // IRplPrimaryNavItem[]
  @api activeNavItems; // IRplPrimaryNavActiveItems

  _levelOriginal;
  _level;

  @api get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;
    this._level = Number(value);
  }

  get computedClassName() {
    return `rpl-primary-nav__mega-menu-list rpl-primary-nav__mega-menu-list--level-${this._level}`;
  }

  get isLevel1() {
    return this._level === 1;
  }

  get parentId() {
    return this.parent?.id;
  }

  get parentFocusKey() {
    return `list:${this._level}:${this.parentId}`;
  }

  get computedShowParent() {
    return this.parent?.url;
  }

  get decoratedItems() {
    if (!this.items) return [];

    const length = this.items.length;
    const rv = this.items.map((child, index) => ({
      ...child,
      type: child.items?.length && this._level < 4 ? "toggle" : "link",
      position: index === length - 1 ? "last" : undefined,
      focusKey: `list:${this._level}:${child.id}`
    }));

    return rv;
  }

  handleToggleItem(event) {
    this.dispatchEvent(
      new CustomEvent("toggleitem", {
        detail: event.detail
      })
    );
  }
}
