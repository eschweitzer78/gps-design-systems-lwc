/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormTypeahead from "c/sfGpsDsFormTypeahead";
import { computeClass } from "c/sfGpsDsHelpers";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";
import { Logger } from "c/sfGpsDsCaOnDebugUtils";
import tmpl from "./sfGpsDsCaOnFormTypeahead.html";

/**
 * Logger instance for this component.
 * Enable debug output by setting window.sfGpsDsCaOnDebug = true in console.
 * @type {Logger}
 */
const log = new Logger("SfGpsDsCaOnFormTypeahead");

/**
 * CSS class applied when dropdown is open.
 * @type {string}
 */
const THEME_IS_OPEN_CLASSNAME = "sfgpsdscaon-is-open";

/**
 * CSS class applied to the currently focused option.
 * @type {string}
 */
const THEME_HAS_FOCUS_CLASSNAME = "sfgpsdscaon-has-focus";

/**
 * @slot Typeahead
 * @description Ontario Design System Typeahead for OmniStudio forms.
 * Provides autocomplete functionality with remote data source support.
 *
 * ## Key Inherited Properties (from OmniscriptTypeahead via SfGpsDsFormTypeahead)
 * - `options` {Array} - Available options from remote source
 * - `elementValue` {string} - Current input value
 * - `_isEditMode` {boolean} - Whether in edit mode (shows child elements)
 * - `errorMessage` {string} - Error message from remote call
 *
 * ## Key Inherited Methods (from OmniscriptTypeahead)
 * - `handleTypeahead(event)` - Debounced handler for keyup, triggers remote search
 * - `handleSelect(event)` - Handles option selection from dropdown
 * - `handleBlur(event)` - Handles blur, triggers validation
 * - `toggleEditMode()` - Toggles edit mode for child elements
 *
 * ## Compliance
 * - **LWR**: Uses Light DOM parent component
 * - **LWS**: No eval(), proper namespace imports
 * - **Ontario DS**: Uses Ontario form field styling
 * - **WCAG 2.1 AA**: Proper ARIA combobox pattern, keyboard navigation
 *
 * @see {@link sfGpsDsCaOnFormLookup} Similar component for static lookups
 */
export default class SfGpsDsCaOnFormTypeahead extends SfGpsDsFormTypeahead {
  /**
   * Track whether dropdown is showing.
   * @type {boolean}
   */
  _showOptions = false;

  /**
   * Track loading state during remote calls.
   * @type {boolean}
   */
  _isLoading = false;

  /**
   * Index of currently highlighted option for keyboard navigation.
   * @type {number}
   */
  _highlightIndex = -1;

  /* ========================================
   * COMPUTED PROPERTIES - ERROR STATE
   * Validation error display - these are not in base SfGpsDsFormTypeahead
   * ======================================== */

  /**
   * Returns true if the field has a validation error.
   * Checks both standard validation and custom validation from SetErrors.
   *
   * @returns {boolean} True if field is invalid
   * @template-binding: aria-invalid={sfGpsDsIsError}
   */
  get sfGpsDsIsError() {
    // Check standard validation state
    if (this._showValidation && !this.isValid) {
      return true;
    }
    // Check custom validation (from SetErrors action)
    if (this._sfGpsDsCustomValidation) {
      return true;
    }
    // Check error from remote call
    if (this.errorMessage) {
      return true;
    }
    return false;
  }

  /**
   * Returns the error message to display.
   *
   * @returns {string|null} Error message or null
   * @template-binding: {sfGpsDsErrorMessage}
   */
  get sfGpsDsErrorMessage() {
    if (this.errorMessage) {
      return omniGetMergedField(this, this.errorMessage);
    }
    if (this.validationMessage) {
      return omniGetMergedField(this, this.validationMessage);
    }
    return null;
  }

  /* ========================================
   * COMPUTED PROPERTIES - CSS CLASSES
   * Used for Ontario DS styling in templates
   * ======================================== */

  /**
   * Computes CSS classes for the label element.
   *
   * @returns {string} Space-separated CSS classes
   * @template-binding: <label class={computedLabelClassName}>
   */
  get computedLabelClassName() {
    return computeClass({
      "ontario-label": true,
      "ontario-label--required": this._propSetMap.required
    });
  }

  /**
   * Computes CSS classes for the input element.
   *
   * @returns {string} Space-separated CSS classes
   * @template-binding: <input class={computedInputClassName}>
   */
  get computedInputClassName() {
    return computeClass({
      "ontario-input": true,
      "sfgpsdscaon-typeahead__input": true,
      "ontario-input__error": this.sfGpsDsIsError
    });
  }

  /**
   * Determines if required/optional flag should display.
   *
   * @returns {boolean} True if flag should show
   * @template-binding: <span lwc:if={showFlag}>
   */
  get showFlag() {
    return this._propSetMap?.required || this._propSetMap?.optional;
  }

