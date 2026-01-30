/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormStep from "c/sfGpsDsFormStep";
import tmpl from "./sfGpsDsCaOnFormStep.html";

/**
 * @slot Step
 * @description Ontario Design System Step component for OmniStudio forms.
 * Provides step container with navigation buttons (Previous, Next, Save).
 * Uses Ontario DS button styling.
 *
 * Compliance:
 * - LWR: Uses slot for step content
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses Ontario button styling
 * - WCAG 2.1 AA / AODA:
 *   - Skip link for keyboard users to bypass form content
 *   - Step heading with focus management on step change
 *   - Screen reader announcement for step changes
 *   - Error summary for validation failures
 *   - Keyboard accessible navigation
 */
export default class SfGpsDsCaOnFormStep extends SfGpsDsFormStep {
  /* ========================================
   * PRIVATE PROPERTIES
   * ======================================== */

  /** @type {boolean} Tracks if heading has been focused for this step */
  _headingFocused = false;

  /** @type {boolean} Tracks if skip link is visible */
  _skipLinkVisible = false;

  /** @type {string} Current step announcement for screen readers */
  _stepAnnouncement = "";

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * Determines if navigation section should be shown.
   * @returns {boolean} True if any navigation button is visible
   */
  get computedShowSep() {
    return this.showNext || this.showPrev || this.showSave;
  }

  /**
   * Generates accessible label for the step region.
   * @returns {string} Accessible label combining step number and title
   */
  get stepAriaLabel() {
    const label = this.mergedLabel || "Step";
    return `${label} - Form section`;
  }

  /**
   * Generates announcement text for screen readers when step changes.
   * @returns {string} Announcement text
   */
  get stepAnnouncement() {
    return this._stepAnnouncement;
  }

  /**
   * Checks if there are validation errors in the current step.
   * Looks for OmniScript validation state.
   * @returns {boolean} True if validation errors exist
   */
  get hasValidationErrors() {
    // Check if OmniScript has reported validation errors for this step
    // This integrates with OmniScript's validation framework
    try {
      const childElements = this.querySelectorAll("[data-omni-input]");
      for (const el of childElements) {
        if (
          el.classList?.contains("slds-has-error") ||
          el.classList?.contains("nds-has-error") ||
          el.getAttribute("aria-invalid") === "true"
        ) {
          return true;
        }
      }
    } catch {
      // Fail silently - validation check is a progressive enhancement
    }
    return false;
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Handles Next button click.
   * Uses dispatchOmniEventUtil for proper OmniScript event handling in LWR.
   * @param {Event} e - Click event
   */
  handleNext(e) {
    e.stopPropagation();

    this.disabledButtons = true;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.disabledButtons = false;
    }, 1000);

    // Use dispatchOmniEventUtil for proper OmniScript integration
    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(
        this,
        { moveToStep: "next" },
        "omniautoadvance"
      );
    } else {
      // Fallback for non-OmniScript contexts
      this.dispatchEvent(
        new CustomEvent("omniautoadvance", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: { moveToStep: "next" }
        })
      );
    }
  }

  /**
   * Handles Back button click.
   * Uses dispatchOmniEventUtil for proper OmniScript event handling in LWR.
   * @param {Event} e - Click event
   */
  handleBack(e) {
    e.stopPropagation();

    this.disabledButtons = true;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.disabledButtons = false;
    }, 1000);

    // Use dispatchOmniEventUtil for proper OmniScript integration
    if (typeof this.dispatchOmniEventUtil === "function") {
      this.dispatchOmniEventUtil(
        this,
        { moveToStep: "previous" },
        "omniautoadvance"
      );
    } else {
      // Fallback for non-OmniScript contexts
      this.dispatchEvent(
        new CustomEvent("omniautoadvance", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: { moveToStep: "previous" }
        })
      );
    }
  }

  /**
   * Handles skip link focus - makes it visible.
   * AODA: Skip links should be visible when focused.
   */
  handleSkipLinkFocus() {
    this._skipLinkVisible = true;
    const skipLink = this.querySelector(".sfgpsdscaon-step__skip-link");
    if (skipLink) {
      skipLink.classList.add("sfgpsdscaon-step__skip-link--visible");
    }
  }

  /**
   * Handles skip link blur - hides it again.
   */
  handleSkipLinkBlur() {
    this._skipLinkVisible = false;
    const skipLink = this.querySelector(".sfgpsdscaon-step__skip-link");
    if (skipLink) {
      skipLink.classList.remove("sfgpsdscaon-step__skip-link--visible");
    }
  }

  /* ========================================
   * PUBLIC METHODS
   * ======================================== */

  /**
   * Moves focus to the error summary region.
   * Called after validation fails to help screen reader users.
   * AODA: Focus should move to error summary on validation failure.
   */
  focusErrorSummary() {
    const errorSummary = this.querySelector(".sfgpsdscaon-step__error-summary");
    if (errorSummary) {
      errorSummary.focus();
    }
  }

  /**
   * Announces step change to screen readers.
   * @param {string} message - Message to announce
   */
  announceStepChange(message) {
    this._stepAnnouncement = message;
    // Clear announcement after a delay to allow re-announcement
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._stepAnnouncement = "";
    }, 1000);
  }

  /* ========================================
   * LIFECYCLE HOOKS
   * ======================================== */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.classList.add("caon-scope");

    // Announce step change for screen readers
    if (this.mergedLabel) {
      this.announceStepChange(`Now on step: ${this.mergedLabel}`);
    }
  }

  /**
   * Focus the step heading when rendered for accessibility.
   * AODA: Focus should move to new content when page/section changes.
   */
  renderedCallback() {
    if (super.renderedCallback) {
      super.renderedCallback();
    }

    // Focus step heading for screen reader announcement
    const heading = this.querySelector(".sfgpsdscaon-step__heading");
    if (heading && !this._headingFocused) {
      // Use setTimeout to ensure DOM is ready
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        heading.focus();
      }, 100);
      this._headingFocused = true;
    }

    // Check for validation errors and focus error summary if present
    if (this.hasValidationErrors && !this._errorFocused) {
      this.focusErrorSummary();
      this._errorFocused = true;
    } else if (!this.hasValidationErrors) {
      this._errorFocused = false;
    }
  }
}
