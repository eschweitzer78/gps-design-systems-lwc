declare module "c/sfGpsDsAuNswCardCarousel" {
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
  import { CStyle, DateStyle, Orientation } from "c/sfGpsDsAuNswCardV2";

  export interface CardData {
    title: string,
    cstyle: CStyle,
    headline: boolean,
    orientation: Orientation,
    tag: string,
    date: Date,
    dateStyle: DateStyle,
    image: string,
    imageAlt: string,
    title: string,
    copy: string
  }

  export interface CardInternalData 
  extends CardData {
    _index: number,
    _ariaLabel: string,
    _className: string,
    _style: Partial<CSSStyleDeclaration>
  }

  export interface CardDisplayData 
  extends CardInternalData {
    _key: string,
    _displayIndex: string,
    _tabindex: string,
    _ariaHidden: string,
    _ariaCurrent: string,
    _styleString: string
  }

  export default 
  class SfGpsDsAuNswCardCarousel
  extends SfGpsDsElement {
    accessibilityLabel: string;
    navigationPagination: boolean;
    overflowItems: boolean;
    justifyContent: boolean;
    navigationItemClassName: string;
    navigationClassName: string;
    paginationClassName: string;
    className: string;

    drag: boolean;
    navigation: boolean;
    loop: boolean;
    counter: boolean;
    items: string;

    // private

    _drag: PropertyAccessor<boolean>;
    _navigation: PropertyAccessor<boolean>;
    _loopRequested: PropertyAccessor<boolean>;
    readonly __loop: boolean;
    _counter: PropertyAccessor<boolean>;

    _items: CardData[];
    _itemsOriginal: string;
    _itemsNb: number;

    updateItems(): void;

    itemsNb: number;
    visibleItemsNb: number;
    itemsWidth: number;
    itemOriginalWidth: number | boolean;

    selectedItem: number;
    translateContainer: number;
    containerWidth: number;
    animating: boolean;
    dragStart: number | boolean;

    selectedDotIndex: number;

    itemAutoSize: string;
    totTranslate: number;

    flexSupported: boolean;
    transitionSupported: boolean;
    cssPropertiesSupported: boolean;

    readonly computedAriaLive: string;
    readonly computedNavigationItemClassName: any;
    readonly computedNavigationClassName: any;
    readonly computedPaginationClassName: any;
    readonly selectedDot: number;
    readonly dotsNb: number;
    readonly dots: Array<{
      key: string,
      indexP1: number,
      className: string,
      indexClassName: string
    }>;
    readonly controls: HTMLElement[];
    readonly liveFirstItem: HTMLElement;
    readonly liveItems: HTMLElement[];
    readonly navDots: HTMLElement[];

    readonly displayItems: CardDisplayData[];
  }
}
