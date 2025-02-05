import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const ISEXPANDED_DEFAULT = false;

export default class extends LightningElement {
  @api items;
  @api className;

  /* api: level */

  _levelOriginal;
  _level;
  _showChildIcon;

  @api
  get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._level = Number(value);
    this._levelOriginal = this._level;
    this._showChildIcon = this._level > 2;
    this._childLevel = this._level + 1;
  }

  /* api: isExpanded */

  _isExpandedOriginal = ISEXPANDED_DEFAULT;
  _tabindex;

  @api
  get isExpanded() {
    return this._isExpandedOriginal;
  }

  set isExpanded(value) {
    this._isExpandedOriginal = value;
    this._tabindex = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISEXPANDED_DEFAULT
    })
      ? "0"
      : "-1";
  }

  get computedClassName() {
    return {
      "rpl-vertical-nav__list": true,
      [`rpl-vertical-nav__list--level-${this._level}`]: true,
      "rpl-type-p-small": true,
      [this.className]: this.className
    };
  }

  get decoratedItems() {
    return (this.items || []).map((item) => ({
      ...item,
      isLinkActive: item?.active && !item.items?.some((i) => i.active)
    }));
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("itemclick", {
        detail: {
          action: "click",
          index: this._level
        }
      })
    );
  }
}
