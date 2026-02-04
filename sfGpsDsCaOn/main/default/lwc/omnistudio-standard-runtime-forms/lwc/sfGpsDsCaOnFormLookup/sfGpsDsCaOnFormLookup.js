/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormLookup from "c/sfGpsDsFormLookup";
import { computeClass } from "c/sfGpsDsHelpers";
import { Logger } from "c/sfGpsDsCaOnDebugUtils";
import tmpl from "./sfGpsDsCaOnFormLookup.html";

/**
 * Logger instance for this component.
 * Enable debug output by setting window.sfGpsDsCaOnDebug = true in console.
 * @type {Logger}
 */
const log = new Logger("SfGpsDsCaOnFormLookup");

/**
 * Internationalization strings for the Lookup component.
 * @type {Object}
 */
const I18N = {
  clearLabel: "-- Clear --"
};

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
 * @slot Lookup
 * @description Ontario Design System Lookup for OmniStudio forms.
 *
 * Lookup provides a searchable dropdown with autocomplete functionality.
 * It fetches options from a DataRaptor or Integration Procedure and allows
 * users to search and select from the results.
 *
 * ## Key Inherited Properties (from SfGpsDsFormLookup)
 * - `options` {Array} - Available options to display
 * - `show` {boolean} - Whether dropdown is visible
 * - `selectedIndex` {number} - Currently selected option index
 * - `highlightIndex` {number} - Currently highlighted option index
 * - `_inputRef` {HTMLElement} - Reference to the input element
 *
 * ## Key Inherited Methods (from SfGpsDsFormLookup)
 * - `showOptions()` - Opens the dropdown
 * - `hideOptions()` - Closes the dropdown
 * - `selectOption(event)` - Handles option selection
 * - `ariaFocus(index)` - Manages ARIA focus for accessibility
 *
 * ## ARIA Combobox Pattern
 * This component implements the WAI-ARIA combobox pattern:
 * - Input has role="combobox" with aria-expanded
 * - Listbox has role="listbox"
 * - Options have role="option" with aria-selected
 * - Active descendant tracked via aria-activedescendant
 *
 * ## Compliance
 * - **LWR**: Uses Light DOM parent component
 * - **LWS**: No eval(), proper namespace imports
 * - **Ontario DS**: Uses Ontario form field styling
 * - **WCAG 2.1 AA**: Full keyboard navigation, screen reader support
 *
 * @example
 * // Configured in OmniScript as "Lookup" element type
 * // Requires DataRaptor or Integration Procedure for options
 *
 * @see {@link sfGpsDsCaOnFormTypeahead} Similar component for typeahead
 * @see {@link sfGpsDsCaOnFormSelect} Simpler dropdown without search
 */
export default class SfGpsDsCaOnFormLookup extends SfGpsDsFormLookup {
  /* ========================================
   * COMPUTED PROPERTIES - CSS CLASSES
   * Used for Ontario DS styling in templates
   * ======================================== */

  /**
   * Computes CSS classes for the label element.
   * Adds required modifier when field is required.
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
   * Adds error styling when validation fails.
   *
   * @returns {string} Space-separated CSS classes
   * @template-binding: <input class={computedInputClassName}>
   */
  get computedInputClassName() {
    return computeClass({
      "ontario-input": true,
      "sfgpsdscaon-combobox__input": true,
      "ontario-input__error": this.sfGpsDsIsError
    });
  }

  /**
   * Computes aria-describedby attribute for accessibility.
   * Links input to helper text and error message elements.
   *
   * @returns {string|null} Space-separated IDs or null
   * @template-binding: aria-describedby={computedAriaDescribedBy}
   */
  /**
   * Computes aria-describedby attribute for accessibility.
   * Links input to helper text and error message elements.
   *
   * @returns {string|null} Space-separated IDs or null
   * @template-binding: aria-describedby={computedAriaDescribedBy}
   */
  get computedAriaDescribedBy() {
    const ids = [];
    if (this.mergedHelpText) ids.push("helper");
    if (this.sfGpsDsIsError) ids.push("errorMessageBlock");
    return ids.length > 0 ? ids.join(" ") : null;
  }

  /**
   * Computes CSS classes for the dropdown container.
   * Controls visibility via open modifier.
   *
   * @returns {string} Space-separated CSS classes
   * @template-binding: <div class={computedDropdownClassName}>
   */
  get computedDropdownClassName() {
    return computeClass({
      "sfgpsdscaon-dropdown": true,
      "sfgpsdscaon-dropdown--open": this.show
    });
  }

  /* ========================================
   * COMPUTED PROPERTIES - DISPLAY STATE
   * Control flag and option rendering
   * ======================================== */

  /**
   * Determines if required/optional flag should display.
   *
   * @returns {boolean} True if required or optional is set
   * @template-binding: <span lwc:if={showFlag}>
   */
  get showFlag() {
    return this._propSetMap?.required || this._propSetMap?.optional;
  }

  /**
   * Returns announcement text for screen readers when results are available.
   * AODA/WCAG: Provides dynamic result count for assistive technology.
   *
   * @returns {string} Announcement text
   * @template-binding: Used in aria-live region
   */
  get resultsAnnouncement() {
    if (this.isPageLoading) {
      return "Loading options...";
    }
    const count = this.computedOptions?.length || 0;
    if (count === 0) {
      return "No options available";
    }
    return `${count} option${count === 1 ? "" : "s"} available. Use up and down arrows to navigate.`;
  }

