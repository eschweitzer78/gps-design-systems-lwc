/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
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
 * Extended Options Format (via Custom Properties or @api):
 * Set "optionsJson" in Custom Properties or pass via configOptionsJson:
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
  /* ========================================
   * PUBLIC @api PROPERTIES
   * For Custom LWC elements, OmniStudio passes config via @api properties
   * ======================================== */

  /** @type {boolean} Whether at least one selection is required */
  @api configRequired;

  /** @type {string} Error message when validation fails */
  @api configErrorMessage;

  /** @type {string} JSON string for extended options with descriptions */
  @api configOptionsJson;
  /**
   * Access custom properties from the OmniScript element definition.
   * We use a separate getter because _propSetMap is a base class property that can't be overridden.
   * Try multiple paths since OmniStudio structure varies.
   * @returns {Object} The propSetMap from the OmniScript element definition
   */
  get _customPropSetMap() {
    // Try multiple paths to find propSetMap
    const fromJsonDef = this.jsonDef?.propSetMap;

    if (DEBUG) {
      console.log(CLASS_NAME, "_customPropSetMap - jsonDef:", this.jsonDef);
      console.log(
        CLASS_NAME,
        "_customPropSetMap - jsonDef.propSetMap:",
        fromJsonDef
      );

      // Try to access optionsJson directly from different paths
      console.log(
        CLASS_NAME,
        "_customPropSetMap - jsonDef.propSetMap?.optionsJson:",
        this.jsonDef?.propSetMap?.optionsJson
      );
      console.log(
        CLASS_NAME,
        "_customPropSetMap - jsonDef.optionsJson:",
        this.jsonDef?.optionsJson
      );

      // Check if optionsJson is at the jsonDef level directly
      if (this.jsonDef) {
        // Try to enumerate jsonDef properties
        try {
          for (const key in this.jsonDef) {
            if (Object.prototype.hasOwnProperty.call(this.jsonDef, key)) {
              if (key === "propSetMap" || key === "optionsJson") {
                console.log(
                  CLASS_NAME,
                  "_customPropSetMap - jsonDef[" + key + "]:",
                  this.jsonDef[key]
                );
              }
            }
          }
        } catch (e) {
          console.log(
            CLASS_NAME,
            "_customPropSetMap - error enumerating jsonDef:",
            e
          );
        }
      }

      // Check propSetMap properties
      if (fromJsonDef) {
        try {
          for (const key in fromJsonDef) {
            if (Object.prototype.hasOwnProperty.call(fromJsonDef, key)) {
              console.log(
                CLASS_NAME,
                "_customPropSetMap - propSetMap[" + key + "]:",
                fromJsonDef[key]
              );
            }
          }
        } catch (e) {
          console.log(
            CLASS_NAME,
            "_customPropSetMap - error enumerating propSetMap:",
            e
          );
        }
      }
    }

    return fromJsonDef || {};
  }

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

    if (DEBUG) {
      console.log(
        CLASS_NAME,
        "decoratedOptions - elementValue:",
        this.elementValue
      );
      console.log(
        CLASS_NAME,
        "decoratedOptions - _realtimeOptions length:",
        this._realtimeOptions?.length
      );
      if (this._realtimeOptions?.[0]) {
        const first = this._realtimeOptions[0];
        console.log(CLASS_NAME, "FIRST OPTION - value:", first.value);
        console.log(CLASS_NAME, "FIRST OPTION - label:", first.label);
        console.log(CLASS_NAME, "FIRST OPTION - name:", first.name);
        console.log(
          CLASS_NAME,
          "FIRST OPTION - all keys:",
          Object.keys(first).join(", ")
        );
        // Try to iterate and log all properties
        for (const key of Object.keys(first)) {
          console.log(CLASS_NAME, "FIRST OPTION - " + key + ":", first[key]);
        }
      }
    }

    // Check for extended options - check @api first, then nested propSetMap
    // OmniStudio stores custom properties in a nested propSetMap when added via JSON Editor
    // Path: jsonDef.propSetMap.propSetMap.optionsJson
    const nestedPropSetMap = this.jsonDef?.propSetMap?.propSetMap;
    const extendedOptionsJson =
      this.configOptionsJson || nestedPropSetMap?.optionsJson;
    let extendedOptions = {};

    if (DEBUG) {
      console.log(
        CLASS_NAME,
        "decoratedOptions - nestedPropSetMap:",
        nestedPropSetMap
      );
      console.log(
        CLASS_NAME,
        "decoratedOptions - optionsJson exists:",
        !!extendedOptionsJson
      );
      console.log(
        CLASS_NAME,
        "decoratedOptions - optionsJson type:",
        typeof extendedOptionsJson
      );
      if (extendedOptionsJson) {
        console.log(
          CLASS_NAME,
          "decoratedOptions - optionsJson length:",
          Array.isArray(extendedOptionsJson)
            ? extendedOptionsJson.length
            : "not array"
        );
      }
      // Also enumerate the nested propSetMap to see what's there
      if (nestedPropSetMap) {
        for (const key in nestedPropSetMap) {
          if (Object.prototype.hasOwnProperty.call(nestedPropSetMap, key)) {
            console.log(
              CLASS_NAME,
              "decoratedOptions - nestedPropSetMap[" + key + "]:",
              nestedPropSetMap[key]
            );
          }
        }
      }
    }

    if (extendedOptionsJson) {
      try {
        const parsed =
          typeof extendedOptionsJson === "string"
            ? JSON.parse(extendedOptionsJson)
            : extendedOptionsJson;

        if (DEBUG) {
          console.log(
            CLASS_NAME,
            "decoratedOptions - parsed optionsJson:",
            parsed
          );
        }

        if (Array.isArray(parsed)) {
          parsed.forEach((opt) => {
            extendedOptions[opt.value] = opt;
          });
          if (DEBUG) {
            console.log(
              CLASS_NAME,
              "decoratedOptions - extendedOptions keys:",
              Object.keys(extendedOptions)
            );
          }
        }
      } catch (e) {
        console.error(CLASS_NAME, "Error parsing optionsJson", e);
      }
    }

    // Merge standard options with extended data
    // NOTE: OmniStudio picklist options structure varies:
    // - Sometimes: opt.name = identifier, opt.value = label (confusingly named)
    // - Sometimes: opt.value = identifier, opt.label = label (more intuitive)
    // We need to handle both cases and match against optionsJson which uses "value" as identifier
    return (this._realtimeOptions || []).map((opt, index) => {
      // Determine the identifier - prefer opt.value as it's used for selection tracking
      // If opt.value looks like a label (has spaces), use opt.name instead
      const optValue = opt.value;
      const optLabel = opt.label;
      const optName = opt.name;

      // Use opt.value as identifier if available, otherwise opt.name or opt.label
      const optIdentifier = optValue || optName || optLabel;
      // Use opt.label for display if available, otherwise fall back
      const optDisplayLabel = optLabel || optValue || optName;

      const extended = extendedOptions[optIdentifier] || {};

      if (DEBUG && index === 0) {
        console.log(CLASS_NAME, "MAPPED OPTION - opt.value:", optValue);
        console.log(CLASS_NAME, "MAPPED OPTION - opt.label:", optLabel);
        console.log(CLASS_NAME, "MAPPED OPTION - opt.name:", optName);
        console.log(
          CLASS_NAME,
          "MAPPED OPTION - optIdentifier:",
          optIdentifier
        );
        console.log(
          CLASS_NAME,
          "MAPPED OPTION - optDisplayLabel:",
          optDisplayLabel
        );
        console.log(
          CLASS_NAME,
          "MAPPED OPTION - extended found:",
          Object.keys(extended).length > 0
        );
        console.log(
          CLASS_NAME,
          "MAPPED OPTION - extended.description:",
          extended.description
        );
      }

      return {
        value: optIdentifier,
        label: extended.label || optDisplayLabel,
        description: extended.description || "",
        linkLabel: extended.linkLabel || "",
        linkUrl: extended.linkUrl || "",
        badge: extended.badge || "",
        badgeVariant: extended.badgeVariant || "info",
        expandedContent: extended.expandedContent || "",
        checked: selected.includes(optIdentifier),
        key: `opt-${index}-${optIdentifier}`
      };
    });
  }

  /**
   * Error message for display - check @api first
   */
  get sfGpsDsErrorMessage() {
    return this.configErrorMessage || this._propSetMap?.errorMessage || "";
  }

  /**
   * Whether selection is required - check @api first
   */
  get _isRequired() {
    if (this.configRequired !== undefined) {
      return Boolean(this.configRequired);
    }
    return Boolean(this._propSetMap?.required);
  }

  /* validation overrides - bypass childInput to avoid caching issues */

  /**
   * Override checkValidity to handle validation directly.
   * The parent mixin tries to call this.childInput.checkValidity() which fails
   * for our component since childInput is an LWC, not a native input.
   * @returns {boolean} True if valid
   */
  @api checkValidity() {
    if (DEBUG) console.log(CLASS_NAME, "checkValidity override");
    if (
      this._isRequired &&
      (!this.elementValue || this.elementValue.length === 0)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Override reportValidity to handle validation directly.
   * The parent mixin tries to call this.childInput.reportValidity() which fails
   * for our component since childInput is an LWC, not a native input.
   * @returns {boolean} True if valid
   */
  @api reportValidity() {
    if (DEBUG) console.log(CLASS_NAME, "reportValidity override");
    const isValid = this.checkValidity();
    this._showValidation = !isValid;
    this.isValid = isValid;
    return isValid;
  }

  /* event handlers */

  handleChange(event) {
    // Ignore native change events from checkboxes (they don't have event.detail)
    // Only process custom change events from sfGpsDsCaOnSelectableCardGroup
    if (!event.detail) {
      return;
    }

    const newValue = event.detail.value;

    if (DEBUG) console.log(CLASS_NAME, "handleChange", newValue);

    // Update the OmniStudio element value
    this.applyCallResp(newValue, false, false);
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
