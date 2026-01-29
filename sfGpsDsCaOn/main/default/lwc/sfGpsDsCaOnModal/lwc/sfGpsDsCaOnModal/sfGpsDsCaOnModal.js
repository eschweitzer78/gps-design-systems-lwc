/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

/**
 * @slot Modal
 * @description Ontario Design System Modal/Dialog component.
 * Provides a modal overlay with Ontario DS styling, accessibility features,
 * and focus management.
 *
 * ## Features
 * - Ontario DS dark header styling
 * - Configurable sizes (small, medium, large, full)
 * - Focus trapping for accessibility
 * - Keyboard navigation (Escape to close)
 * - ARIA attributes for screen readers
 * - Customizable header, content, and footer via slots
 *
 * ## Usage
 * ```html
 * <c-sf-gps-ds-ca-on-modal
 *   title="Site"
 *   size="large"
 *   is-open={isModalOpen}
 *   onclose={handleModalClose}
 * >
 *   <div slot="content">Modal content here</div>
 *   <div slot="footer">
 *     <button>Save</button>
 *   </div>
 * </c-sf-gps-ds-ca-on-modal>
 * ```
 *
 * ## Compliance
 * - **LWR**: Uses Light DOM for Experience Cloud compatibility
 * - **LWS**: No eval(), no document/window globals, component-scoped focus management
 * - **Ontario DS**: Follows Ontario Design System patterns
 * - **WCAG 2.1 AA**: Focus trapping, ARIA labels, keyboard navigation
 *
 * ## LWS Notes
 * - Focus trapping uses component-scoped element tracking (not document.activeElement)
 * - Body scroll lock uses CSS class on host element (not document.body)
 * - Dispatches 'modalopen'/'modalclose' events for parent scroll management
 */
export default class SfGpsDsCaOnModal extends LightningElement {
  static renderMode = "light";

  /* ========================================
   * PUBLIC PROPERTIES
   * ======================================== */

  /**
   * Modal title displayed in header
   * @type {string}
   */
  @api title = "";

  /**
   * Modal size variant
   * @type {'small'|'medium'|'large'|'full'}
   */
  @api size = "medium";

  /**
   * Whether the modal is currently open
   * @type {boolean}
   */
  @api
  get isOpen() {
    return this._isOpen;
  }
  set isOpen(val) {
    const wasOpen = this._isOpen;
    this._isOpen = Boolean(val);

    if (this._isOpen && !wasOpen) {
      this.handleOpen();
    } else if (!this._isOpen && wasOpen) {
      this.handleCloseInternal();
    }
  }
  @track _isOpen = false;

  /**
   * Whether to hide the close button
   * @type {boolean}
   */
  @api
  get hideCloseButton() {
    return this._hideCloseButton;
  }
  set hideCloseButton(val) {
    this._hideCloseButton = Boolean(val);
  }
  _hideCloseButton = false;

  /**
   * Whether to hide the header section
   * @type {boolean}
   */
  @api
  get hideHeader() {
    return this._hideHeader;
  }
  set hideHeader(val) {
    this._hideHeader = Boolean(val);
  }
  _hideHeader = false;

  /**
   * Whether to hide the footer section
   * @type {boolean}
   */
  @api
  get hideFooter() {
    return this._hideFooter;
  }
  set hideFooter(val) {
    this._hideFooter = Boolean(val);
  }
  _hideFooter = false;

  /**
   * Custom CSS class for the modal container
   * @type {string}
   */
  @api className;

  /**
   * Accessible label for the modal dialog
   * @type {string}
   */
  @api ariaLabel;

  /* ========================================
   * PRIVATE PROPERTIES
   * ======================================== */

  /**
   * Reference to the element that had focus before modal opened
   * Used for focus restoration when modal closes
   * @type {Element}
   * @private
   */
  _previousActiveElement = null;

  /**
   * Currently focused element index within the modal
   * Used for LWS-compatible focus trapping (avoids document.activeElement)
   * @type {number}
   * @private
   */
  _currentFocusIndex = 0;

  /**
   * Bound keydown handler for cleanup
   * @type {Function}
   * @private
   */
  _keydownHandler = null;

  /**
   * Unique identifier for this modal instance
   * @type {string}
   * @private
   */
  _uniqueId = `modal-${Math.random().toString(36).substring(2, 11)}`;

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * Whether to show the close button
   * @returns {boolean}
   */
  get showCloseButton() {
    return !this._hideCloseButton;
  }

  /**
   * Whether to show the header section
   * @returns {boolean}
   */
  get showHeader() {
    return !this._hideHeader;
  }

  /**
   * Whether to show the footer section
   * @returns {boolean}
   */
  get showFooter() {
    return !this._hideFooter;
  }

  /**
   * Computed CSS class for the modal backdrop
   * @returns {string}
   */
  get computedBackdropClassName() {
    return computeClass({
      "sfgpsdscaon-modal__backdrop": true,
      "sfgpsdscaon-modal__backdrop--open": this._isOpen
    });
  }

  /**
   * Computed CSS class for the modal container
   * @returns {string}
   */
  get computedModalClassName() {
    return computeClass({
      "sfgpsdscaon-modal": true,
      "sfgpsdscaon-modal--open": this._isOpen,
      [`sfgpsdscaon-modal--${this.size}`]: true,
      [this.className]: this.className
    });
  }

  /**
   * Computed CSS class for the modal dialog
   * @returns {string}
   */
  get computedDialogClassName() {
    return computeClass({
      "sfgpsdscaon-modal__dialog": true
    });
  }

