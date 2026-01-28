/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptEditBlock from "c/sfGpsDsOsrtOmniscriptEditBlock";

import tmpl_table from "./omniscriptEditBlock.html";
import tmpl_inline from "./omniscriptEditBlockInline.html";
import tmpl_card from "./omniscriptEditBlockCards.html";
import tmpl_fs from "./omniscriptEditBlockFS.html";

/**
 * Debug flag - set to true to enable console logging.
 * Useful for tracking render decisions and event handling.
 * @type {boolean}
 */
const DEBUG = false;

/**
 * Class name for debug logging.
 * @type {string}
 */
const CLASS_NAME = "SfGpsDsCaOnFormEditBlock";

/**
 * @slot EditBlock
 * @description Ontario Design System EditBlock for OmniStudio forms.
 * 
 * EditBlock is a complex component that provides repeatable/editable data sections.
 * It supports multiple display modes (Table, Inline, Cards, FullScreen) and handles
 * CRUD operations on repeating data.
 * 
 * ## Display Modes
 * - **Table**: Rows displayed in a table format (default)
 * - **Inline**: Each entry displayed inline
 * - **Cards**: Each entry displayed as a card
 * - **LongCards**: Wide card format
 * - **FS (FullScreen)**: Full-screen editing modal
 * 
 * ## Key Inherited Properties (from OmniscriptEditBlock)
 * - `_isTable` {boolean} - True if Table mode
 * - `_isCards` {boolean} - True if Cards mode
 * - `_isLongCards` {boolean} - True if LongCards mode
 * - `_isInline` {boolean} - True if Inline mode
 * - `_isFS` {boolean} - True if FullScreen mode
 * - `_isEditing` {boolean} - True if currently editing an entry
 * - `_hasChildren` {boolean} - True if has child elements to display
 * - `_actionMenuList` {Array} - List of actions (Edit, Delete, etc.)
 * - `_showCheckbox` {boolean} - True if checkbox is checked
 * - `_bShowActionMenu` {boolean} - True if action menu is visible
 * 
 * ## Templates
 * - `omniscriptEditBlock.html` - Table mode
 * - `omniscriptEditBlockInline.html` - Inline mode
 * - `omniscriptEditBlockCards.html` - Cards mode
 * - `omniscriptEditBlockFS.html` - FullScreen mode
 * 
 * ## Compliance
 * - **LWR**: Uses Light DOM parent component
 * - **LWS**: No eval(), proper namespace imports
 * - **Ontario DS**: Uses Ontario button, card, and table styling
 * - **WCAG 2.1 AA**: Proper ARIA attributes, keyboard navigation for actions
 * 
 * @example
 * // Configured in OmniScript as "Edit Block" element type
 * // Properties set in OmniScript Designer:
 * // - mode: Table, Inline, Cards, LongCards, or FS
 * // - allowNew: true/false
 * // - allowEdit: true/false
 * // - allowDelete: true/false
 * 
 * @see {@link sfGpsDsCaOnFormEditBlockLabel} Heading component
 * @see {@link sfGpsDsCaOnFormEditBlockNew} Add new button component
 */
export default class SfGpsDsCaOnFormEditBlock extends OmniscriptEditBlock {
  /* ========================================
   * COMPUTED PROPERTIES - CSS CLASSES
   * Used for Ontario DS styling in templates
   * ======================================== */

  /**
   * Computes CSS classes for the action dropdown menu.
   * Controls visibility state of the menu.
   * 
   * @returns {Object} CSS class object for computeClass helper
   * @template-binding: Used with dropdown menu element
   */
  get computedDropdownClassName() {
    return {
      "sfgpsds-dropdown": true,
      "sfgpsds-dropdown__active": this._bShowActionMenu
    };
  }

  /**
   * Transforms action menu items into a format suitable for rendering.
   * Adds key and index properties for list rendering.
   * 
   * @returns {Array<{key: string, index: number, text: string}>} Decorated action items
   * @template-binding: Used in action menu iteration (for:each)
   */
  get decoratedActionMenuItems() {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "decoratedActionMenuItems",
        JSON.stringify(this._actionMenuList)
      );

