/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import type SfGpsDsAuNswAccordion from "c/sfGpsDsAuNswAccordion";
import type { 
  AccordionGroupItem 
} from "c/sfGpsDsAuNswAccordionGroupLwr";

/**
 * @slot Accordion1
 * @slot Accordion2
 * @slot Accordion3
 * @slot Accordion4
 * @slot Accordion5
 * @slot Accordion6
 * @slot Accordion7
 * @slot Accordion8
 * @slot Accordion9
 * @slot Accordion10
 * @slot Accordion11
 * @slot Accordion12
 */
export default 
class SfGpsDsAuNswAccordionGroupLwr
extends SfGpsDsLwc {
  // @ts-ignore
  @track 
  _items: AccordionGroupItem[] = [
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true },
    { title: "", closed: true }
  ];

  _numberOpen = this._items.filter((item) => !item.closed).length;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;

  // @ts-ignore
  @api 
  showButtons?: boolean;
  
  // @ts-ignore
  @api 
  className?: string;

  /* api: item1title */

  // @ts-ignore
  @api
  get item1title() {
    return this._items[0].title;
  }

  set item1title(value) {
    this._items[0].title = value;
  }

  get item1closed() {
    return this._items[0].closed;
  }

  /* api: item2title */

  // @ts-ignore
  @api
  get item2title() {
    return this._items[1].title;
  }

  set item2title(value) {
    this._items[1].title = value;
  }

  get item2closed() {
    return this._items[1].closed;
  }

  /* api: item3title */

  // @ts-ignore
  @api
  get item3title() {
    return this._items[2].title;
  }

  set item3title(value) {
    this._items[2].title = value;
  }

  get item3closed() {
    return this._items[2].closed;
  }

  /* api: item4title */

  // @ts-ignore
  @api
  get item4title() {
    return this._items[3].title;
  }

  set item4title(value) {
    this._items[3].title = value;
  }

  get item4closed() {
    return this._items[3].closed;
  }

  /* api: item5title */

  // @ts-ignore
  @api
  get item5title() {
    return this._items[4].title;
  }

  set item5title(value) {
    this._items[4].title = value;
  }

  get item5closed() {
    return this._items[4].closed;
  }

  /* api: item6title */

  // @ts-ignore
  @api
  get item6title() {
    return this._items[5].title;
  }

  set item6title(value) {
    this._items[5].title = value;
  }

  get item6closed() {
    return this._items[5].closed;
  }

  /* api: item7title */

  // @ts-ignore
  @api
  get item7title() {
    return this._items[6].title;
  }

  set item7title(value) {
    this._items[6].title = value;
  }

  get item7closed() {
    return this._items[6].closed;
  }

  /* api: item8title */

  // @ts-ignore
  @api
  get item8title() {
    return this._items[7].title;
  }

  set item8title(value) {
    this._items[7].title = value;
  }

  get item8closed() {
    return this._items[7].closed;
  }

  /* api: item9title */

  // @ts-ignore
  @api
  get item9title() {
    return this._items[8].title;
  }

  set item9title(value) {
    this._items[8].title = value;
  }

  get item9closed() {
    return this._items[8].closed;
  }

  /* api: item10title */

  // @ts-ignore
  @api
  get item10title() {
    return this._items[9].title;
  }

  set item10title(value) {
    this._items[9].title = value;
  }

  get item10closed() {
    return this._items[9].closed;
  }

  /* api: item11title */

  // @ts-ignore
  @api
  get item11title() {
    return this._items[10].title;
  }

  set item11title(value) {
    this._items[10].title = value;
  }

  get item11closed() {
    return this._items[10].closed;
  }

  /* api: item12title */

  // @ts-ignore
  @api
  get item12title() {
    return this._items[11].title;
  }

  set item12title(value) {
    this._items[11].title = value;
  }

  get item12closed() {
    return this._items[11].closed;
  }

  /* computed */

  get computedIsFullyExpanded(): boolean {
    return !this._items.some((item) => item.closed);
  }

  get computedIsFullyCollapsed(): boolean {
    return this._numberOpen === 0;
  }

  get computedClassName(): any {
    return {
      "nsw-accordion": true,
      ready: true,
      [this.className || ""]: !!this.className
    };
  }

  /* event management */

  handleExpand(event: CustomEvent): void {
    const target = event.target as unknown as SfGpsDsAuNswAccordion;
    this._items[+ target.index].closed = false;
    this._numberOpen++;
  }

  handleCollapse(event: CustomEvent): void {
    const target = event.target as unknown as SfGpsDsAuNswAccordion;
    this._items[+ target.index].closed = true;
    this._numberOpen--;
  }

  handleExpandAll(): void {
    this._numberOpen = this._items.length;
    this._items.forEach((item) => (item.closed = false));
  }

  handleCollapseAll(): void {
    this._numberOpen = 0;
    this._items.forEach((item) => (item.closed = true));
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }
  
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
