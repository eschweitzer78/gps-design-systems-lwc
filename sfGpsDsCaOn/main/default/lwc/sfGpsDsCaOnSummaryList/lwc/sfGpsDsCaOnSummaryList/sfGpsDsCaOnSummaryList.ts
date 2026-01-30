/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnSummaryList";

export type SummaryListRatio = "1-1" | "1-2" | "1-3" | "2-1" | "2-3";

export interface SummaryListItem {
  key: string;
  value: string;
  changeUrl?: string;
  changeLabel?: string;
  /** Custom ARIA label for the change button (improves screen reader experience) */
  ariaLabel?: string;
}

export default class SfGpsDsCaOnSummaryList extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  heading?: string;

  // @ts-ignore
  @api
  headingActionLabel?: string;

  // @ts-ignore
  @api
  headingActionUrl?: string;

  // @ts-ignore
  @api
  items?: SummaryListItem[] | string;

  // @ts-ignore
  @api
  ratio?: SummaryListRatio;

  // @ts-ignore
  @api
  fullWidth?: boolean;
  _fullWidth = this.defineBooleanProperty("fullWidth", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  compact?: boolean;
  _compact = this.defineBooleanProperty("compact", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedItems(): Array<SummaryListItem & { id: string; hasAction: boolean; computedAriaLabel: string }> {
    if (!this.items) return [];

    let parsedItems: SummaryListItem[];
    if (typeof this.items === "string") {
      try {
        parsedItems = JSON.parse(this.items);
      } catch {
        return [];
      }
    } else {
      parsedItems = this.items;
    }

    return parsedItems.map((item, index) => ({
      ...item,
      id: `summary-item-${index}`,
      hasAction: Boolean(item.changeUrl),
      // AODA: Generate descriptive ARIA label if not provided
      computedAriaLabel: item.ariaLabel || `${item.changeLabel || 'Change'} your answer for ${item.key}`
    }));
  }

  get hasHeadingAction(): boolean {
    return Boolean(this.headingActionUrl);
  }

  get computedClassName(): string {
    const classes = ["ontario-summary-list"];
    if (this._fullWidth.value) {
      classes.push("summary-list-full-width");
    }
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  get computedContainerClassName(): string {
    const classes = ["ontario-summary-list__container"];
    if (this.ratio && this.ratio !== "1-1") {
      classes.push(`ontario-summary-list-ratio__${this.ratio}`);
    }
    return classes.join(" ");
  }

  get computedRowClassName(): string {
    const classes = ["ontario-summary-list__row"];
    if (this._compact.value) {
      classes.push("compact");
    }
    return classes.join(" ");
  }

  /* event handlers */

  /**
   * Handle heading action click - dispatch event for parent to handle
   * @param event - Click event
   */
  handleHeadingActionClick(event: Event): void {
    // Dispatch change event with heading action URL
    const changeEvent = new CustomEvent("change", {
      bubbles: true,
      composed: true,
      detail: {
        type: "heading",
        changeUrl: this.headingActionUrl,
        heading: this.heading
      }
    });
    this.dispatchEvent(changeEvent);

    // If the event was prevented, stop the default navigation
    if (changeEvent.defaultPrevented) {
      event.preventDefault();
    }
  }

  /**
   * Handle item action click - dispatch event for parent to handle
   * @param event - Click event
   */
  handleItemActionClick(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const changeUrl = target.getAttribute("data-change-url");
    const itemKey = target.getAttribute("data-item-key");

    // Dispatch change event with item details
    const changeEvent = new CustomEvent("change", {
      bubbles: true,
      composed: true,
      detail: {
        type: "item",
        changeUrl: changeUrl,
        itemKey: itemKey
      }
    });
    this.dispatchEvent(changeEvent);

    // If the event was prevented, stop the default navigation
    if (changeEvent.defaultPrevented) {
      event.preventDefault();
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
