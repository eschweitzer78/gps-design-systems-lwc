/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormStepChart from "c/sfGpsDsFormStepChart";
import tmpl from "./sfGpsDsCaOnFormStepChart.html";

/**
 * @slot StepChart
 * @description Ontario Design System Step Chart component for OmniStudio forms.
 * Displays visual progress indicator for multi-step forms.
 * Uses Ontario DS step indicator web component.
 *
 * Compliance:
 * - LWR: Uses Ontario DS web component with lwc:external
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-step-indicator web component
 * - WCAG 2.1 AA / AODA:
 *   - Progress information accessible to screen readers via live region
 *   - Current step clearly indicated visually and programmatically
 *   - Progress percentage announced on step change
 */
export default class SfGpsDsCaOnFormStepChart extends SfGpsDsFormStepChart {
  /* ========================================
   * PRIVATE PROPERTIES
   * ======================================== */

  /** @type {number} Previous step number for change detection */
  _previousStep = 0;

  /** @type {string} Current progress announcement */
  _progressAnnouncement = "";

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * Calculates the progress percentage for the step indicator.
   * @returns {number} Progress percentage (0-100)
   */
  get computedPercentage() {
    const data = this.calculateStepData(this.jsonDef?.asIndex);
    return data.value;
  }

  /**
   * Determines if back button should be shown.
   * @returns {boolean} True if not on first step
   */
  get computedShowBackButton() {
    return this.sfGpsDsStepIndex > 0;
  }

  /**
   * Generates screen reader announcement for progress changes.
   * AODA: Screen readers should announce progress updates.
   * @returns {string} Progress announcement text
   */
  get progressAnnouncement() {
    return this._progressAnnouncement;
  }

  /**
   * Generates accessible description of progress for screen readers.
   * AODA: Provide text alternative for visual progress indicator.
   * @returns {string} Human-readable progress description
   */
  get accessibleProgressDescription() {
    const currentStep = this.sfGpsDsStepNumber || 1;
    const totalSteps = this.sfGpsDsStepCount || 1;
    const percentage = Math.round(this.computedPercentage);

    return `Step ${currentStep} of ${totalSteps}. ${percentage}% complete.`;
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  /**
   * Announces step progress change to screen readers.
   * @private
   */
  _announceProgress() {
    const currentStep = this.sfGpsDsStepNumber || 1;
    const totalSteps = this.sfGpsDsStepCount || 1;
    const percentage = Math.round(this.computedPercentage);

    this._progressAnnouncement = `Progress: Step ${currentStep} of ${totalSteps}, ${percentage}% complete`;

    // Clear announcement after delay to allow re-announcement on next change
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._progressAnnouncement = "";
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
    this._previousStep = this.sfGpsDsStepNumber || 0;
  }

  /**
   * Announces progress when step changes.
   * AODA: Progress updates should be announced to screen readers.
   */
  renderedCallback() {
    if (super.renderedCallback) {
      super.renderedCallback();
    }

    // Detect step change and announce
    const currentStep = this.sfGpsDsStepNumber || 0;
    if (currentStep !== this._previousStep) {
      this._announceProgress();
      this._previousStep = currentStep;
    }
  }
}
