/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// @ts-ignore - Salesforce Apex import
import evaluateExpressionSet from "@salesforce/apex/SfGpsDsCaOnDecisionExplainerController.evaluateExpressionSet";
// @ts-ignore - Salesforce Apex import
import evaluateViaIntegrationProcedure from "@salesforce/apex/SfGpsDsCaOnDecisionExplainerController.evaluateViaIntegrationProcedure";
// @ts-ignore - LWC module import
import { formatUserError, getMessage } from "c/sfGpsDsCaOnUserMessages";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnDecisionExplainer";

export interface StepExplanation {
  stepName: string;
  stepLabel?: string;
  message: string;
  passed: boolean;
  showDetails: boolean;
  sequenceNumber: number;
  details?: Record<string, unknown>;
}

export interface DecisionExplanationResult {
  success: boolean;
  overallResult: "passed" | "failed" | "error";
  overallMessage: string;
  steps: StepExplanation[];
  outputs: Record<string, unknown>;
  errorMessage?: string;
}

export type ViewMode = "concise" | "detailed";
export type EvaluationMethod = "expressionSet" | "integrationProcedure";

const VIEW_MODE_VALUES: ViewMode[] = ["concise", "detailed"];
const VIEW_MODE_DEFAULT: ViewMode = "concise";

const EVALUATION_METHOD_VALUES: EvaluationMethod[] = ["expressionSet", "integrationProcedure"];
const EVALUATION_METHOD_DEFAULT: EvaluationMethod = "expressionSet";

export default class SfGpsDsCaOnDecisionExplainer extends SfGpsDsLwc {
  static renderMode = "light";

  /* ===== API Properties ===== */

  /**
   * The API name of the expression set to evaluate.
   * Required when evaluationMethod is 'expressionSet'.
   */
  // @ts-ignore
  @api
  expressionSetApiName?: string;

  /**
   * The Integration Procedure name (Type_SubType format).
   * Required when evaluationMethod is 'integrationProcedure'.
   */
  // @ts-ignore
  @api
  integrationProcedureName?: string;

  /**
   * Input variables for the expression set evaluation.
   * Can be a JSON string or an object.
   */
  // @ts-ignore
  @api
  inputVariables?: string | Record<string, unknown>;

  /**
   * The evaluation method to use.
   */
  // @ts-ignore
  @api
  evaluationMethod?: EvaluationMethod;
  _evaluationMethod = this.defineEnumProperty<EvaluationMethod>("evaluationMethod", {
    validValues: EVALUATION_METHOD_VALUES,
    defaultValue: EVALUATION_METHOD_DEFAULT
  });

  /**
   * Display mode: 'concise' shows simple step list, 'detailed' shows expandable details.
   */
  // @ts-ignore
  @api
  viewMode?: ViewMode;
  _viewMode = this.defineEnumProperty<ViewMode>("viewMode", {
    validValues: VIEW_MODE_VALUES,
    defaultValue: VIEW_MODE_DEFAULT
  });

  /**
   * Heading text displayed above the results.
   */
  // @ts-ignore
  @api
  heading?: string;

  /**
   * Whether to show the input variables in the summary.
   */
  // @ts-ignore
  @api
  showInputs?: boolean;
  _showInputs = this.defineBooleanProperty("showInputs", {
    defaultValue: false
  });

  /**
   * Whether to show the output values in the summary.
   */
  // @ts-ignore
  @api
  showOutputs?: boolean;
  _showOutputs = this.defineBooleanProperty("showOutputs", {
    defaultValue: true
  });

  /**
   * Whether to automatically evaluate on component load.
   */
  // @ts-ignore
  @api
  autoEvaluate?: boolean;
  _autoEvaluate = this.defineBooleanProperty("autoEvaluate", {
    defaultValue: false
  });

  /**
   * Whether to show the view mode toggle button.
   */
  // @ts-ignore
  @api
  showViewToggle?: boolean;
  _showViewToggle = this.defineBooleanProperty("showViewToggle", {
    defaultValue: true
  });

  /**
   * Additional CSS classes.
   */
  // @ts-ignore
  @api
  className?: string;

  /* ===== Private State ===== */

  _explanation: DecisionExplanationResult | null = null;
  _isLoading = false;
  _error: string | null = null;
  _hasEvaluated = false;

  /* ===== Getters ===== */

  get hasError(): boolean {
    return Boolean(this._error);
  }

