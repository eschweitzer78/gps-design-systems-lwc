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
const CLASS_NAME = "SfGpsDsCaOnAccordionGroupComm";

interface AccordionItem {
  id: string;
  label: string;
  content: string;
  isOpen: boolean;
}

export default class SfGpsDsCaOnAccordionGroupComm extends SfGpsDsLwc {
  /**
   * Enable Light DOM for LWR compatibility.
   */
  static renderMode = "light";

  // @ts-ignore
  @api
  name?: string;

  // @ts-ignore
  @api
  accordionData?: string;

  // @ts-ignore
  @api
  content?: string;

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

  get computedShowExpandCollapse(): boolean {
    return this.showExpandCollapse !== false;
  }

  get computedItems(): AccordionItem[] {
    return this._items;
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

  parseAccordionData(): void {
    // Try JSON format first
    if (this.accordionData) {
      try {
        const parsed = JSON.parse(this.accordionData);
        this._items = parsed.map(
          (
            item: { label: string; content: string; isOpen?: boolean },
            index: number
          ) => ({
            id: `accordion-${index}`,
            label: item.label,
            content: item.content,
            isOpen: item.isOpen || false
          })
        );
        return;
      } catch (e) {
        this.addError("AD-JS", "Invalid JSON for accordionData property");
      }
    }

    // Try Markdown format (split by H1 headers)
    if (this.content) {
      try {
        const items: AccordionItem[] = [];
        // Simple regex-based parsing: split by # at start of line
        const sections = this.content.split(/^#\s+/m).filter(Boolean);
        
        sections.forEach((section, index) => {
          const lines = section.split('\n');
          const label = lines[0]?.trim() || `Section ${index + 1}`;
          const contentLines = lines.slice(1).join('\n').trim();
          
          items.push({
            id: `accordion-${index}`,
            label: label,
            content: contentLines,
            isOpen: false
          });
        });

        this._items = items;
      } catch (e) {
        this.addError("CT-MD", "Issue when parsing Content markdown");
      }
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
    this.parseAccordionData();
  }
}
