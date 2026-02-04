/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormTextBlock from "c/sfGpsDsFormTextBlock";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormTextBlock.html";

/**
 * @slot Text Block
 * @description Ontario Design System Text Block for OmniStudio forms.
 * Displays rich text/HTML content with merge field support and Ontario DS typography.
 *
 * This component overrides the standard OmniScript Text Block element to provide
 * Ontario Design System styling while maintaining full merge field functionality.
 *
 * ## Architecture
 * - Extends: SfGpsDsFormTextBlock (base form text block)
 * - Renders: HTML content with merge fields replaced
 * - Styling: Ontario DS typography via caon-scope class
 *
 * ## OmniScript Configuration
 * In OmniScript Designer, configure the Text Block:
 * - Text: HTML content with optional merge fields (e.g., %FirstName%)
 * - Supports all standard HTML tags and inline styles
 * - Merge fields are replaced at runtime with data values
 *
 * ## Merge Field Examples
 * - %FirstName% - Simple field reference
 * - %Address:Street% - Nested field reference
 * - %Items[0]:Name% - Array element reference
 *
 * ## OmniScript Registration
 * Register in your OmniScript LWC override:
 * ```javascript
 * import sfGpsDsCaOnFormTextBlock from "c/sfGpsDsCaOnFormTextBlock";
 *
 * static elementTypeToLwcConstructorMap = {
 *   ...OmniscriptBaseOsrt.elementTypeToLwcConstructorMap,
 *   "Text Block": sfGpsDsCaOnFormTextBlock,
 * };
 * ```
 *
 * Compliance:
 * - LWR: Uses lwc:dom="manual" for dynamic HTML injection
 * - LWS: Uses replaceInnerHtml helper for safe HTML insertion
 * - Ontario DS: Applies ontario-text-block styling
 * - WCAG 2.1 AA: Semantic HTML preserved, proper heading hierarchy
 */
export default class SfGpsDsCaOnFormTextBlock extends SfGpsDsFormTextBlock {
  /* ========================================
   * CONSTANTS
   * ======================================== */

  /**
   * CSS selector for the merge field container element.
   * @type {string}
   */
  static MERGE_QUERY_SELECTOR = ".sfGpsDsCaOnMerge";

  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Renders the Ontario-specific template.
   * @returns {Object} The imported HTML template
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes the component when added to DOM.
   * Sets up Ontario DS-specific styling classes.
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    // Add Ontario DS scope class for CSS isolation
    this.classList.add("caon-scope");
  }

  /**
   * Called after render to inject merged HTML content.
   * Uses replaceInnerHtml for safe DOM manipulation.
   */
  renderedCallback() {
    const element = this.template.querySelector(
      SfGpsDsCaOnFormTextBlock.MERGE_QUERY_SELECTOR
    );

    if (element && this.jsonDef?.propSetMap?.text) {
      // Get the text content with merge fields replaced
      const mergedContent = omniGetMergedField(
        this,
        this.jsonDef.propSetMap.text
      );

      // Safely inject the HTML content
      replaceInnerHtml(element, mergedContent);
    }
  }
}
