/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";

/**
 * @slot FormFormReviewDiagnostics
 * @description Diagnostic panel for FormReview component troubleshooting.
 * Shows schema validation results, version detection, warnings, and data structure.
 *
 * This component is only rendered when debugPanel: true is set in the
 * FormReview configuration or when ?formReviewDebug=true URL parameter is present.
 *
 * ## Usage
 * This component is automatically rendered by sfGpsDsCaOnFormFormReview
 * when debug mode is enabled. It can also be used standalone for testing.
 */
export default class SfGpsDsCaOnFormFormReviewDiagnostics extends LightningElement {
  /**
   * Diagnostic data from parent FormReview component
   * @type {Object}
   */
  @api diagnosticData;

  /**
   * Whether the panel is expanded
   * @type {boolean}
   */
  @track _isExpanded = true;

  /**
   * Which section is currently expanded
   * @type {string}
   */
  @track _expandedSection = "warnings";

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  /**
   * Get panel title with version info
   * @returns {string}
   */
  get panelTitle() {
    return "FormReview Diagnostic Panel";
  }

  /**
   * Get version display string
   * @returns {string}
   */
  get versionDisplay() {
    return this.diagnosticData?.version || "Unknown";
  }

  /**
   * Get schema status display
   * @returns {string}
   */
  get schemaStatus() {
    return this.diagnosticData?.schemaStatus || "Unknown";
  }

  /**
   * Get schema status class
   * @returns {string}
   */
  get schemaStatusClass() {
    const status = this.diagnosticData?.schemaStatus;
    if (status === "Valid") return "status-valid";
    if (status === "Invalid") return "status-invalid";
    return "status-unknown";
  }

  /**
   * Whether there are warnings to display
   * @returns {boolean}
   */
  get hasWarnings() {
    return (
      this.diagnosticData?.warnings && this.diagnosticData.warnings.length > 0
    );
  }

  /**
   * Get warnings list
   * @returns {Array}
   */
  get warnings() {
    return (this.diagnosticData?.warnings || []).map((w, idx) => ({
      ...w,
      id: `warning-${idx}`,
      contextDisplay: w.context ? JSON.stringify(w.context, null, 2) : ""
    }));
  }

  /**
   * Get warning count
   * @returns {number}
   */
  get warningCount() {
    return this.diagnosticData?.warnings?.length || 0;
  }

  /**
   * Whether there are errors to display
   * @returns {boolean}
   */
  get hasErrors() {
    return this.diagnosticData?.errors && this.diagnosticData.errors.length > 0;
  }

  /**
   * Get errors list
   * @returns {Array}
   */
  get errors() {
    return (this.diagnosticData?.errors || []).map((e, idx) => ({
      ...e,
      id: `error-${idx}`,
      contextDisplay: e.context ? JSON.stringify(e.context, null, 2) : ""
    }));
  }

  /**
   * Get statistics
   * @returns {Object}
   */
  get stats() {
    return this.diagnosticData?.stats || {};
  }

  /**
   * Get data structure summary
   * @returns {Array}
   */
  get dataStructure() {
    return (this.diagnosticData?.dataStructure || []).map((s, idx) => ({
      ...s,
      id: `step-${idx}`,
      statusClass: s.isActive ? "step-active" : "step-inactive",
      statusLabel: s.isActive ? "Active" : "Ghost Data"
    }));
  }

  /**
   * Whether there is data structure to display
   * @returns {boolean}
   */
  get hasDataStructure() {
    return this.dataStructure && this.dataStructure.length > 0;
  }

  /**
   * Get recent logs
   * @returns {Array}
   */
  get recentLogs() {
    return (this.diagnosticData?.recentLogs || [])
      .slice(-10)
      .reverse()
      .map((log, idx) => ({
        ...log,
        id: `log-${idx}`,
        levelClass: `log-${log.level?.toLowerCase() || "info"}`,
        contextDisplay: log.context ? JSON.stringify(log.context, null, 2) : ""
      }));
  }

  /**
   * Whether there are logs to display
   * @returns {boolean}
   */
  get hasLogs() {
    return this.recentLogs && this.recentLogs.length > 0;
  }

  /**
   * Get fallbacks used count
   * @returns {number}
   */
  get fallbacksUsed() {
    return this.diagnosticData?.fallbacksUsed || 0;
  }

  /**
   * Check if warnings section is expanded
   * @returns {boolean}
   */
  get isWarningsExpanded() {
    return this._expandedSection === "warnings";
  }

  /**
   * Get warnings section icon
   * @returns {string}
   */
  get warningsSectionIcon() {
    return this._expandedSection === "warnings" ? "▼" : "▶";
  }

  /**
   * Check if data structure section is expanded
   * @returns {boolean}
   */
  get isDataStructureExpanded() {
    return this._expandedSection === "dataStructure";
  }

  /**
   * Get data structure section icon
   * @returns {string}
   */
  get dataStructureSectionIcon() {
    return this._expandedSection === "dataStructure" ? "▼" : "▶";
  }

  /**
   * Check if logs section is expanded
   * @returns {boolean}
   */
  get isLogsExpanded() {
    return this._expandedSection === "logs";
  }

  /**
   * Get logs section icon
   * @returns {string}
   */
  get logsSectionIcon() {
    return this._expandedSection === "logs" ? "▼" : "▶";
  }

  /**
   * Get expand/collapse icon
   * @returns {string}
   */
  get expandCollapseIcon() {
    return this._isExpanded ? "▼" : "▶";
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  /**
   * Toggle panel expansion
   */
  handleTogglePanel() {
    this._isExpanded = !this._isExpanded;
  }

  /**
   * Handle section toggle
   * @param {Event} event
   */
  handleSectionToggle(event) {
    const section = event.currentTarget.dataset.section;
    if (this._expandedSection === section) {
      this._expandedSection = null;
    } else {
      this._expandedSection = section;
    }
  }

  /**
   * Handle copy diagnostics to clipboard
   */
  handleCopyDiagnostics() {
    const diagnosticText = JSON.stringify(this.diagnosticData, null, 2);

    // Use clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(diagnosticText).then(
        () => {
          this.dispatchEvent(
            new CustomEvent("copied", {
              detail: { success: true }
            })
          );
        },
        () => {
          this._fallbackCopy(diagnosticText);
        }
      );
    } else {
      this._fallbackCopy(diagnosticText);
    }
  }

  /**
   * Fallback copy method for browsers without clipboard API
   * @param {string} text
   * @private
   */
  _fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      this.dispatchEvent(
        new CustomEvent("copied", {
          detail: { success: true }
        })
      );
    } catch {
      this.dispatchEvent(
        new CustomEvent("copied", {
          detail: { success: false }
        })
      );
    }

    document.body.removeChild(textArea);
  }

  /**
   * Handle clear logs
   */
  handleClearLogs() {
    this.dispatchEvent(new CustomEvent("clearlogs"));
  }

  /**
   * Handle close panel
   */
  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
