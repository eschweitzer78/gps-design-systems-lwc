import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  computeClass 
} from "c/sfGpsDsHelpers";
import ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

const PREVENTDEFAULT_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2VerticalNav";

export default 
class SfGpsDsAuVic2VerticalNav 
extends ExpandableStateMixin<SfGpsDsElement>(SfGpsDsElement) {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api
  preventDefault?: boolean;
  _preventDefault = this.defineBooleanProperty("preventDefault", {
    defaultValue: PREVENTDEFAULT_DEFAULT
  });

  // @ts-ignore
  @api 
  className?: string;

  /* getters */

  get computedClassName(): any {
    return {
      "rpl-vertical-nav": true,
      "rpl-u-screen-only": true,
      [this.className || ""]: !!this.className
    };
  }

  /* methods */
  
  mapItem(
    item: any, 
    index: number, 
    length: number, 
    active: boolean
  ): any {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> mapItem",
        JSON.stringify(item),
        index,
        length,
        active
      );

    /* override ExpandableState */

    const baseItem = super.mapItem(item, index, length, active);

    let rv = {
      ...baseItem,
      id: baseItem.id || `root-${index + 1}`,
      fullId: this.toggleId(item.id),
      active: active,
      ariaHidden: active ? null : true,
      className: computeClass({
        "rpl-vertical-nav__list-item": true,
        "rpl-vertical-nav__list-item--expanded": active
      }),
      items:
        baseItem.items && baseItem.items.length === 0 ? null : baseItem.items
    };

    if (DEBUG) console.debug(CLASS_NAME, "< mapItem", JSON.stringify(rv));

    return rv;
  }

  toggleId(
    itemId: string
  ): string {
    return `rpl-vertical-nav-${itemId}-toggle`;
  }

  /* event management */

  handleToggleMenuItem(
    event: CustomEvent
  ): void {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleToggleMenuItem",
        JSON.stringify(event.detail)
      );
    }

    this.dispatchEvent(
      new CustomEvent("togglemenuitem", {
        detail: event.detail
      })
    );
  }

  handleItemClick(
    event: CustomEvent
  ): void {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleItemClick",
        JSON.stringify(event.detail)
      );
    }

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: event.detail?.id,
        composed: true,
        bubbles: true
      })
    );
  }
}
