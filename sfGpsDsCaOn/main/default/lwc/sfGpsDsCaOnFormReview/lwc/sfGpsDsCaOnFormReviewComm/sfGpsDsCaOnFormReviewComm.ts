/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnFormReviewComm";

/**
 * Ontario Design System Form Review Component - Experience Builder Wrapper
 * 
 * This component exposes the Form Review pattern for use in Experience Builder.
 * It accepts JSON configuration for sections and provides property editors
 * for Experience Builder configuration.
 * 
 * @see https://designsystem.ontario.ca/components/detail/form-review.html
 */
export default class SfGpsDsCaOnFormReviewComm extends SfGpsDsLwc {
  static renderMode = "light";

  /**
   * Page heading displayed at the top of the review
   */
  // @ts-ignore
  @api
  heading?: string;

  /**
   * Instructional subheading text
   */
  // @ts-ignore
  @api
  subheading?: string;

  /**
   * JSON array of sections to display
   * Each section should have: heading, headingActionLabel, headingActionUrl, items, ratio
   */
  // @ts-ignore
  @api
  sectionsJson?: string;

  /**
   * Label for the submit button
   */
  // @ts-ignore
  @api
  submitLabel?: string;

  /**
   * Label for the cancel button
   */
  // @ts-ignore
  @api
  cancelLabel?: string;

  /**
   * URL for cancel navigation
   */
  // @ts-ignore
  @api
  cancelUrl?: string;

  /**
   * Show a warning callout before submit button
   */
  // @ts-ignore
  @api
  showSubmitWarning?: boolean;

  /**
   * Warning message to display when showSubmitWarning is true
   */
  // @ts-ignore
  @api
  submitWarningMessage?: string;

  /**
   * Disable the submit button
   */
  // @ts-ignore
  @api
  submitDisabled?: boolean;

  /**
   * Additional CSS classes
   */
  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get parsedSections(): unknown[] | undefined {
    if (!this.sectionsJson) return undefined;

    try {
      const parsed = JSON.parse(this.sectionsJson);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (e) {
      this.addError("FR-JP", "Form review sections JSON is invalid");
      return undefined;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
