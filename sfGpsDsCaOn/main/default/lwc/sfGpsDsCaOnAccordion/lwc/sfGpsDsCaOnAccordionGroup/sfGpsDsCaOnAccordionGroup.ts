/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnAccordionGroup";

export interface AccordionItem {
  id: string;
  label: string;
  content: string;
  contentType?: "string" | "html";
  isOpen?: boolean;
  ariaLabelText?: string;
}

export default class SfGpsDsCaOnAccordionGroup extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  name?: string;

  // @ts-ignore
  @api
  showExpandCollapse?: boolean;

  // @ts-ignore
  @api
  expandLabel?: string = "Expand all";

  // @ts-ignore
  @api
  collapseLabel?: string = "Collapse all";

  // @ts-ignore
  @api
  className?: string;

  _items: AccordionItem[] = [];

  // @ts-ignore
  @api
  get items(): AccordionItem[] {
    return this._items;
  }

  set items(value: AccordionItem[] | string) {
    if (typeof value === "string") {
      try {
        this._items = JSON.parse(value);
      } catch (e) {
        this.addError("IT-JS", "Invalid JSON for items property");
        this._items = [];
      }
    } else {
      this._items = value || [];
    }
  }

  get computedShowExpandCollapse(): boolean {
    return this.showExpandCollapse !== false;
  }

  get allExpanded(): boolean {
    return this._items.length > 0 && this._items.every((item) => item.isOpen);
  }

  get expandCollapseLabel(): string {
    return this.allExpanded ? this.collapseLabel : this.expandLabel;
  }

  get ariaExpandedAll(): string {
    return this.allExpanded ? "true" : "false";
  }

  get ariaLabelExpandCollapseAll(): string {
    return this.allExpanded 
      ? "Collapse all accordion sections" 
      : "Expand all accordion sections";
  }

  handleToggle(event: CustomEvent): void {
    const accordionId = event.detail.accordionId;
    this._items = this._items.map((item) => {
      if (item.id === accordionId) {
        return { ...item, isOpen: !item.isOpen };
      }
      return item;
    });
  }

  handleExpandCollapseAll(): void {
    const newState = !this.allExpanded;
    this._items = this._items.map((item) => ({
      ...item,
      isOpen: newState
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
