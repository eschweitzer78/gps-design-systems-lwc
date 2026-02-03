/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnAccordionOmni";

/**
 * Ontario Design System Accordion for OmniStudio Custom LWC
 * Shadow DOM version for OmniStudio compatibility
 *
 * Usage in OmniScript:
 * - LWC Component Name: sfGpsDsCaOnAccordionOmni
 * - Custom Attributes:
 *   - title: Main accordion title (for single accordion mode)
 *   - isOpen: Whether accordion starts open (default false)
 *   - itemsJson: JSON array of {title, content} objects for multiple accordion items
 */
export default class SfGpsDsCaOnAccordionOmni extends LightningElement {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api title = "";
  @api className = "";

  /* ========================================
   * PRIVATE STATE
   * ======================================== */

  @track _items = [];
  @track _openIndexes = new Set();
  @track _isOpen = false;

  /* ========================================
   * PUBLIC API - isOpen with getter/setter
   * ======================================== */

  @api
  get isOpen() {
    return this._isOpen;
  }
  set isOpen(value) {
    this._isOpen = value;
  }

  _accordionId = `accordion-${Math.random().toString(36).substring(2, 11)}`;

  /* ========================================
   * PUBLIC API
   * ======================================== */

  @api
  get itemsJson() {
    return JSON.stringify(this._items);
  }
  set itemsJson(val) {
    try {
      if (typeof val === "string" && val.trim()) {
        this._items = JSON.parse(val);
      } else if (Array.isArray(val)) {
        this._items = val;
      } else {
        this._items = [];
      }
      // Initialize open state for each item
      this._items = this._items.map((item, index) => ({
        ...item,
        _index: index,
        _id: `${this._accordionId}-item-${index}`,
        _buttonId: `${this._accordionId}-button-${index}`,
        _contentId: `${this._accordionId}-content-${index}`,
        _isOpen: item.isOpen || false
      }));
    } catch (e) {
      if (DEBUG) console.error(CLASS_NAME, "Error parsing itemsJson:", e);
      this._items = [];
    }
  }

  @api
  expandAll() {
    this._items = this._items.map((item) => ({ ...item, _isOpen: true }));
  }

  @api
  collapseAll() {
    this._items = this._items.map((item) => ({ ...item, _isOpen: false }));
  }

  @api
  toggleItem(index) {
    if (index >= 0 && index < this._items.length) {
      this._items = this._items.map((item, i) => {
        return i === index ? { ...item, _isOpen: !item._isOpen } : item;
      });
    }
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get hasItems() {
    return this._items && this._items.length > 0;
  }

  get hasSingleItem() {
    return !!this.title && !this.hasItems;
  }

  get computedContainerClassName() {
    return `ontario-accordions__container ${this.className || ""}`.trim();
  }

  get computedSingleClassName() {
    return `ontario-accordion ${this.isOpen ? "open" : ""}`.trim();
  }

  get computedSingleHeadingClassName() {
    return `ontario-accordion__heading ${this.isOpen ? "ontario-expander--active" : ""}`;
  }

  get computedSingleContentClassName() {
    return `ontario-accordion__content ${this.isOpen ? "ontario-accordion__content--opened" : "ontario-accordion__content--closed"}`;
  }

  get computedAriaExpanded() {
    return this.isOpen ? "true" : "false";
  }

  get computedAriaHidden() {
    return this.isOpen ? "false" : "true";
  }

  get singleButtonId() {
    return `${this._accordionId}-button`;
  }

  get singleContentId() {
    return `${this._accordionId}-content`;
  }

  get decoratedItems() {
    return this._items.map((item) => ({
      ...item,
      computedClassName:
        `ontario-accordion ${item._isOpen ? "open" : ""}`.trim(),
      computedHeadingClassName: `ontario-accordion__heading ${item._isOpen ? "ontario-expander--active" : ""}`,
      computedContentClassName: `ontario-accordion__content ${item._isOpen ? "ontario-accordion__content--opened" : "ontario-accordion__content--closed"}`,
      computedAriaExpanded: item._isOpen ? "true" : "false",
      computedAriaHidden: item._isOpen ? "false" : "true"
    }));
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleSingleToggle() {
    this._isOpen = !this._isOpen;

    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: {
          isOpen: this._isOpen,
          title: this.title
        },
        bubbles: true,
        composed: true
      })
    );

    if (DEBUG)
      console.log(CLASS_NAME, "Single accordion toggled:", this._isOpen);
  }

  handleItemToggle(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10);

    if (index >= 0 && index < this._items.length) {
      this._items = this._items.map((item, i) => {
        return i === index ? { ...item, _isOpen: !item._isOpen } : item;
      });

      const toggledItem = this._items[index];

      this.dispatchEvent(
        new CustomEvent("toggle", {
          detail: {
            index,
            isOpen: toggledItem._isOpen,
            title: toggledItem.title
          },
          bubbles: true,
          composed: true
        })
      );

      if (DEBUG)
        console.log(CLASS_NAME, "Item toggled:", index, toggledItem._isOpen);
    }
  }

  handleExpandAll() {
    this.expandAll();

    this.dispatchEvent(
      new CustomEvent("expandall", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleCollapseAll() {
    this.collapseAll();

    this.dispatchEvent(
      new CustomEvent("collapseall", {
        bubbles: true,
        composed: true
      })
    );
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  get allExpanded() {
    return this._items.length > 0 && this._items.every((item) => item._isOpen);
  }

  get showExpandAll() {
    return !this.allExpanded;
  }

  get showCollapseAll() {
    return this.allExpanded;
  }
}
