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
const CLASS_NAME = "SfGpsDsCaOnDecisionExplainerComm";

/**
 * Experience Builder (Community) variant of the Decision Explainer component.
 * 
 * This component provides a configurable wrapper for displaying business rule
 * evaluation results in Experience Cloud sites. It integrates with the
 * DecisionExplainer API to show step-by-step explanations of eligibility
 * determinations following Ontario Design System standards.
 */
export default class SfGpsDsCaOnDecisionExplainerComm extends SfGpsDsLwc {
  static renderMode = "light";

  /* ===== Design Attributes for Experience Builder ===== */

  /**
   * Heading displayed above the results.
   */
  // @ts-ignore
  @api
  heading?: string;

  /**
   * The API name of the expression set to evaluate.
   */
  // @ts-ignore
  @api
  expressionSetApiName?: string;

  /**
   * The Integration Procedure name (Type_SubType format).
   * Use this instead of expressionSetApiName when using OmniStudio.
   */
  // @ts-ignore
  @api
  integrationProcedureName?: string;

  /**
   * JSON string containing input variables for evaluation.
   * Supports merge fields from the page context.
   */
  // @ts-ignore
  @api
  inputVariablesJson?: string;

  /**
   * The evaluation method: 'expressionSet' or 'integrationProcedure'.
   */
  // @ts-ignore
  @api
  evaluationMethod?: string;
  _evaluationMethod = this.defineStringProperty("evaluationMethod", {
    defaultValue: "expressionSet"
  });

  /**
   * Default view mode: 'concise' or 'detailed'.
   */
  // @ts-ignore
  @api
  viewModeDefault?: string;
  _viewModeDefault = this.defineStringProperty("viewModeDefault", {
    defaultValue: "concise"
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
   * Whether to automatically evaluate on component load.
   */
  // @ts-ignore
  @api
  autoEvaluate?: boolean;
  _autoEvaluate = this.defineBooleanProperty("autoEvaluate", {
    defaultValue: false
  });

  /**
   * Whether to show input values in the summary.
   */
  // @ts-ignore
  @api
  showInputs?: boolean;
  _showInputs = this.defineBooleanProperty("showInputs", {
    defaultValue: false
  });

  /**
   * Whether to show output values in the summary.
   */
  // @ts-ignore
  @api
  showOutputs?: boolean;
  _showOutputs = this.defineBooleanProperty("showOutputs", {
    defaultValue: true
  });

  /**
   * Additional CSS classes.
   */
  // @ts-ignore
  @api
  className?: string;

  /* ===== Lifecycle ===== */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
