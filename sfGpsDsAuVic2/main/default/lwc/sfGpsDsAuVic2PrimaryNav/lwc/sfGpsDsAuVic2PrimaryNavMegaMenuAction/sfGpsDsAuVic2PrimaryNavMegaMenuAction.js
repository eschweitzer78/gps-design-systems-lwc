import { LightningElement, api } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends FocusMixin(LightningElement, "action") {
  @api item;
  @api parent;
  @api type = "link"; // toggle, link
  @api position; // first, last
  @api activeNavItems;

  /* api: level */

  _levelOriginal;
  _level;

  @api get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;
    this._level = Number(value);
  }

  /* getters */

  get isToggleType() {
    return this.type === "toggle";
  }

  get isLinkType() {
    return this.type === "link";
  }

  get computedClassName() {
    return computeClass({
      "rpl-primary-nav__mega-menu-action": true,
      "rpl-primary-nav__mega-menu-action--toggle": this.isToggleType,
      "rpl-primary-nav__mega-menu-action--link": this.isLinkType,
      "rpl-primary-nav__mega-menu-action--active": this.isActive,
      "rpl-u-focusable-block": true,
      "rpl-type-p-small": true
    });
  }

  get isActive() {
    return (
      this._level &&
      this.activeNavItems &&
      this.activeNavItems["level" + this._level]?.id === this.item.id
    );
  }

  /* event management */

  handleClick() {
    if (this.type === "link") {
      this.dispatchEvent(
        new CustomEvent("navigate", {
          detail: {
            action: "click:action",
            itemId: this.item.id
          },
          composed: true,
          bubbles: true
        })
      );
    } else if (this.level !== 4) {
      this.dispatchEvent(
        new CustomEvent("toggleitem", {
          detail: {
            action: this.isActive ? "open" : "close",
            level: this._level,
            item: this.item
          }
        })
      );
    }
  }

  handleKeydown(event) {
    if (event.code !== "Tab") {
      return;
    }

    const next = this._level + 1;
    const previous = this._level - 1;

    if (event.shiftKey && this.position === "first") {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("toggleitem", {
          detail: {
            action: this.isActive ? "open" : "close",
            level: previous,
            item: this.item
          }
        })
      );

      this.setFocus(`list:${previous}:${this.item.id}`);
    } else if (!event.shiftKey && this.isActive && this.item?.items) {
      event.preventDefault();
      this.setFocus(`list:${next}:${this.item.id}`);
    } else if (!event.shiftKey && this.position === "last") {
      event.preventDefault();

      if (previous > 0) {
        this.dispatchEvent(
          new CustomEvent("toggleitem", {
            detail: {
              action: this.isActive ? "open" : "close",
              level: previous,
              item: this.activeNavItems?.["level" + previous]
            }
          })
        );
      }

      this.setFocus(
        this.focusTarget.navCollapsed && this._level === 1
          ? "menu:toggle"
          : `list:${previous}:${this.parent}`
      );
    }
  }
}