  /**
   * Returns the flag text ("required" or "optional").
   *
   * @returns {string} Flag text
   * @template-binding: ({flagText})
   */
  get flagText() {
    if (this._propSetMap?.required) return "required";
    if (this._propSetMap?.optional) return "optional";
    return "";
  }

  /**
   * Computes aria-describedby for accessibility.
   *
   * @returns {string|null} Space-separated element IDs
   * @template-binding: aria-describedby={computedAriaDescribedBy}
   */
  get computedAriaDescribedBy() {
    const ids = [];
    if (this.mergedHelpText) ids.push("helper");
    if (this.sfGpsDsIsError) ids.push("errorMessageBlock");
    return ids.length > 0 ? ids.join(" ") : null;
  }

  /**
   * Computes aria-activedescendant for the currently highlighted option.
   * AODA/WCAG 4.1.2: Announces active option to screen readers during keyboard navigation.
   *
   * @returns {string|null} ID of highlighted option or null
   * @template-binding: aria-activedescendant={computedAriaActiveDescendant}
   */
  get computedAriaActiveDescendant() {
    if (
      this._showOptions &&
      this._highlightIndex >= 0 &&
      this._highlightIndex < (this.options?.length || 0)
    ) {
      return `typeahead-option-${this._highlightIndex}`;
    }
    return null;
  }

  /**
   * Returns the number of available options for screen reader announcement.
   *
   * @returns {number} Number of options
   * @template-binding: Used in live region
   */
  get optionCount() {
    return this.options?.length || 0;
  }

  /**
   * Returns announcement text for screen readers when results are available.
   * AODA/WCAG: Provides dynamic result count for assistive technology.
   *
   * @returns {string} Announcement text
   * @template-binding: Used in aria-live region
   */
  get resultsAnnouncement() {
    if (this._isLoading) {
      return "Searching...";
    }
    const count = this.optionCount;
    if (count === 0) {
      return "No results found";
    }
    return `${count} result${count === 1 ? "" : "s"} available. Use up and down arrows to navigate.`;
  }

  /**
   * Computes CSS classes for the dropdown container.
   *
   * @returns {string} Space-separated CSS classes
   * @template-binding: <div class={computedDropdownClassName}>
   */
  get computedDropdownClassName() {
    return computeClass({
      "sfgpsdscaon-dropdown": true,
      "sfgpsdscaon-dropdown--open": this._showOptions
    });
  }

  /**
   * Returns true if options array has items.
   *
   * @returns {boolean} True if options exist
   * @template-binding: <div lwc:if={hasOptions}>
   */
  get hasOptions() {
    return this.options && this.options.length > 0;
  }

  /**
   * Transforms options for template rendering.
   * OmniStudio typeahead uses `name` for display, we map it to `label` for consistency.
   *
   * @returns {Array} Decorated options with key, id, and label
   * @template-binding: Used in for:each iteration
   */
  get decoratedOptions() {
    return (this.options || []).map((opt, index) => {
      // Handle both string options and object options
      const optObj = typeof opt === "string" ? { name: opt } : opt;
      return {
        ...optObj,
        key: optObj.key || index,
        id: `typeahead-option-${index}`,
        // Use `name` from OmniStudio options, fallback to label or value
        label: optObj.name || optObj.label || optObj.value || ""
      };
    });
  }

  /* ========================================
   * DROPDOWN BEHAVIOR
   * Show/hide options and manage focus
   * ======================================== */

  /**
   * Opens the dropdown and applies open state class.
   */
  showOptions() {
    this._showOptions = true;
    const triggerEl = this.template.querySelector(".sfgpsdscaon-typeahead");
    if (triggerEl) {
      triggerEl.classList.add(THEME_IS_OPEN_CLASSNAME);
    }
  }

  /**
   * Closes the dropdown and removes open state class.
   */
  hideOptions() {
    this._showOptions = false;
    this._highlightIndex = -1;
    const triggerEl = this.template.querySelector(".sfgpsdscaon-typeahead");
    if (triggerEl) {
      triggerEl.classList.remove(THEME_IS_OPEN_CLASSNAME);
    }
  }

  /* ========================================
   * EVENT HANDLERS
   * Handle user interactions, delegate to parent where needed
   * ======================================== */

