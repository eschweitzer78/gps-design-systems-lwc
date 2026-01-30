/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFile from "c/sfGpsDsFormFile";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormFile.html";

/**
 * @slot File
 * @description Ontario Design System File Upload for OmniStudio forms.
 *
 * This component wraps the lightning-file-upload component with Ontario DS
 * styling for use in OmniStudio forms. Files are uploaded to Salesforce
 * and linked to a parent record.
 *
 * ## Key Inherited Properties (from SfGpsDsFormFile)
 * - `_value` {Array} - Array of uploaded file objects
 * - `_recordId` {string} - Parent record ID for file association
 * - `_isLoading` {boolean} - True during file upload
 * - `_acceptedFormats` {Array} - Allowed file types
 * - `_maxFiles` {number} - Maximum number of files allowed
 * - `_showValidation` {boolean} - Whether to show validation state
 *
 * ## Key Inherited Methods (from SfGpsDsFormFile)
 * - `handleUploadFinished(event)` - Handles successful file upload
 * - `handleDelete(event)` - Handles file deletion
 * - `reportValidity()` - Triggers validation check
 *
 * ## File Object Structure
 * Each file in `_value` array has:
 * ```javascript
 * {
 *   data: "068xxx...",        // ContentDocument ID
 *   filename: "document.pdf", // Original filename
 *   size: 12345,              // File size in bytes
 *   type: "application/pdf"   // MIME type
 * }
 * ```
 *
 * ## Dependencies
 * - Requires `lightning-file-upload` base component
 * - Requires parent record ID for file storage
 *
 * ## Compliance
 * - **LWR**: Uses lightning-file-upload (LWR compatible base component)
 * - **LWS**: No eval(), proper namespace imports
 * - **Ontario DS**: Ontario form field structure with custom upload styling
 * - **WCAG 2.1 AA**: Proper labeling, keyboard accessible, screen reader support
 *
 * @example
 * // Configured in OmniScript as "File" element type
 * // Properties set in OmniScript Designer:
 * // - accept: ".pdf,.doc,.docx"
 * // - max: 5 (maximum files)
 * // - required: true/false
 *
 * @see {@link https://developer.salesforce.com/docs/component-library/bundle/lightning-file-upload} lightning-file-upload docs
 */
export default class SfGpsDsCaOnFormFile extends SfGpsDsFormFile {
  /**
   * Computed aria-describedby value.
   * Tracked to trigger re-render when helper elements change.
   *
   * @type {string}
   * @track
   */
  @track computedAriaDescribedBy;

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

  /* ========================================
   * COMPUTED PROPERTIES - DISPLAY STATE
   * Control flag and file list rendering
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
   * Determines if any files have been uploaded.
   * Used to conditionally render the file list.
   *
   * @returns {boolean} True if _value array has items
   * @template-binding: <div lwc:if={hasFiles} class="sfgpsdscaon-file__list">
   */
  get hasFiles() {
    return this._value && this._value.length > 0;
  }

  /**
   * Transforms uploaded files for template rendering.
   * Adds unique key and index for list iteration.
   *
   * @returns {Array<Object>} Decorated file objects
   * @template-binding: Used in file list iteration (for:each)
   *
   * @example
   * // Returns:
   * [
   *   { data: "068xxx", filename: "doc.pdf", key: "068xxx", index: 0 },
   *   { data: "068yyy", filename: "img.png", key: "068yyy", index: 1 }
   * ]
   */
  get decoratedFiles() {
    return (this._value || []).map((file, index) => ({
      ...file,
      key: file.data || index, // Use ContentDocument ID as key
      index
    }));
  }

  /* ========================================
   * LIFECYCLE METHODS
   * Component initialization and updates
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
   * Initializes component with Ontario DS scoping class.
   *
   * @override
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    // CSS scoping class for Ontario DS styles
    this.classList.add("caon-scope");
  }

  /**
   * Computed aria-describedby initialization flag.
   * @type {boolean}
   * @private
   */
  _ariaDescribedByInitialized = false;

  /**
   * Updates aria-describedby after render.
   * Collects IDs from all hint elements for screen reader association.
   * Optimized: Only queries DOM once after initial render.
   *
   * @override
   */
  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    // Optimization: Only compute aria-describedby once
    if (!this._ariaDescribedByInitialized) {
      const helpers = this.template.querySelectorAll(".ontario-hint");
      if (helpers.length > 0) {
        this.computedAriaDescribedBy = [...helpers]
          .map((item) => item.id)
          .join(" ");
        this._ariaDescribedByInitialized = true;
      }
    }
  }
}
