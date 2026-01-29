/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnSelectableCardGroup";

/**
 * Minimum number of options before showing skip link.
 * AODA: Skip links for groups with 5+ options.
 */
const SKIP_LINK_THRESHOLD = 5;

/**
 * Ontario Design System - Selectable Card Group Component
 *
 * A fieldset containing multiple selectable cards with checkbox,
 * title, description, and expandable content.
 *
 * Used for service/activity selection interfaces.
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Follows checkbox group and card patterns
 * - WCAG 2.1 AA: Proper fieldset/legend, keyboard navigation
 */
export default class SfGpsDsCaOnSelectableCardGroup extends LightningElement {
  static renderMode = "light";

  /**
   * Legend/title for the fieldset
   */
  @api legend;

  /**
   * Hint text displayed below the legend
   */
  @api hintText;

  /**
   * Name attribute for the checkbox inputs
   */
  @api name;

  /**
   * Array of card options
   * Format: [{ value, label, description, expandedContent }]
   */
  @api
  get options() {
    return this._options;
  }
  set options(val) {
    if (typeof val === "string") {
      try {
        this._options = JSON.parse(val);
      } catch (e) {
        console.error(CLASS_NAME, "Error parsing options JSON", e);
        this._options = [];
      }
    } else {
      this._options = val || [];
    }
    this._updateDecoratedOptions();
  }
  _options = [];

  /**
   * Currently selected values (array of value strings)
   */
  @api
  get value() {
    return this._value;
  }
  set value(val) {
    if (typeof val === "string") {
      try {
        this._value = JSON.parse(val);
      } catch {
        this._value = val ? [val] : [];
      }
    } else {
      this._value = val || [];
    }
    this._updateDecoratedOptions();
  }
  @track _value = [];

  /**
   * Whether the field is required
   */
  @api required = false;

  /**
   * Whether the field is optional
   */
  @api optional = false;

  /**
   * Whether all cards are disabled
   */
  @api disabled = false;

  /**
   * Error message to display
   */
  @api errorMessage;

  /**
   * Additional CSS class
   */
  @api className;

  /**
   * Threshold for showing skip link (number of options).
   * Set to 0 to disable skip link, or a positive number.
   * Default: 5 options.
   * @type {number}
   */
  @api skipLinkThreshold = SKIP_LINK_THRESHOLD;

  /* internal */
  @track _decoratedOptions = [];
  _hintId;
  _errorId;

  /* computed */

  get computedFieldsetClassName() {
    return computeClass({
      "ontario-fieldset": true,
      "sfgpsdscaon-selectable-card-group": true,
      [this.className]: this.className
    });
  }

  get showFlag() {
    return this.required || this.optional;
  }

  get flagText() {
    if (this.required) return "required";
    if (this.optional) return "optional";
    return "";
  }

  get hasError() {
    return Boolean(this.errorMessage);
  }

  get decoratedOptions() {
    return this._decoratedOptions;
  }

  get computedAriaDescribedBy() {
    const ids = [];
    if (this.hintText) ids.push(this._hintId);
    if (this.hasError) ids.push(this._errorId);
    return ids.length > 0 ? ids.join(" ") : null;
  }

  /**
   * Number of options in the group.
   * @returns {number}
   */
  get optionCount() {
    return this._options?.length || 0;
  }

  /**
   * Whether to show skip link based on option count.
   * @returns {boolean}
   */
  get showSkipLink() {
    const threshold =
      parseInt(this.skipLinkThreshold, 10) || SKIP_LINK_THRESHOLD;
    return threshold > 0 && this.optionCount >= threshold;
  }

  /**
   * Unique ID for the skip link target.
   * @returns {string}
   */
  get skipLinkTargetId() {
    return `selectable-card-group-${this._hintId}-skip-target`;
  }

  /**
   * Href for the skip link.
   * @returns {string}
   */
  get skipLinkTarget() {
    return `#${this.skipLinkTargetId}`;
  }

  get computedAriaInvalid() {
    return this.hasError ? "true" : null;
  }

  /* methods */

  _updateDecoratedOptions() {
    if (DEBUG) {
      console.log(CLASS_NAME, "_updateDecoratedOptions", {
        options: JSON.stringify(this._options),
        value: JSON.stringify(this._value)
      });
    }
    this._decoratedOptions = (this._options || []).map((opt, index) => {
      const isChecked = this._value.includes(opt.value);
      if (DEBUG) {
        console.log(
          CLASS_NAME,
          "option",
          opt.value,
          "checked:",
          isChecked,
          "description:",
          opt.description
        );
      }
      return {
        ...opt,
        checked: isChecked,
        key: `option-${index}-${opt.value}`
      };
    });
  }

  /**
   * Standard form validation API - reports validity to the user.
   * Required for OmniStudio form integration.
   * @returns {boolean} True if valid, false if invalid
   */
  @api
  reportValidity() {
    const isValid = this.checkValidity();
    // If invalid and required, the error message should already be displayed
    // via the errorMessage property set by the parent form component
    return isValid;
  }

  /**
   * Standard form validation API - checks validity without reporting.
   * Required for OmniStudio form integration.
   * @returns {boolean} True if valid, false if invalid
   */
  @api
  checkValidity() {
    // If required and no values selected, it's invalid
    if (this.required && (!this._value || this._value.length === 0)) {
      return false;
    }
    return true;
  }

  /**
   * Sets a custom validity message.
   * Required for OmniStudio form integration.
   * @param {string} message - The validation message
   */
  @api
  setCustomValidity(message) {
    // This is typically called by the parent form component
    // The errorMessage property handles display
    if (DEBUG) console.log(CLASS_NAME, "setCustomValidity", message);
  }

  /* event handlers */

  handleCardSelect(event) {
    const { value, checked } = event.detail;

    if (DEBUG) console.log(CLASS_NAME, "handleCardSelect", value, checked);

    let newValue;
    if (checked) {
      newValue = [...this._value, value];
    } else {
      newValue = this._value.filter((v) => v !== value);
    }

    this._value = newValue;
    this._updateDecoratedOptions();

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value: newValue
        },
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    const uniqueId = Math.random().toString(36).substring(2, 9);
    this._hintId = `hint-${uniqueId}`;
    this._errorId = `error-${uniqueId}`;
    this.classList.add("caon-scope");
    this._updateDecoratedOptions();

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }
}
