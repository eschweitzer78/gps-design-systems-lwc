/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnCalloutOmni";

/**
 * Valid variant values with their CSS class mappings
 */
const VARIANT_VALUES = {
  info: "ontario-callout--information",
  information: "ontario-callout--information",
  warning: "ontario-callout--warning",
  error: "ontario-callout--error",
  success: "ontario-callout--success"
};

const VARIANT_DEFAULT = "info";

/**
 * Ontario Design System Callout for OmniStudio Custom LWC
 * Shadow DOM version for OmniStudio compatibility
 *
 * Usage in OmniScript:
 * - LWC Component Name: sfGpsDsCaOnCalloutOmni
 * - Custom Attributes:
 *   - title: Callout heading text
 *   - content: Callout body content
 *   - variant: info (default), warning, error, success
 */
export default class SfGpsDsCaOnCalloutOmni extends LightningElement {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  /**
   * Callout title/heading text
   */
  @api title = "";

  /**
   * Callout body content
   */
  @api content = "";

  /**
   * Callout variant: info (default), warning, error, success
   */
  @api variant = VARIANT_DEFAULT;

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * Get the normalized variant key
   */
  get _variantKey() {
    const normalizedVariant = (this.variant || "").toLowerCase().trim();
    if (VARIANT_VALUES[normalizedVariant]) {
      return normalizedVariant;
    }
    return VARIANT_DEFAULT;
  }

  /**
   * Get the CSS class for the callout container
   */
  get computedClassName() {
    const variantClass =
      VARIANT_VALUES[this._variantKey] || VARIANT_VALUES[VARIANT_DEFAULT];
    let classes = `ontario-callout ontario-callout--typed ${variantClass}`;

    // Add no-heading modifier if no title
    if (!this.title) {
      classes += " ontario-callout--no-heading";
    }

    return classes;
  }

  /**
   * Returns true if this is an info/information callout
   */
  get isInfo() {
    return this._variantKey === "info" || this._variantKey === "information";
  }

  /**
   * Returns true if this is a warning callout
   */
  get isWarning() {
    return this._variantKey === "warning";
  }

  /**
   * Returns true if this is an error callout
   */
  get isError() {
    return this._variantKey === "error";
  }

  /**
   * Returns true if this is a success callout
   */
  get isSuccess() {
    return this._variantKey === "success";
  }

  /**
   * Returns true if title has content
   */
  get hasTitle() {
    return !!this.title;
  }

  /**
   * Returns true if content has content
   */
  get hasContent() {
    return !!this.content;
  }
}