    return this._actionMenuList.map((item, index) => ({
      key: item.lwcId,
      index,
      text: item.label
    }));
  }

  /**
   * Determines if heading should use H3 tag.
   * Based on headingLevel property, defaults to 3.
   * 
   * @returns {boolean} True if heading level is 3
   * @template-binding: <h3 lwc:if={computedIsH3Heading}>
   */
  get computedIsH3Heading() {
    return (this._propSetMap.headingLevel || 3) === 3;
  }

  /**
   * Returns error text ID for aria-describedby when invalid.
   * 
   * @returns {string|null} Error element ID or null if valid
   * @template-binding: aria-describedby={computedErrorTextId}
   */
  get computedErrorTextId() {
    return this.isInvalid ? "inline-text-error" : null;
  }

  /* ========================================
   * COMPUTED PROPERTIES - ACCESSIBILITY
   * ARIA attributes for screen readers
   * ======================================== */

  /**
   * Returns ARIA role for selectable items.
   * Only applies when selectCheckBox mode is enabled.
   * 
   * @returns {string|null} "checkbox" or null
   * @template-binding: role={computedAriaRole}
   */
  get computedAriaRole() {
    return this._propSetMap.selectCheckBox ? "checkbox" : null;
  }

  /**
   * Returns ARIA checked state for selectable items.
   * 
   * @returns {string|null} "true", "false", or null
   * @template-binding: aria-checked={computedAriaChecked}
   */
  get computedAriaChecked() {
    if (this._propSetMap.selectCheckBox) {
      return this._showCheckbox ? "true" : "false";
    }
    return null;
  }

  /**
   * Returns tabindex for keyboard navigation of selectable items.
   * 
   * @returns {string|null} "0" for focusable or null
   * @template-binding: tabindex={computedTabindex}
   */
  get computedTabindex() {
    return this._propSetMap.selectCheckBox ? "0" : null;
  }

  /* ========================================
   * COMPUTED PROPERTIES - DISPLAY STATE
   * Control visibility and styling based on mode/state
   * ======================================== */

  /**
   * Computes CSS classes for card container.
   * Adds selected styling when checkbox is checked.
   * 
   * @returns {string} Space-separated CSS classes
   * @template-binding: class={computedCardClassName} (Cards mode)
   */
  get computedCardClassName() {
    let classes = "ontario-card sfgpsdscaon-edit-block__card";
    if (this._showCheckbox) {
      classes += " sfgpsdscaon-edit-block__card--selected";
    }
    return classes;
  }

  /**
   * Computes CSS classes for table row.
   * Adds selected styling when checkbox is checked.
   * 
   * @returns {string} Space-separated CSS classes
   * @template-binding: class={computedTableRowClassName} (Table mode)
   */
  get computedTableRowClassName() {
    let classes = "sfgpsdscaon-edit-block__row";
    if (this._showCheckbox) {
      classes += " sfgpsdscaon-edit-block__row--selected";
    }
    return classes;
  }

  /**
   * Computes CSS classes for visual (non-editing) content area.
   * Hidden when editing or when no children exist.
   * 
   * @returns {Object} CSS class object for computeClass helper
   * @template-binding: class={visualClassName}
   */
  get visualClassName() {
    return {
      "ontario-col": true,
      "ontario-hide": this._isEditing || !this._hasChildren,
      "ontario-col-sm-12": this._isLongCards || this._isCards
    };
  }

  /**
   * Computes CSS classes for editing content area.
   * Only visible when in editing mode.
   * 
   * @returns {Object} CSS class object for computeClass helper
   * @template-binding: class={editClassName}
   */
  get editClassName() {
    return {
      "ontario-col": true,
      "ontario-hide": !this._isEditing
    };
  }

  /* ========================================
   * EVENT HANDLERS
   * Handle user interactions with EditBlock
   * ======================================== */

  /**
   * Handles checkbox selection for selectable items.
   * Intercepts clicks on action menu to prevent checkbox toggle.
   * 
   * @param {Event} event - Click or change event
   * @returns {boolean} Result of checkbox handling
   * @override
   */
  handleCheckbox(event) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "handleCheckbox",
        "detail=",
        JSON.stringify(event?.detail),
        "target=",
        event.target,
        "from actionmenu=",
        this.refs.actionmenu,
        this.refs.actionmenu?.contains(event.target)
      );
    }

    // If click originated from action menu, don't toggle checkbox
    const rv = this.refs.actionmenu?.contains(event.target)
      ? true
      : super.handleCheckbox(null);
    return rv;
  }

  /**
   * Handles action menu item selection (Edit, Delete, etc.).
   * Delegates to parent's handleClickOrEnter with the action ID.
   * 
   * @param {CustomEvent} event - Custom event with index in detail
   * @fires handleClickOrEnter - Inherited method to process action
   */
  handleActionMenuSelected(event) {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleActionMenuSelected", event.detail);
    }

    const actionMenuItem = this._actionMenuList[event.detail];
    this.handleClickOrEnter(null, actionMenuItem.lwcId);

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleActionMenuSelected");
    }
  }

  /**
   * Prevents default click behavior on action menu button.
   * 
   * @param {Event} event - Click event
   */
  handleActionMenuClick(event) {
    if (event) event.preventDefault();
    if (DEBUG) console.debug(CLASS_NAME, "handleActionMenuClick");
  }

  /* ========================================
   * LIFECYCLE METHODS
   * Component initialization and rendering
   * ======================================== */

  /**
   * Selects the appropriate template based on display mode.
   * 
   * Template selection priority:
   * 1. FullScreen (FS) mode
   * 2. Cards or LongCards mode
   * 3. Table mode
   * 4. Inline mode
   * 5. Default from parent
   * 
   * @returns {Object} The template to render
   * @override
   */
  render() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> render",
        this._propSetMap.label,
        "isFs=",
        this._isFS,
        "isLongCards=",
        this._isLongCards,
        "isCards=",
        this._isCards,
        "isTable=",
        this._isTable,
        "isInline=",
        this._isInline,
        "isEditing=",
        this._isEditing,
        "hasChildren=",
        this._hasChildren,
        "isFirstIndex=",
        this._isFirstIndex
      );
    }

    let template = super.render();

    if (this._isFS) {
      template = tmpl_fs;
    } else if (this._isLongCards || this._isCards) {
      template = tmpl_card;
    } else if (this._isTable) {
      template = tmpl_table;
    } else if (this._isInline) {
      template = tmpl_inline;
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< render",
        this._propSetMap.label,
        "template=",
        template
      );
    }

    return template;
  }

  /**
   * Initializes component with Ontario DS scoping class.
   * 
   * @override
   */
  connectedCallback() {
    super.connectedCallback();
    this.classList.add("caon-scope");
  }

  /**
   * Applies width and layout classes based on configuration.
   * Handles controlWidth, hide, and card layout styling.
   * 
   * @override
   */
  applyCtrlWidth() {
    super.applyCtrlWidth();

    if (this.jsonDef && this._propSetMap) {
      // Add spacing for non-root elements with width
      if (this._propSetMap.controlWidth != null && this.jsonDef.level !== 0) {
        this.classList.add("ontario-m-right-sm", "ontario-m-bottom-sm");
      }
      // Hide element if configured
      if (this._propSetMap.hide === true) {
        this.classList.add("ontario-hidden");
      }
    }

    // Apply grid column classes based on mode
    if (this._isCards) {
      this.classList.add("ontario-col-lg-3", "ontario-col-md-6");
    } else {
      this.classList.add("ontario-col-sm-12");
    }
  }

  /**
   * Triggers validation before saving.
   * Ensures all child fields are validated.
   * 
   * @param {Event} evt - Save trigger event
   * @override
   */
  save(evt) {
    this.reportValidity();
    super.save(evt);
  }
}
