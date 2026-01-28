/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMultiselect from "c/sfGpsDsFormMultiselect";
import tmpl from "./sfGpsDsCaOnFormSelectableCards.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormSelectableCards";

/**
 * @slot SelectableCards
 * @description Ontario Design System Selectable Cards for OmniStudio forms.
 *
 * Displays a group of selectable cards, each with:
 * - Checkbox for selection
 * - Title (bold)
 * - Optional status badge (NEW, IN PROGRESS, etc.)
 * - Description text
 * - Expandable "View more" content
 *
 * Used for service/activity selection interfaces like EASR activity selection.
 *
 * Options Format (in OmniScript picklist):
 * - Value: unique identifier (e.g., "air-emissions")
 * - Label: Card title (e.g., "Air emissions")
 * - For description and expanded content, use Custom LWC properties
 *
 * Extended Options Format (via Custom Properties):
 * Set "optionsJson" in Custom Properties with format:
 * [
 *   {
 *     "value": "air-emissions",
 *     "label": "Air emissions",
 *     "description": "If your business engages in activities...",
 *     "linkLabel": "More details in your profile",
 *     "linkUrl": "/profile/sites/air-emissions",
 *     "badge": "NEW",
 *     "badgeVariant": "success",
 *     "expandedContent": "Additional details about requirements..."
 *   }
 * ]
 *
 * Badge Variants: success (green), info (blue), warning (yellow), error (red)
 *
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses sfGpsDsCaOnSelectableCardGroup component
 * - WCAG 2.1 AA: Proper fieldset/legend, keyboard navigation
 */
export default class SfGpsDsCaOnFormSelectableCards extends SfGpsDsFormMultiselect {
  /* computed */

  /**
   * Merges standard OmniStudio options with extended options from Custom Properties.
   * Extended options can include description and expandedContent.
   */
  get decoratedOptions() {
    const selected = Array.isArray(this.elementValue)
      ? this.elementValue
      : this.elementValue
        ? [this.elementValue]
        : [];

    // Check for extended options in Custom Properties
    const extendedOptionsJson = this._propSetMap?.optionsJson;
    let extendedOptions = {};

    if (extendedOptionsJson) {
      try {
        const parsed =
          typeof extendedOptionsJson === "string"
            ? JSON.parse(extendedOptionsJson)
            : extendedOptionsJson;

        if (Array.isArray(parsed)) {
          parsed.forEach((opt) => {
            extendedOptions[opt.value] = opt;
          });
        }
      } catch (e) {
        if (DEBUG) console.error(CLASS_NAME, "Error parsing optionsJson", e);
      }
    }

    // Merge standard options with extended data
    return (this._realtimeOptions || []).map((opt, index) => {
      const extended = extendedOptions[opt.value] || {};
      return {
        value: opt.value,
        label: extended.label || opt.label,
        description: extended.description || "",
        linkLabel: extended.linkLabel || "",
        linkUrl: extended.linkUrl || "",
        badge: extended.badge || "",
        badgeVariant: extended.badgeVariant || "info",
        expandedContent: extended.expandedContent || "",
        checked: selected.includes(opt.value),
        key: `opt-${index}-${opt.value}`
      };
    });
  }

  /**
   * Error message for display
   */
  get sfGpsDsErrorMessage() {
    return this._propSetMap?.errorMessage || "";
  }

  /* event handlers */

  handleChange(event) {
    const newValue = event.detail.value;

    if (DEBUG) console.log(CLASS_NAME, "handleChange", newValue);

    // Update the OmniStudio element value
    this.applyCallResp(newValue, false, false, true);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdscaon-read-only";
    this.classList.add("caon-scope");

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this._propSetMap);
  }
}
