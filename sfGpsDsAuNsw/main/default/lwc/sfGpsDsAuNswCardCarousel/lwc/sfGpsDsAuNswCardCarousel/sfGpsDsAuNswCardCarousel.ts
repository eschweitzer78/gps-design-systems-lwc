/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import {
  computeClass,
  styleToString,
  formatTemplate
} from "c/sfGpsDsHelpers";
import OnWindowResize from "c/sfGpsDsOnWindowResize";
import SwipeContent from "./swipe-content";

import type { 
  CardData, 
  CardInternalData, 
  CardDisplayData 
} from "c/sfGpsDsAuNswCardCarousel";

type Direction = "next" | "prev" | "click";

const DEFAULT_NAVIGATION_ITEM_CLASSNAME = "nsw-carousel__nav-item";
const DEFAULT_NAVIGATION_CLASSNAME = "nsw-carousel__navigation";
const DEFAULT_PAGINATION_CLASSNAME = "nsw-carousel__navigation--pagination";
const ITEM_CLASSNAME = "nsw-carousel__item";
const CONTROL_CLASSNAME = "nsw-carousel__control";
const DRAGGING_CLASSNAME = "nsw-carousel--is-dragging";
const WRAPPER_CLASSNAME = "nsw-carousel__wrapper";
const SR_CLASSNAME = "sr-only";

const I18N = {
  showPreviousItems: "Show previous items",
  showNextItems: "Show next items",
  carouselItemsSrOnly: "Carousel items",
  itemAriaLabel: "{current} of {total}",
  carouselAriaLive:
    "Item {selected} selected. {visible} items of {total} visible."
};

const DRAG_DEFAULT = false;
const NAVIGATION_DEFAULT = true;
const LOOP_DEFAULT = false;
const COUNTER_DEFAULT = false;