  /**
   * Handles option selection from the dropdown.
   * Delegates to parent's handleSelect for proper OmniScript integration.
   *
   * @param {Event} event - Click or keydown event on option
   */
  handleOptionSelect(event) {
    log.enter("handleOptionSelect", { type: event.type, key: event.key });

    // Only handle click or Enter key
    if (event.type === "keydown" && event.key !== "Enter") {
      log.exit("handleOptionSelect", "ignored - not Enter key");
      return;
    }

    event.preventDefault();

    const index = parseInt(
      event.currentTarget.getAttribute("data-option-index"),
      10
    );
    const option = this.options[index];

    log.debug("Option selected", { index, option });

    if (option) {
      // Get the value to apply - OmniStudio uses `name` for the value
      const value = typeof option === "string" ? option : option.name;

      log.debug("Applying value to OmniScript", { value });

      // Update OmniScript data through parent's applyCallResp
      try {
        this.applyCallResp(value);
        log.debug("Value applied successfully");
      } catch (error) {
        log.error("Failed to apply value", error);
      }

      // Clear options to close dropdown
      this.options = [];
    }

    this.hideOptions();
    log.exit("handleOptionSelect");
  }

  /**
   * Handles mouse hover on options for visual focus.
   *
   * @param {Event} event - Mouseover event
   */
  handleOptionFocus(event) {
    const options = this.template.querySelectorAll('[role="option"]');
    options.forEach((opt) => opt.classList.remove(THEME_HAS_FOCUS_CLASSNAME));

    event.currentTarget.classList.add(THEME_HAS_FOCUS_CLASSNAME);
    this._highlightIndex = parseInt(
      event.currentTarget.getAttribute("data-option-index"),
      10
    );
  }

  /**
   * Handles keyboard navigation in dropdown.
   *
   * @param {KeyboardEvent} event - Keydown event on input
   */
  handleInputKeyDown(event) {
    log.trace("handleInputKeyDown", {
      key: event.key,
      showOptions: this._showOptions
    });

    switch (event.key) {
      case "Escape":
        log.debug("Keyboard: Escape - closing dropdown");
        this.hideOptions();
        break;

      case "ArrowDown":
        event.preventDefault();
        if (!this._showOptions && this.hasOptions) {
          log.debug("Keyboard: ArrowDown - opening dropdown");
          this.showOptions();
        }
        this._highlightIndex = Math.min(
          this._highlightIndex + 1,
          this.options.length - 1
        );
        log.stateChange(
          "_highlightIndex",
          this._highlightIndex - 1,
          this._highlightIndex
        );
        this.updateHighlight();
        break;

      case "ArrowUp":
        event.preventDefault();
        const prevIndex = this._highlightIndex;
        this._highlightIndex = Math.max(this._highlightIndex - 1, 0);
        log.stateChange("_highlightIndex", prevIndex, this._highlightIndex);
        this.updateHighlight();
        break;

      case "Enter":
        if (this._showOptions && this._highlightIndex >= 0) {
          event.preventDefault();
          const option = this.options[this._highlightIndex];
          log.debug("Keyboard: Enter - selecting option", {
            index: this._highlightIndex,
            option
          });
          if (option) {
            const value = typeof option === "string" ? option : option.name;
            try {
              this.applyCallResp(value);
            } catch (error) {
              log.error("Failed to apply selection via Enter", error);
            }
            this.options = [];
          }
          this.hideOptions();
        }
        break;

      default:
        // Let other keys pass through
        break;
    }
  }

  /**
   * Updates visual highlight on options based on _highlightIndex.
   */
  updateHighlight() {
    const options = this.template.querySelectorAll('[role="option"]');
    options.forEach((opt, idx) => {
      if (idx === this._highlightIndex) {
        opt.classList.add(THEME_HAS_FOCUS_CLASSNAME);
        opt.scrollIntoView({ block: "nearest" });
      } else {
        opt.classList.remove(THEME_HAS_FOCUS_CLASSNAME);
      }
    });
  }

  /**
   * Handles input changes and triggers remote search.
   * Delegates to parent's handleTypeahead for debounced remote calls.
   *
   * @param {Event} event - Input or focus event
   */
  handleInputChange(event) {
    // Parent's handleTypeahead is bound to keyup and handles debounced search
    // We call it via the event system
    if (this.hasOptions) {
      this.showOptions();
    }
  }

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Returns the Ontario DS template.
   *
   * @returns {Object} Template to render
   * @override
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes component with Ontario DS classes.
   *
   * @override
   */
  connectedCallback() {
    log.enter("connectedCallback");
    log.timeStart("initialization");

    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdscaon-read-only";
    this._showOptions = false;
    this._highlightIndex = -1;
    this.classList.add("caon-scope");

    log.debug("Component initialized", {
      label: this._propSetMap?.label,
      required: this._propSetMap?.required,
      dataJson: this._propSetMap?.dataJson ? "configured" : "none"
    });

    log.timeEnd("initialization");
    log.exit("connectedCallback");
  }

  /**
   * Cleanup when component is removed.
   *
   * @override
   */
  disconnectedCallback() {
    log.debug("Component disconnecting");

    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}
