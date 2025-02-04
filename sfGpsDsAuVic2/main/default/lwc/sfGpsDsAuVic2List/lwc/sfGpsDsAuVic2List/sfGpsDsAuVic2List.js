import { LightningElement, api } from "lwc";
import { isArray, normaliseString } from "c/sfGpsDsHelpers";
import { RplIconPlacement } from "c/sfGpsDsAuVic2IconConstants";

const RplListTypes = ["unordered", "ordered"];
const TYPE_DEFAULT = RplListTypes[0];
const ICON_PLACEMENT_DEFAULT = "before";

export default class extends LightningElement {
  @api items;
  @api depth = 0;
  @api maxDepth;
  @api withLinkIds;
  @api itemClassName;
  @api className;
  @api preventDefault;

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
      validValues: RplListTypes,
      fallbackValue: TYPE_DEFAULT
    });
  }

  /* api: iconPlacement */

  _iconPlacement = ICON_PLACEMENT_DEFAULT;
  _iconPlacementOriginal = ICON_PLACEMENT_DEFAULT;

  @api
  get iconPlacement() {
    return this._iconPlacementOriginal;
  }

  set iconPlacement(value) {
    this._iconPlacementOriginal = value;
    this._iconPlacement = normaliseString(value, {
      validValues: RplIconPlacement,
      fallbackValue: ICON_PLACEMENT_DEFAULT
    });
  }

  /* computed */

  get computedIsUnordered() {
    return this.type === RplListTypes[0];
  }

  get computedIsOrdered() {
    return this.type === RplListTypes[1];
  }

  get computedClassName() {
    return {
      "rpl-list__items": true,
      [this.className]: this.className
    };
  }

  get computedItemClassName() {
    return {
      "rpl-list__item": true,
      [this.itemClassName]: this.itemClassName
    };
  }

  get computedShouldRenderChildren() {
    return this.maxDepth == null ? true : this.depth < this.maxDepth;
  }

  get computedDepthPlusOne() {
    return this.depth + 1;
  }

  get decoratedItems() {
    const roe =
      this.items && isArray(this.items)
        ? this.items.map((item, index) => {
            const rv = {
              ...item,
              displayId: this.withLinksId ? item.id : null,
              index: item.id || index,
              display: item.url || item.text,
              key: `item-${index + 1}`,
              items: this.computedShouldRenderChildren ? item.items : null
            };

            if (!this.displayId) {
              delete rv.displayId;
            }

            return rv;
          })
        : [];

    return roe;
  }

  /* event management */

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
