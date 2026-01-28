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
const CLASS_NAME = "SfGpsDsCaOnInPageNav";

export interface InPageNavItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export default class SfGpsDsCaOnInPageNav extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api
  heading?: string;

  // @ts-ignore
  @api
  items?: InPageNavItem[] | string;

  // @ts-ignore
  @api
  showTopBorder?: boolean;
  _showTopBorder = this.defineBooleanProperty("showTopBorder", {
    defaultValue: true
  });

  // @ts-ignore
  @api
  skipLinkId?: string;

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedHeading(): string {
    return this.heading || "On this page";
  }

  get computedItems(): Array<InPageNavItem & { id: string; ariaCurrent: string | null }> {
    if (!this.items) return [];
    
    let parsedItems: InPageNavItem[];
    if (typeof this.items === "string") {
      try {
        parsedItems = JSON.parse(this.items);
      } catch {
        return [];
      }
    } else {
      parsedItems = this.items;
    }

    // AODA: Use "page" for aria-current instead of "true" for better semantics
    return parsedItems.map((item, index) => ({
      ...item,
      id: `nav-item-${index}`,
      ariaCurrent: item.isCurrent ? "page" : null
    }));
  }

  get computedClassName(): string {
    let classes = "ontario-page-navigation";
    if (!this._showTopBorder.value) {
      classes += " ontario-page-navigation--no-top-border";
    }
    if (this.className) {
      classes += ` ${this.className}`;
    }
    return classes;
  }

  get computedSkipLinkHref(): string {
    return this.skipLinkId ? `#${this.skipLinkId}` : "#skip-to-main";
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