  /**
   * Unique ID for the modal title element
   * @returns {string}
   */
  get titleId() {
    return `${this._uniqueId}-title`;
  }

  /**
   * Unique ID for the modal description/content element
   * @returns {string}
   */
  get descriptionId() {
    return `${this._uniqueId}-desc`;
  }

  /**
   * Accessible label for the close button
   * @returns {string}
   */
  get closeButtonAriaLabel() {
    return this.title ? `Close ${this.title}` : "Close modal";
  }

  /* ========================================
   * PUBLIC METHODS
   * ======================================== */

  /**
   * Opens the modal programmatically
   * @public
   */
  @api
  open() {
    this._isOpen = true;
    this.handleOpen();
  }

  /**
   * Closes the modal programmatically
   * @public
   */
  @api
  close() {
    this._isOpen = false;
    this.handleCloseInternal();
    this.dispatchCloseEvent();
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  /**
   * Handles modal opening - saves focus, locks body scroll
   * LWS-compatible: Uses component-scoped focus tracking and CSS classes
   * @private
   */
  handleOpen() {
    // LWS: Track which element within our scope triggered the modal
    // We'll save the element if it's within our component, otherwise null
    try {
      // Try to find focused element within component scope
      const focusableInScope = this.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      for (let i = 0; i < focusableInScope.length; i++) {
        if (
          focusableInScope[i] ===
          focusableInScope[i].ownerDocument?.activeElement
        ) {
          this._previousActiveElement = focusableInScope[i];
          break;
        }
      }
    } catch {
      // LWS may restrict activeElement - proceed without saving
      this._previousActiveElement = null;
    }

    // LWS: Add class to host element for CSS-based scroll prevention
    // Parent components can listen for 'modalopen' event to lock body scroll
    this.classList.add("sfgpsdscaon-modal-is-open");

    // Dispatch event for parent page scroll management
    // LWS: Cannot access document.body, so parent must handle scroll lock
    this.dispatchEvent(
      new CustomEvent("modalopen", {
        bubbles: true,
        composed: true,
        detail: { modalId: this._uniqueId }
      })
    );

    // Focus the close button or dialog after render
    // Use setTimeout to ensure DOM is updated
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      const closeBtn = this.querySelector(".sfgpsdscaon-modal__close-btn");
      if (closeBtn) {
        closeBtn.focus();
        this._currentFocusIndex = 0;
      } else {
        const dialog = this.querySelector('[role="dialog"]');
        if (dialog) {
          dialog.focus();
        }
      }
    }, 0);
  }

  /**
   * Handles modal closing - restores focus and body scroll
   * LWS-compatible: Uses component classes and events instead of document.body
   * @private
   */
  handleCloseInternal() {
    // LWS: Remove class from host element
    this.classList.remove("sfgpsdscaon-modal-is-open");

    // Dispatch event for parent page scroll management
    // LWS: Cannot access document.body, so parent must handle scroll unlock
    this.dispatchEvent(
      new CustomEvent("modalclose", {
        bubbles: true,
        composed: true,
        detail: { modalId: this._uniqueId }
      })
    );

    // Restore focus to previous element if available
    if (this._previousActiveElement) {
      try {
        this._previousActiveElement.focus();
      } catch {
        // Element may no longer be focusable - fail silently
      }
      this._previousActiveElement = null;
    }

    // Reset focus tracking
    this._currentFocusIndex = 0;
  }

  /**
   * Dispatches the close event
   * @private
   */
  dispatchCloseEvent() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: false }));
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handles close button click
   * @param {Event} event
   */
  handleCloseClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }

  /**
   * Handles backdrop click (close on outside click)
   * @param {Event} event
   */
  handleBackdropClick(event) {
    // Only close if clicking directly on backdrop, not on modal content
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Handles keyboard navigation
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    if (event.key === "Escape" || event.key === "Esc") {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }

    // Handle Tab for focus trapping
    if (event.key === "Tab") {
      this.handleTabKey(event);
    }
  }

  /**
   * Handles Tab key for focus trapping within modal
   * LWS-compatible: Uses event.target instead of document.activeElement
   * @param {KeyboardEvent} event
   * @private
   */
  handleTabKey(event) {
    const focusableElements = this.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // LWS: Use event.target instead of document.activeElement
    // event.target is the element that currently has focus and received the keydown
    const currentElement = event.target;

    if (event.shiftKey) {
      // Shift + Tab: wrap to last element
      if (currentElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        this._currentFocusIndex = focusableElements.length - 1;
      }
    } else {
      // Tab: wrap to first element
      if (currentElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        this._currentFocusIndex = 0;
      }
    }
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Component connected to DOM
   * LWS-compatible: Uses component-scoped event handling
   */
  connectedCallback() {
    this.classList.add("caon-scope");

    // LWS: Add keydown listener to component host instead of document
    // The modal dialog has tabindex="-1" to receive keyboard events
    this._keydownHandler = this.handleKeyDown.bind(this);
    this.addEventListener("keydown", this._keydownHandler);
  }

  /**
   * Component disconnected from DOM
   * LWS-compatible: Clean up component-scoped listeners
   */
  disconnectedCallback() {
    // Remove component keydown listener
    if (this._keydownHandler) {
      this.removeEventListener("keydown", this._keydownHandler);
    }

    // Ensure modal state is cleaned up
    if (this._isOpen) {
      this.classList.remove("sfgpsdscaon-modal-is-open");

      // Dispatch close event so parent can restore scroll
      this.dispatchEvent(
        new CustomEvent("modalclose", {
          bubbles: true,
          composed: true,
          detail: { modalId: this._uniqueId }
        })
      );
    }
  }
}
