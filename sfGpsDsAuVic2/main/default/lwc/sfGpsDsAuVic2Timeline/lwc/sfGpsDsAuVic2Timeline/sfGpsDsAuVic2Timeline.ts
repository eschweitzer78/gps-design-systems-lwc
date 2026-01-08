import { api } from "lwc";
import SfGpsDsElement from 'c/sfGpsDsElement';
import { computeClass, formatDateRange, isDate, isString, isObject, parseIso8601 } from "c/sfGpsDsHelpers";

import { TimelineItem, DecoratedTimelineItem } from "c/sfGpsDsAuVic2Timeline";

const PREVENTDEFAULT_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuVic2Timeline";

export default 
class SfGpsDsAuVic2Timeline 
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  preventDefault?: boolean = PREVENTDEFAULT_DEFAULT;
  _preventDefault = this.defineBooleanProperty("preventDefault", {
    defaultValue: PREVENTDEFAULT_DEFAULT
  })

  // @ts-ignore
  @api 
  className?: string;

  // @api: items

  _itemsOriginal: TimelineItem[];
  _items: DecoratedTimelineItem[] = [];

  // @ts-ignore
  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> set items",
        JSON.stringify(value)
      );
    }

    this._itemsOriginal = value;

    const lastCurrent = value.map((item) => item.current).lastIndexOf(true);

    this._items = value.map((item, index) => {
      const dateStart = isDate(item.dateStart) ? item.dateStart as Date : parseIso8601(item.dateStart as string);
      const dateEnd = isDate(item.dateEnd) ? item.dateEnd as Date : parseIso8601(item.dateEnd as string);
      const image = isString(item.image) ? JSON.parse(item.image) : (isObject(item.image) ? item.image : {});
      
      return {
        ...item,
        image: image.src ? {
          ...image,
          circle: true,
          aspect: {
            xs: "square"
          },
          sizes: "xs:80px"
        } : null,
        _key: `item-${index + 1}`,
        _index: index,
        subtitle: (item.dateStart && item.dateEnd) ? formatDateRange(dateStart, dateEnd) : item.subtitle,
        _className: computeClass({
          "rpl-timeline__item": true,
          "rpl-timeline__item--with-image": item.image,
          "rpl-timeline__item--current": item.current,
          "rpl-timeline__item--active": index < lastCurrent
        })
      }
    });

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "< set items",
        JSON.stringify(this._items)
      );
    }
  }

  /* getters */

  get computedClassName(): any {
    return {
      "rpl-timeline": true,
      [this.className || ""]: !!this.className
    }
  }

  get computedHasItems() {
    return this._items ? this._items.length > 1 : false;
  }

  handleItemClick(event: MouseEvent): void {
    const index = parseInt((event.target as HTMLElement).dataset.ndx, 10);
    const item = this._items[index];

    this.dispatchEvent(new CustomEvent("navigate", {
      detail: {
        text: item?.title,
        value: item?.url,
        index: index
      }
    }))
  }
}