import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";
import { RplIconPlacement } from "c/sfGpsDsAuVic2IconConstants";

const RplListTypes = ["unordered", "ordered"];
const TYPE_DEFAULT = RplListTypes[0];
const ICON_PLACEMENT_DEFAULT = "before";

export default class SfGpsDsAuVic2List extends LightningElement {
  /* api: type */

  _typeOriginal = TYPE_DEFAULT;
  _type = TYPE_DEFAULT;

  @api get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: RplListTypes,
      fallbackValue: TYPE_DEFAULT
    });
  }

  @api items;
  @api depth = 0;
  @api maxDepth;

  /* api: iconPlacement */

  _iconPlacementOriginal = ICON_PLACEMENT_DEFAULT;
  _iconPlacement = ICON_PLACEMENT_DEFAULT;

  @api get iconPlacement() {
    return this._iconPlacementOriginal;
  }

  set iconPlacement(value) {
    this._iconPlacementOriginal = value;
    this._iconPlacement = normaliseString(value, {
      validValues: RplIconPlacement,
      fallbackValue: ICON_PLACEMENT_DEFAULT
    });
  }

  @api withLinkIds;
  @api itemClassName;
  @api className;
  @api preventDefault;

  get computedIsUnordered() {
    return this.type === RplListTypes[0];
  }

  get computedIsOrdered() {
    return this.type === RplListTypes[1];
  }

  get computedClassName() {
    return computeClass({
      "rpl-list__items": true,
      [this.className]: this.className
    });
  }

  get computedItemClassName() {
    return computeClass({
      "rpl-list__item": true,
      [this.itemClassName]: this.itemClassName
    });
  }

  get shouldRenderChildren() {
    return this.maxDepth == null ? true : this.depth < this.maxDepth;
  }

  get computedDepthPlusOne() {
    return this.depth + 1;
  }

  get decoratedItems() {
    const roe =
      this.items && Array.isArray(this.items)
        ? this.items.map((item, index) => {
            const rv = {
              ...item,
              displayId: this.withLinksId ? item.id : null,
              index: item.id || index,
              display: item.url || item.text,
              key: `item-${index + 1}`,
              items: this.shouldRenderChildren ? item.items : null
            };

            if (!this.displayId) {
              delete rv.displayId;
            }

            return rv;
          })
        : [];

    return roe;
  }

  handleClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }

    const index = parseInt(event.currentTarget.dataset.ndx, 10);

    if (
      this.items == null ||
      index == null ||
      index < 0 ||
      index >= this.items.length
    ) {
      return;
    }

    const item = this.items[index];

    if (item == null) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("itemclick", {
        detail: {
          action: "click",
          value: item.url,
          text: item.text,
          index: item.index,
          id: item.id,
          type: item.type
        }
      })
    );
  }
}
