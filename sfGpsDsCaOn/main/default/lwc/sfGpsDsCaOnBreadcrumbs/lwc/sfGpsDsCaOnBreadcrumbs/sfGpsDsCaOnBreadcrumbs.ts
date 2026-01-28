/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnBreadcrumbs";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default class SfGpsDsCaOnBreadcrumbs extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api
  items?: BreadcrumbItem[] | string;

  // @ts-ignore
  @api
  currentPage?: string;

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedItems(): Array<BreadcrumbItem & { id: string; isLast: boolean }> {
    let parsedItems: BreadcrumbItem[];
    
    if (!this.items) {
      parsedItems = [];
    } else if (typeof this.items === "string") {
      try {
        parsedItems = JSON.parse(this.items);
      } catch {
        parsedItems = [];
      }
    } else {
      parsedItems = this.items;
    }

    // Add the current page as the last item if provided
    if (this.currentPage) {
      parsedItems = [...parsedItems, { label: this.currentPage }];
    }

    return parsedItems.map((item, index) => ({
      ...item,
      id: `breadcrumb-${index}`,
      isLast: index === parsedItems.length - 1
    }));
  }

  get computedClassName(): string {
    let classes = "ontario-breadcrumbs";
    if (this.className) {
      classes += ` ${this.className}`;
    }
    return classes;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