  get hasExplanation(): boolean {
    return this._explanation !== null && this._hasEvaluated;
  }

  get isConciseView(): boolean {
    return this._viewMode.value === "concise";
  }

  get isDetailedView(): boolean {
    return this._viewMode.value === "detailed";
  }

  get computedClassName(): string {
    const classes = ["ontario-decision-explainer"];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  get overallResultType(): string {
    if (!this._explanation) return "informational";
    
    switch (this._explanation.overallResult) {
      case "passed":
        return "success";
      case "failed":
        return "warning";
      case "error":
        return "error";
      default:
        return "informational";
    }
  }

  get overallResultHeading(): string {
    if (!this._explanation) return "";
    
    switch (this._explanation.overallResult) {
      case "passed":
        return "Eligible";
      case "failed":
        return "Not Eligible";
      case "error":
        return "Evaluation Error";
      default:
        return "Results";
    }
  }

  get overallResultMessage(): string {
    return this._explanation?.overallMessage || "";
  }

  get computedSteps(): Array<StepExplanation & { 
    id: string; 
    highlightColour: string;
    statusIcon: string;
    calloutClassName: string;
    statusClassName: string;
    statusIconClassName: string;
    statusText: string;
    detailItems: Array<{ key: string; value: string }>;
  }> {
    if (!this._explanation?.steps) return [];

    return this._explanation.steps.map((step, index) => {
      // Convert step details to key-value pairs for display
      const detailItems: Array<{ key: string; value: string }> = [];
      if (step.details) {
        for (const [key, value] of Object.entries(step.details)) {
          detailItems.push({
            key: this.formatLabel(key),
            value: this.formatValue(value)
          });
        }
      }

      return {
        ...step,
        id: `step-${index}`,
        highlightColour: step.passed ? "green" : "gold",
        statusIcon: step.passed ? "check" : "warning",
        calloutClassName: step.passed 
          ? "ontario-callout ontario-callout--passed" 
          : "ontario-callout ontario-callout--failed",
        statusClassName: step.passed 
          ? "ontario-decision-explainer__step-passed" 
          : "ontario-decision-explainer__step-failed",
        statusIconClassName: step.passed
          ? "ontario-decision-explainer__icon ontario-decision-explainer__icon--passed"
          : "ontario-decision-explainer__icon ontario-decision-explainer__icon--failed",
        // Accessible status text for screen readers
        statusText: step.passed ? "Passed:" : "Did not pass:",
        detailItems
      };
    });
  }

  get hasSteps(): boolean {
    return this.computedSteps.length > 0;
  }

  get summaryItems(): Array<{ key: string; value: string }> {
    const items: Array<{ key: string; value: string }> = [];

    // Add outputs to summary
    if (this._showOutputs.value && this._explanation?.outputs) {
      for (const [key, value] of Object.entries(this._explanation.outputs)) {
        items.push({
          key: this.formatLabel(key),
          value: this.formatValue(value)
        });
      }
    }

    return items;
  }

  get hasSummaryItems(): boolean {
    return this.summaryItems.length > 0;
  }

  get inputSummaryItems(): Array<{ key: string; value: string }> {
    if (!this._showInputs.value) return [];

    const inputs = this.parsedInputVariables;
    const items: Array<{ key: string; value: string }> = [];

    for (const [key, value] of Object.entries(inputs)) {
      items.push({
        key: this.formatLabel(key),
        value: this.formatValue(value)
      });
    }

    return items;
  }

  get hasInputSummaryItems(): boolean {
    return this.inputSummaryItems.length > 0;
  }

  get parsedInputVariables(): Record<string, unknown> {
    if (!this.inputVariables) return {};

    if (typeof this.inputVariables === "string") {
      try {
        return JSON.parse(this.inputVariables);
      } catch {
        return {};
      }
    }

    return this.inputVariables;
  }

  get viewToggleLabel(): string {
    return this.isConciseView ? "Show Details" : "Hide Details";
  }

  get showInitialState(): boolean {
    return !this._isLoading && !this.hasError && !this.hasExplanation && !this._autoEvaluate.value;
  }

  get overallAlertClassName(): string {
    const baseClass = "ontario-alert";
    switch (this._explanation?.overallResult) {
      case "passed":
        return `${baseClass} ontario-alert--success`;
      case "failed":
        return `${baseClass} ontario-alert--warning`;
      case "error":
        return `${baseClass} ontario-alert--error`;
      default:
        return `${baseClass} ontario-alert--informational`;
    }
  }

  /**
   * Accessible label for the view toggle button.
   */
  get viewToggleAriaLabel(): string {
    return this.isConciseView 
      ? "Show detailed view with expandable sections" 
      : "Show concise view with summary only";
  }

  /**
   * Screen reader announcement for when results are displayed.
   */
  get screenReaderAnnouncement(): string {
    if (!this._explanation) return "";
    
    const stepCount = this._explanation.steps?.length || 0;
    const passedCount = this._explanation.steps?.filter(s => s.passed).length || 0;
    
    if (this._explanation.overallResult === "passed") {
      return `Eligibility check complete. You are eligible. ${passedCount} of ${stepCount} criteria passed.`;
    } else if (this._explanation.overallResult === "failed") {
      return `Eligibility check complete. You are not eligible. ${passedCount} of ${stepCount} criteria passed.`;
    } else {
      return `Eligibility check encountered an error. ${this._explanation.errorMessage || ""}`;
    }
  }

  /* ===== Public Methods ===== */

  /**
   * Evaluate the expression set and display results.
   */
  // @ts-ignore
  @api
  async evaluate(): Promise<DecisionExplanationResult | null> {
    this._isLoading = true;
    this._error = null;
    this._hasEvaluated = false;

    try {
      const inputJson = typeof this.inputVariables === "string" 
        ? this.inputVariables 
        : JSON.stringify(this.inputVariables || {});

      let result: DecisionExplanationResult;

      if (this._evaluationMethod.value === "integrationProcedure") {
        if (!this.integrationProcedureName) {
          throw new Error("Integration Procedure name is required");
        }
        result = await evaluateViaIntegrationProcedure({
          integrationProcedureName: this.integrationProcedureName,
          inputDataJson: inputJson
        });
      } else {
        if (!this.expressionSetApiName) {
          throw new Error("Expression Set API name is required");
        }
        result = await evaluateExpressionSet({
          expressionSetApiName: this.expressionSetApiName,
          inputVariablesJson: inputJson
        });
      }

      this._explanation = result;
      this._hasEvaluated = true;

      // Dispatch evaluate event
      this.dispatchEvent(new CustomEvent("evaluate", {
        detail: {
          success: result.success,
          result: result
        },
        bubbles: true,
        composed: true
      }));

      return result;

    } catch (error) {
      // Use user-friendly error message for display
      const userFriendlyMessage = formatUserError(error, getMessage("ELIGIBILITY_CHECK_ERROR").message);
      this._error = userFriendlyMessage;

      // Dispatch error event with both user-friendly and technical message
      const technicalMessage = error instanceof Error ? error.message : String(error);
      this.dispatchEvent(new CustomEvent("error", {
        detail: {
          message: userFriendlyMessage,
          technicalMessage: technicalMessage
        },
        bubbles: true,
        composed: true
      }));

      return null;

    } finally {
      this._isLoading = false;
    }
  }

  /**
   * Reset the component to its initial state.
   */
  // @ts-ignore
  @api
  reset(): void {
    this._explanation = null;
    this._isLoading = false;
    this._error = null;
    this._hasEvaluated = false;
  }

  /**
   * Toggle between concise and detailed view modes.
   */
  // @ts-ignore
  @api
  toggleViewMode(): void {
    const newMode: ViewMode = this._viewMode.value === "concise" ? "detailed" : "concise";
    this._viewMode.value = newMode;

    this.dispatchEvent(new CustomEvent("viewmodechange", {
      detail: {
        viewMode: newMode
      },
      bubbles: true,
      composed: true
    }));
  }

  /* ===== Event Handlers ===== */

  handleToggleViewMode(): void {
    this.toggleViewMode();
  }

  handleEvaluateClick(): void {
    this.evaluate();
  }

  /* ===== Helper Methods ===== */

  private formatLabel(key: string): string {
    // Convert camelCase or snake_case to Title Case
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  }

  private formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return "—";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (typeof value === "number") {
      // Format numbers with locale-appropriate formatting
      return value.toLocaleString();
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return String(value);
  }

  /* ===== Lifecycle ===== */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");

    // Auto-evaluate if configured
    if (this._autoEvaluate.value) {
      this.evaluate();
    }
  }
}
