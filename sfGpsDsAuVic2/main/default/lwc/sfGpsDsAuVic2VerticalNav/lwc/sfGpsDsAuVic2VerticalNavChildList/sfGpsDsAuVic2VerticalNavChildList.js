import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2VerticalNavChildList extends LightningElement {
  @api items;
  @api className;

  /* api level */

  _levelOriginal;
  _level;
  _showChildIcon;

  @api get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._level = Number(value);
    this._levelOriginal = this._level;
    this._showChildIcon = this._level > 2;
    this._childLevel = this._level + 1;
  }

  /* api isExpanded */

  _isExpandedOriginal;
  _tabindex;

  @api get isExpanded() {
    return this._isExpandedOriginal;
  }

  set isExpanded(value) {
    this._isExpandedOriginal = value;
    this._tabindex = value ? "0" : "-1";
  }

  get computedClassName() {
    return computeClass({
      "rpl-vertical-nav__list": true,
      [`rpl-vertical-nav__list--level-${this._level}`]: true,
      "rpl-type-p-small": true,
      [this.className]: this.className
    });
  }

  get _decoratedItems() {
    return (this.items || []).map((item) => ({
      ...item,
      isLinkActive: item?.active && !item.items?.some((i) => i.active)
    }));
  }

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