export default 
class SfGpsDsAuNswCardCarousel 
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  accessibilityLabel: string; // data-description

  // @ts-ignore
  @api 
  navigationPagination = false;

  // @ts-ignore
  @api 
  overflowItems = false;

  // @ts-ignore
  @api 
  justifyContent: boolean;

  // @ts-ignore
  @api 
  navigationItemClassName: string;

  // @ts-ignore
  @api 
  navigationClassName: string;

  // @ts-ignore
  @api 
  paginationClassName: string;

  // @ts-ignore
  @api 
  className: string;

  // @ts-ignore
  @api 
  drag: boolean;
  _drag = this.defineBooleanProperty("drag", {
    defaultValue: DRAG_DEFAULT
  });

  // @ts-ignore
  @api 
  navigation: boolean;
  _navigation = this.defineBooleanProperty("navigation", {
    defaultValue: NAVIGATION_DEFAULT
  });

  // @ts-ignore
  @api 
  loop: boolean;
  _loopRequested = this.defineBooleanProperty("loop", {
    defaultValue: LOOP_DEFAULT
  });

  get __loop() {
    return this._loopRequested.value && !this._navigation.value;
  }

  // @ts-ignore
  @api 
  counter: boolean;
  _counter = this.defineBooleanProperty("counter", {
    defaultValue: COUNTER_DEFAULT,
    watcher: () => {
      if (!this._counter.value) this.emitCarouselActiveItemsEvent();
    }
  });

  /* api: items, Array of Objects */

  _items: CardInternalData[];
  _itemsOriginal: CardData[];
  _itemsNb: number;

  // @ts-ignore
  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;
    this.updateItems();
  }

  /* ----- */

  updateItems(): void {
    const value = this._itemsOriginal || [];
    const itemsNb = value.length;

    if (!this._items?.length && value) {
      this._initialRender = true;
    }

    this._items = value.map((item, index) => ({
      ...item,
      _index: index,
      _ariaLabel: formatTemplate(I18N.itemAriaLabel, {
        current: index + 1,
        total: itemsNb
      }),
      _className: ITEM_CLASSNAME,
      _style: {}
    }));

    this.itemsNb = itemsNb;
  }

  itemsNb: number;
  visibleItemsNb: number = null;
  itemsWidth: number = null;
  itemOriginalWidth: number | boolean = false;

  selectedItem: number = 0;
  translateContainer: number = 0;
  containerWidth: number = 0;
  animating: boolean = false;
  dragStart: number | boolean = false;

  selectedDotIndex: number;

  // @ts-ignore
  @track 
  itemAutoSize: string;
  // @ts-ignore
  @track 
  totTranslate: number = 0;

  flexSupported: boolean = false;
  transitionSupported: boolean = false;
  cssPropertiesSupported: boolean = false;

  /* getters */
  /* ------- */

  get computedAriaLive(): string {
    return formatTemplate(I18N.carouselAriaLive, {
      selected: this.selectedItem + 1,
      visible: this.visibleItemsNb,
      total: this.itemsNb
    });
  }

  get computedNavigationItemClassName(): any {
    return this.navigationItemClassName || DEFAULT_NAVIGATION_ITEM_CLASSNAME;
  }

  get computedNavigationClassName(): any {
    return {
      [this.navigationClassName || DEFAULT_NAVIGATION_CLASSNAME]: true,
      [`${this.navigationClassName || DEFAULT_NAVIGATION_CLASSNAME}--pagination`]:
        this.navigationPagination
    };
  }

  get computedPaginationClassName(): any {
    return this.paginationClassName || DEFAULT_PAGINATION_CLASSNAME;
  }

  get selectedDot(): number {
    return Math.ceil(this.selectedItem / this.visibleItemsNb);
  }

  get dotsNb(): number {
    return this.visibleItemsNb
      ? Math.ceil(this.itemsNb / this.visibleItemsNb)
      : 0;
  }

  get dots(): Array<{
    key: string,
    indexP1: number,
    className: string,
    indexClassName: string
  }> {
    const selectedDot = this.selectedDot;
    const indexClassName = this.navigationPagination ? "" : SR_CLASSNAME;
    const dotsNb = this.dotsNb;
    const cnicn = this.computedNavigationItemClassName;
    const rv = [];

    for (let i = 0; i < dotsNb; i += 1) {
      rv.push({
        key: `dot-${i + 1}`,
        indexP1: i + 1,
        className: computeClass({
          [cnicn]: cnicn,
          [cnicn + "--selected"]: cnicn && i === selectedDot
        }),
        indexClassName
      });
    }

    return rv;
  }

  get controls(): HTMLElement[] {
    return Array.from(this.querySelectorAll("." + CONTROL_CLASSNAME));
  }

  get liveFirstItem(): HTMLElement {
    return this.refs.list.querySelector("li");
  }

  get liveItems(): HTMLElement[] {
    return Array.from(this.refs.list.querySelectorAll("li"));
  }

  get navDots(): HTMLElement[] {
    return Array.from(
      this.refs.navDots.querySelectorAll(
        `.${this.computedNavigationItemClassName}`
      )
    );
  }

  get displayItems(): CardDisplayData[] {
    let rv = [];
    const itemsNb = this.itemsNb;
    const visibleItemsNb = this.visibleItemsNb;
    const carouselActive = itemsNb > visibleItemsNb;
    let displayIndex = 0;

    if (this.__loop) {
      for (let index = itemsNb - visibleItemsNb; index < itemsNb; index += 1) {
        rv.push({
          ...this._items[index],
          _key: `card-b${index + 1}`,
          _displayIndex: displayIndex++,
          _style: this.itemsWidth
            ? {
                ...this._items[index]._style,
                width: `${this.itemsWidth}px`
              }
            : this._items[index]._style
        });
      }
    }

    for (let index = 0; index < itemsNb; index += 1) {
      rv.push({
        ...this._items[index],
        _key: `card-${index + 1}`,
        _displayIndex: displayIndex++,
        _style: this.itemsWidth
          ? {
              ...this._items[index]._style,
              width: `${this.itemsWidth}px`
            }
          : this._items[index]._style
      });
    }

    if (this.__loop) {
      for (let index = 0; index < this.visibleItemsNb; index += 1) {
        rv.push({
          ...this._items[index],
          _key: `card-a${index + 1}`,
          _displayIndex: displayIndex++,
          _style: this.itemsWidth
            ? {
                ...this._items[index]._style,
                width: `${this.itemsWidth}px`
              }
            : this._items[index]._style
        });
      }
    }

    for (let i = 0; i < rv.length; i += 1) {
      if (this.__loop) {
        const modIndex =
          (i + this.itemsNb - this.visibleItemsNb) % this.itemsNb;
        const modMin = this.selectedItem;
        const modMax =
          (this.selectedItem + this.visibleItemsNb + this.itemsNb) %
          this.itemsNb;

        if (
          modMin < modMax
            ? modIndex >= modMin && modIndex < modMax
            : modIndex >= modMin || modIndex < modMax
        ) {
          rv[i]._tabindex = null;
          rv[i]._ariaHidden = null;
          rv[i]._ariaCurrent = true;
        } else {
          rv[i]._tabindex = "-1";
          rv[i]._ariaHidden = true;
          rv[i]._ariaCurrent = null;
        }
      } else if (
        (i < this.selectedItem ||
          i >= this.selectedItem + this.visibleItemsNb) &&
        carouselActive
      ) {
        rv[i]._tabindex = "-1";
        rv[i]._ariaHidden = true;
        rv[i]._ariaCurrent = null;
      } else {
        rv[i]._tabindex = null;
        rv[i]._ariaHidden = null;
        rv[i]._ariaCurrent = true;
      }

      rv[i]._styleString = styleToString(rv[i]._style);
    }

    return rv;
  }

  get computedControlPrevDisabled(): boolean {
    return !this.__loop && this.totTranslate >= 0;
  }

  get computedControlNextDisabled(): boolean {
    return (
      !this.__loop &&
      (this.totTranslate <= -this.translateContainer - this.containerWidth ||
        this.itemsNb <= this.visibleItemsNb)
    );
  }

  get computedClassName(): any {
    return {
      "nsw-carousel": true,
      "nsw-carousel--loaded": !this._initialRender,
      [this.className]: this.className
    };
  }

  get computedListClassName(): any {
    return {
      "nsw-carousel__list": true,
      "nsw-carousel__list--animating": this.animating,
      "nsw-justify-content-center":
        this.justifyContent && this.itemsNb < this.visibleItemsNb
    };
  }

  get computedListStyle(): string {
    const translate = this.translateX;
    return `transform:${translate};ms-transform:${translate}`;
  }

  get translateX(): string {
    return this.__loop
      ? `translateX(${this.totTranslate + this.translateContainer}px)`
      : `translateX(${this.totTranslate}px)`;
  }

  get i18n() {
    return I18N || {};
  }

  /* methods - rewritten */

  getIndex(index: number) {
    const i = index < 0 ? this.getPositiveValue(index, this.itemsNb) : index;
    return i >= this.itemsNb ? i % this.itemsNb : i;
  }

  getPositiveValue(value, add) {
    const val = value + add;
    return val > 0 ? val : this.getPositiveValue(val, add);
  }

  noLoopTranslateValue(direction: Direction) {
    let translate = this.totTranslate;

    switch (direction) {
      case "next":
        translate = this.totTranslate + this.translateContainer;
        break;

      case "prev":
        translate = this.totTranslate - this.translateContainer;
        break;

      case "click":
        translate = this.selectedDotIndex * this.translateContainer;
        break;

      default:
    }

    if (translate > 0) {
      translate = 0;
      this.selectedItem = 0;
    }

    if (translate < -this.translateContainer - this.containerWidth) {
      translate = -this.translateContainer - this.containerWidth;
      this.selectedItem = this.itemsNb - this.visibleItemsNb;
    }

    if (this.visibleItemsNb > this.itemsNb) {
      translate = 0;
    }

    this.totTranslate = translate;
    return translate;
  }

  loopTranslateValue(direction: Direction) {
    let translate = this.totTranslate;

    switch (direction) {
      case "next":
        translate = this.totTranslate + this.translateContainer;
        break;

      case "prev":
        translate = this.totTranslate - this.translateContainer;
        break;

      case "click":
        translate = this.selectedDotIndex * this.translateContainer;
        break;

      default:
    }

    if (translate > -this.translateContainer) {
      translate -= this.containerWidth;
      this.selectedItem += this.itemsNb - this.visibleItemsNb;
    } else if (translate < -this.containerWidth) {
      translate += this.containerWidth;
    }

    this.totTranslate = translate;
    return translate;
  }

  showPrevItems() {
    if (this.animating) {
      return;
    }

    if (this.__loop && this.totTranslate >= 0) {
      // Change translation to prepare for animation
      this.totTranslate -= this.containerWidth;

      // We have do perform a direct change in the DOM
      // Otherwise, the totTranslate attribute change is aggregated with subsequent modifications
      // and this will trigger an animation.
      // eslint-disable-next-line dot-notation
      this.refs.list.style.transform = this.refs.list.style["msTransform"] =
        this.translateX;

      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.animating = true;
        this.selectedItem = this.getIndex(
          this.selectedItem - this.visibleItemsNb
        );
        this.animateList("prev");
      });
    } else {
      this.animating = true;
      this.selectedItem = this.getIndex(
        this.selectedItem - this.visibleItemsNb
      );
      this.animateList("prev");
    }
  }

  showNextItems() {
    if (this.animating) {
      return;
    }

    if (
      this.__loop &&
      this.totTranslate + this.translateContainer < -this.containerWidth
    ) {
      // Change translation to prepare for animation
      this.totTranslate += this.containerWidth;

      // We have do perform a direct change in the DOM
      // Otherwise, the totTranslate attribute change is aggregated with subsequent modifications
      // and this will trigger an animation.
      // eslint-disable-next-line dot-notation
      this.refs.list.style.transform = this.refs.list.style["msTransform"] =
        this.translateX;

      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.animating = true;
        this.selectedItem = this.getIndex(
          this.selectedItem + this.visibleItemsNb
        );
        this.animateList("next");
      });
    } else {
      this.animating = true;
      this.selectedItem = this.getIndex(
        this.selectedItem + this.visibleItemsNb
      );
      this.animateList("next");
    }
  }

  handleListTransitionEnd(event) {
    if (!this.animating) return;

    if (event.propertyName && event.propertyName !== "transform") {
      return;
    }

    this.animating = false;
  }

  animateList(direction) {
    const initTranslate = this.totTranslate;
    const realTranslate = this.refs.list.style.transform;

    if (!this.__loop) {
      this.noLoopTranslateValue(direction);
    } else {
      this.loopTranslateValue(direction);
    }

    if (!this.transitionSupported) {
      this.animating = false;
    }

    if (
      initTranslate === this.totTranslate ||
      realTranslate === this.translateX
    ) {
      this.animating = false;
    }

    this.emitCarouselActiveItemsEvent();
  }

  /* event management */

  handleKeydown(event: KeyboardEvent) {
    switch (event.key?.toLowerCase()) {
      case "arrowleft":
      case "home":
        this.showPrevItems();
        break;

      case "arrowright":
      case "end":
        this.showNextItems();
        break;

      case "enter":
        event.preventDefault();
        (event.target as HTMLElement).click();
        break;

      default:
    }
  }

  handleCarouselNavigationClick(event) {
    const dot = event.target.closest(
      `.${this.computedNavigationItemClassName}`
    );

    if (!dot || this.animating) {
      return;
    }

    const index = this.navDots.indexOf(dot);

    this.animating = true;
    this.selectedDotIndex = index;
    this.selectedItem = index * this.visibleItemsNb;
    this.animateList("click");
  }

  emitCarouselActiveItemsEvent() {
    this.emitCarouselEvents("carouselactiveitems", {
      firstSelectedItem: this.selectedItem,
      visibleItemsNb: this.visibleItemsNb
    });
  }

  emitCarouselEvents(eventName, eventDetail) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: eventDetail
      })
    );
  }

  handleDragStart(event) {
    if (
      event.detail?.origin?.closest("." + CONTROL_CLASSNAME) ||
      event.detail?.origin?.closest(
        "." + (this.navigationClassName || DEFAULT_NAVIGATION_CLASSNAME)
      ) ||
      !event.detail?.origin?.closest("." + WRAPPER_CLASSNAME)
    ) {
      return;
    }

    this.refs.carousel.classList.add(DRAGGING_CLASSNAME);
    this.dragStart = event.detail.x;
  }

  handleDragging(event) {
    if (
      !this.dragStart ||
      this.animating ||
      Math.abs(event.detail.x - (this.dragStart as number)) < 10
    ) {
      return;
    }

    let translate = event.detail.x - (this.dragStart as number) + this.totTranslate;

    const translateValue = `translateX(${
      translate + (this.__loop ? this.translateContainer : 0)
    }px)`;

    // eslint-disable-next-line dot-notation
    this.refs.list.style.transform = this.refs.list.style["msTransform"] =
      translateValue;
  }

  handleDragEnd(event) {
    if (!this.dragStart) {
      return;
    }

    this.refs.carousel.classList.remove(DRAGGING_CLASSNAME);

    if (event.detail.x - (this.dragStart as number) < -40) {
      this.showNextItems();
    } else if (event.detail.x - (this.dragStart as number) > 40) {
      this.showPrevItems();
    } else if (event.detail.x - (this.dragStart as number) === 0) {
      return;
    }

    this.dragStart = false;
  }

  /* lifecycle */
  /* --------- */

  _onWindowResize;
  _swipeContent;

  connectedCallback() {
    this.flexSupported = CSS.supports("align-items", "stretch");
    this.transitionSupported = CSS.supports("transition", "transform");
    this.cssPropertiesSupported = CSS.supports("color", "var(--color-var");

    if (!this._onWindowResize) {
      this._onWindowResize = new OnWindowResize();
      this._onWindowResize.bind(() => {
        this.itemAutoSize = null;
        this.itemsWidth = null;
        this._initialRender = true;
      });
    }
  }

  disconnectedCallback() {
    if (!this._onWindowResize) {
      this._onWindowResize.unbind();
    }
  }

  _initialRender = true;
  _itemMargin;

  renderedCallback() {
    if (this._initialRender) {
      this._initialRender = false;

      if (this._items?.length) {
        const itemStyle = window.getComputedStyle(this.liveFirstItem);
        const containerStyle = window.getComputedStyle(this.refs.wrapper);
        let itemWidth = parseFloat(itemStyle.getPropertyValue("width"));
        const itemMargin = (this._itemMargin = parseFloat(
          itemStyle.getPropertyValue("margin-right")
        ));
        const containerPadding = parseFloat(
          containerStyle.getPropertyValue("padding-left")
        );
        let containerWidth = parseFloat(
          containerStyle.getPropertyValue("width")
        );

        if (!this.itemAutoSize) {
          this.itemAutoSize = `${itemWidth}`;
        }

        if (!this.itemOriginalWidth) {
          this.itemOriginalWidth = itemWidth;
        } else {
          itemWidth = this.itemOriginalWidth as number;
        }

        if (this.itemAutoSize) {
          this.itemOriginalWidth = parseInt(this.itemAutoSize, 10);
          itemWidth = this.itemOriginalWidth;
        }

        if (containerWidth < itemWidth) {
          this.itemOriginalWidth = containerWidth;
          itemWidth = this.itemOriginalWidth;
        }

        this.visibleItemsNb = parseInt(`${
          (containerWidth - 2 * containerPadding + itemMargin) /
            (itemWidth + itemMargin)}`,
          10
        );
        this.itemsWidth = parseFloat(
          (
            (containerWidth - 2 * containerPadding + itemMargin) /
              this.visibleItemsNb -
            itemMargin
          ).toFixed(1)
        );
        this.containerWidth = (this.itemsWidth + itemMargin) * this.itemsNb;
        this.translateContainer =
          0 - (this.itemsWidth + itemMargin) * this.visibleItemsNb;
        this.totTranslate =
          0 - this.selectedItem * (this.itemsWidth + itemMargin);

        if (this.itemsNb <= this.visibleItemsNb) {
          this.totTranslate = 0;
        }

        /* Install drag behaviour on carousel */

        if (this._drag && window.requestAnimationFrame) {
          const element = this.refs.carousel;

          if (!this._swipeContent) {
            this._swipeContent = new SwipeContent(element);
          } else if (this._swipeContent.element !== element) {
            this._swipeContent.cancelDragging(); // removes event handlers
            this._swipeContent = new SwipeContent(element);
          }
        }
      }
    }

    if (!this.flexSupported && this._items) {
      this.refs.list.style.width = `${(this.itemsWidth + this._itemMargin) * this.visibleItemsNb * 3}px`;
    }
  }
}