  /**
   * Returns the flag text ("required" or "optional").
   *
   * @returns {string} Flag text for display
   * @template-binding: ({flagText})
   */
  get flagText() {
    if (this._propSetMap?.required) return "required";
    if (this._propSetMap?.optional) return "optional";
    return "";
  }

  /**
   * Transforms options for template rendering.
   * Marks clear option and adds href for each option.
   *
   * The "--" value is a special OmniStudio convention for "clear selection".
   * This getter transforms it to a user-friendly label.
   *
   * @returns {Array} Decorated options with isClear and href properties
   * @template-binding: Used in option iteration (for:each)
   * @override
   */
  get computedOptions() {
    const rv = super.computedOptions;

    for (let i = 0; i < rv.length; i++) {
      const item = rv[i];
      // Transform the clear option marker to friendly label
      if (item.value === "--") {
        item.isClear = true;
        item.value = I18N.clearLabel;
      }
      // Add href for keyboard navigation
      item.href = `#option-${item.id}`;
    }

    return rv;
  }

  /* ========================================
   * DROPDOWN BEHAVIOR OVERRIDES
   * Customize show/hide with Ontario styling
   * ======================================== */

  /**
   * Opens the dropdown and applies Ontario open state class.
   * Resets selection if clearValue is enabled.
   *
   * @override
   */
  showOptions() {
    log.enter("showOptions");

    // Apply open class to trigger container
    const triggerEl = this.template.querySelector(".sfgpsdscaon-combobox");
    if (triggerEl) {
      triggerEl.classList.add(THEME_IS_OPEN_CLASSNAME);
    }

    // Call parent to handle standard show logic
    super.showOptions();

    // Reset selection state if clear is enabled
    if (this.selectedIndex === -1 || this._propSetMap.clearValue) {
      log.debug("Resetting selection state", {
        clearValue: this._propSetMap.clearValue
      });
      this.selectedIndex = -1;
      this.highlightIndex = -1;
      this.ariaFocus(null);
    }

    log.debug("Dropdown opened", {
      optionCount: this.computedOptions?.length || 0
    });
    log.exit("showOptions");
  }

  /**
   * Closes the dropdown and removes Ontario open state class.
   *
   * @override
   */
  hideOptions() {
    // Remove open class from trigger container
    const triggerEl = this.template.querySelector(".sfgpsdscaon-combobox");
    if (triggerEl) {
      triggerEl.classList.remove(THEME_IS_OPEN_CLASSNAME);
    }

    // Call parent to handle standard hide logic
    super.hideOptions();
  }

  /**
   * Manages visual focus indicator on options.
   * Implements ARIA activedescendant pattern for screen readers.
   *
   * This is critical for WCAG compliance - screen readers need to
   * know which option is currently focused even though DOM focus
   * remains on the input.
   *
   * @param {number|null} newIndex - Index of option to focus, or null to clear
   * @param {boolean} [isHover=false] - True if triggered by mouse hover
   * @override
   */
  ariaFocus(newIndex, isHover = false) {
    const options = this.template.querySelectorAll('[role="option"]');

    // Remove focus styling from all options
    options.forEach((opt) => {
      opt.classList.remove(THEME_HAS_FOCUS_CLASSNAME);
    });

    if (newIndex != null && options[newIndex]) {
      const option = options[newIndex];

      // Apply focus styling
      option.classList.add(THEME_HAS_FOCUS_CLASSNAME);

      // Update ARIA activedescendant for screen readers
      this._inputRef.setAttribute("aria-activedescendant", option.id);

      // Scroll into view for keyboard navigation (not for hover)
      if (option.scrollIntoView && !isHover) {
        option.scrollIntoView({ block: "nearest" });
      }
    } else if (options.length) {
      // Scroll to first option when clearing focus
      if (options[0].scrollIntoView && !isHover) {
        options[0].scrollIntoView({ block: "nearest" });
      }
    }
  }

  /* ========================================
   * EVENT HANDLERS
   * Handle user interactions
   * ======================================== */

  /**
   * Handles option selection from the dropdown.
   * Prevents default anchor behavior before calling parent handler.
   *
   * @param {Event} event - Click event from option element
   * @override
   */
  selectOption(event) {
    log.enter("selectOption");

    // Prevent anchor navigation
    event.preventDefault();

    const optionIndex = event.currentTarget?.dataset?.index;
    log.debug("Option selected", { index: optionIndex });

    try {
      // Call parent to update value and close dropdown
      super.selectOption(event);
      log.debug("Selection applied successfully");
    } catch (error) {
      log.error("Failed to apply selection", error);
    }

    log.exit("selectOption");
  }

  /* ========================================
   * LIFECYCLE METHODS
   * Component initialization
   * ======================================== */

  /**
   * Returns the Ontario DS template for this component.
   *
   * @returns {Object} The template to render
   * @override
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes component with Ontario DS classes.
   * Sets up CSS scoping and read-only styling class.
   *
   * @override
   */
  connectedCallback() {
    log.enter("connectedCallback");
    log.timeStart("initialization");

    if (super.connectedCallback) {
      super.connectedCallback();
    }

    // Class used for read-only styling
    this._readOnlyClass = "sfgpsdscaon-read-only";

    // CSS scoping class for Ontario DS styles
    this.classList.add("caon-scope");

    log.debug("Component initialized", {
      label: this._propSetMap?.label,
      required: this._propSetMap?.required,
      optionsSource: this._propSetMap?.optionSource?.type || "none"
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
