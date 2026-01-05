declare module "c/sfGpsDsAuVic2Timeline" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export interface TimelineItem {
    image?: string;
    title?: string;
    subtitle?: string;
    dateStart?: string | Date;
    dateEnd?: string | Date;
    current?: boolean
    description?: string;
    url?: string;
  }
  
  export interface DecoratedTimelineItem extends TimelineItem {
    _key?: string;
    _className?: string;
  }

  export default 
  class SfGpsDsAuVic2VerticalNav 
  extends SfGpsDsElement {

    // title;

    preventDefault?: boolean;
    className?: string;

    // private

    _itemsOriginal: TimelineItem[];
    _items: DecoratedTimelineItem[];
    _preventDefault: PropertyAccessor<boolean>;

    get computedClassName(): any;
    get computedHasItems(): boolean;

    handleItemClick(event: MouseEvent): void;
  }
}