/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnStepIndicator";

export default class SfGpsDsCaOnStepIndicator extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api
  currentStep?: number;

  // @ts-ignore
  @api
  numberOfSteps?: number;

  // @ts-ignore
  @api
  percentageComplete?: number;

  // @ts-ignore
  @api
  showBackButton?: boolean;
  _showBackButton = this.defineBooleanProperty("showBackButton", {
    defaultValue: true
  });

  // @ts-ignore
  @api
  backButtonUrl?: string;

  // @ts-ignore
  @api
  language?: string;

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedShowBackButton(): boolean {
    return this._showBackButton.value;
  }

  /* event handlers */

  handleBackClick(event: Event) {
    // Dispatch custom event for back button click
    this.dispatchEvent(
      new CustomEvent("backclick", {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
