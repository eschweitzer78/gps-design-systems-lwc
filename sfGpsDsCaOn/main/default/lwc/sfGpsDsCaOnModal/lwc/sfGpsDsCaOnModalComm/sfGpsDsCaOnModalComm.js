/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement } from "lwc";

/**
 * @slot ModalComm
 * @description Ontario Design System Modal for Experience Builder.
 * Wrapper component that exposes the modal for use in Experience Cloud sites.
 *
 * ## Usage in Experience Builder
 * This component can be used to display modal dialogs triggered by buttons
 * or other interactive elements. Use the `open()` and `close()` methods
 * to control the modal programmatically.
 *
 * ## Slots
 * - `trigger`: Element that triggers the modal (e.g., a button)
 * - `content`: Modal body content
 * - `footer`: Modal footer content (typically action buttons)
 */
export default class SfGpsDsCaOnModalComm extends LightningElement {
  static renderMode = "light";

  /* ========================================
   * PUBLIC PROPERTIES (Experience Builder)
   * ======================================== */

  /**
   * Modal title displayed in header
   * @type {string}
   */
  @api title = "Modal";

  /**
   * Modal size variant
   * @type {string}
   */
  @api size = "medium";

  /**
   * Whether to hide the close button
   * @type {boolean}
   */
  @api hideCloseButton = false;

  /**
   * Whether to hide the header
   * @type {boolean}
   */
  @api hideHeader = false;

  /**
   * Whether to hide the footer
   * @type {boolean}
   */
  @api hideFooter = false;

  /**
   * Custom CSS class
   * @type {string}
   */
  @api className;

  /**
   * Accessible label for the modal
   * @type {string}
   */
  @api ariaLabel;

  /* ========================================
   * PRIVATE PROPERTIES
   * ======================================== */

  /**
   * Whether the modal is currently open
   * @type {boolean}
   */
  _isOpen = false;

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * Returns the modal open state
   * @returns {boolean}
   */
  get isOpen() {
    return this._isOpen;
  }

  /* ========================================
   * PUBLIC METHODS
   * ======================================== */

  /**
   * Opens the modal
   * @public
   */
  @api
  open() {
    this._isOpen = true;
  }

  /**
   * Closes the modal
   * @public
   */
  @api
  close() {
    this._isOpen = false;
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handles trigger click to open modal
   * @param {Event} event
   */
  handleTriggerClick(event) {
    event.preventDefault();
    this.open();
  }

  /**
   * Handles trigger keyboard event (Enter/Space) to open modal
   * WCAG 2.1.1: Keyboard accessible - matches click behavior
   * @param {KeyboardEvent} event
   */
  handleTriggerKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.open();
    }
  }

  /**
   * Handles modal close event
   */
  handleModalClose() {
    this._isOpen = false;
    this.dispatchEvent(new CustomEvent("modalclose", { bubbles: false }));
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Component connected to DOM
   */
  connectedCallback() {
    this.classList.add("caon-scope");
  }
}
