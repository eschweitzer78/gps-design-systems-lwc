import { LightningElement, api } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";
import { normaliseString, computeClass } from "c/sfGpsDsHelpers";

const POSITION_DEFAULT = "none";
const POSITION_FIRST = "first";
const POSITION_LAST = "last";
const POSITION_VALUES = [POSITION_DEFAULT, POSITION_FIRST, POSITION_LAST];

const TYPE_LINK = "link";
const TYPE_TOGGLE = "toggle";
const TYPE_VALUES = [TYPE_LINK, TYPE_TOGGLE];
const TYPE_DEFAULT = TYPE_LINK;

export default class extends FocusMixin(LightningElement, "action") {
  @api item;
  @api parent;
  @api activeNavItems;

  /* api: level */

  _level;
  _levelOriginal;

  @api
  get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;
    this._level = Number(value);
  }

  /* api: position */

  _position;
  _positionOriginal;

  @api
  get position() {
    return this._positionOriginal;
  }

  set position(value) {
    this._positionOriginal = value;
    this._position = normaliseString(value, {
      validValues: POSITION_VALUES,
      fallbackValue: POSITION_DEFAULT
    });
  }

  /* api: type */

  _type = TYPE_DEFAULT;
  _typeOriginal = TYPE_DEFAULT;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    });
  }

  /* getters */

  get computedIsToggleType() {
    return this._type === TYPE_TOGGLE;
  }

  get computedIsLinkType() {
    return this._type === TYPE_LINK;
  }

  get computedClassName() {
    return computeClass({
      "rpl-primary-nav__mega-menu-action": true,
      "rpl-primary-nav__mega-menu-action--toggle": this.computedIsToggleType,
      "rpl-primary-nav__mega-menu-action--link": this.computedIsLinkType,
      "rpl-primary-nav__mega-menu-action--active": this.computedIsActive,
      "rpl-u-focusable-block": true,
      "rpl-type-p-small": true
    });
  }

  get computedIsActive() {
    return (
      this._level &&
      this.activeNavItems &&
      this.activeNavItems["level" + this._level]?.id === this.item.id
    );
  }

  /* event management */

  handleClick() {
    if (this.computedIsLinkType) {
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
    } else if (this._level !== 4) {
      this.dispatchEvent(
        new CustomEvent("toggleitem", {
          detail: {
            action: this.computedIsActive ? "open" : "close",
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

    if (event.shiftKey && this._position === POSITION_FIRST) {
      event.preventDefault();

      this.dispatchEvent(
        new CustomEvent("toggleitem", {
          detail: {
            action: this.computedIsActive ? "open" : "close",
            level: previous,
            item: this.item
          }
        })
      );

      this.setFocus(`list:${previous}:${this.item.id}`);
    } else if (!event.shiftKey && this.computedIsActive && this.item?.items) {
      event.preventDefault();
      this.setFocus(`list:${next}:${this.item.id}`);
    } else if (!event.shiftKey && this._position === POSITION_LAST) {
      event.preventDefault();

      if (previous > 0) {
        this.dispatchEvent(
          new CustomEvent("toggleitem", {
            detail: {
              action: this.computedIsActive ? "open" : "close",
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
