declare module "c/sfGpsDsAuNswCardCarousel" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { CStyle, DateStyle, Orientation } from "c/sfGpsDsAuNswCardV2";

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
    _tabindex?: string,
    _ariaHidden?: string,
    _ariaCurrent?: string,
    _styleString?: string
  }

  export interface DotInfo {
    key: string,
    indexP1: number,
    className: string | null,
    indexClassName: string
  }

  export type Direction = 
    "next" | 
    "prev" | 
    "click";

  export interface SwipeEventDetail {
    x: number,
    y: number,
    origin?: HTMLElement
  }

  export interface SwipeEvent extends CustomEvent {
    detail: SwipeEventDetail
  }

  export default 
  class SfGpsDsAuNswCardCarousel
  extends SfGpsDsElement {
    accessibilityLabel?: string;
    navigationPagination: boolean;
    overflowItems: boolean;
    justifyContent?: boolean;
    navigationItemClassName?: string;
    navigationClassName?: string;
    paginationClassName?: string;
    className?: string;

    drag?: boolean;
    navigation?: boolean;
    loop?: boolean;
    counter?: boolean;
    
    get items(): CardData[] | undefined;
    set items(value: CardData[]);

    // private

    _drag: PropertyAccessor<boolean>;
    _navigation: PropertyAccessor<boolean>;
    _loopRequested: PropertyAccessor<boolean>;
    get __loop(): boolean;
    _counter: PropertyAccessor<boolean>;

    _items?: CardInternalData[];
    _itemsOriginal?: CardData[];
    _itemsNb: number;

    updateItems(): void;

    itemsNb: number;
    visibleItemsNb?: number;
    itemsWidth?: number;
    itemOriginalWidth: number | boolean;

    selectedItem: number;
    translateContainer: number;
    containerWidth: number;
    animating: boolean;
    dragStart: number | boolean;

    selectedDotIndex?: number;

    itemAutoSize?: string;
    totTranslate: number;

    flexSupported: boolean;
    transitionSupported: boolean;
    cssPropertiesSupported: boolean;

    get computedAriaLive(): string;
    get computedNavigationItemClassName(): any;
    get computedNavigationClassName(): any;
    get computedPaginationClassName(): any;
    get selectedDot(): number;
    get dotsNb(): number;
    get dot(): Array<DotInfo>;
    get controls(): HTMLElement[];
    get liveFirstItem(): HTMLElement | null;
    get liveItems(): HTMLElement[];
    get navDots(): HTMLElement[];
    get displayItems(): CardDisplayData[];
    get computedControlPrevDisabled(): boolean;
    get computedControlNextDisabled(): boolean;
    get computedClassName(): any;
    get computedListClassName(): any;
    get computedListStyle(): string;
    get translateX(): string;
    get i18n(): Record<string, string>;

    getIndex(
      index: number
    ): number;

    getPositiveValue(
      value: number, 
      add: number
    ): number;

    noLoopTranslateValue(
      direction: Direction
    ): number;
  }
}
