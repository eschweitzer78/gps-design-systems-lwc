/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormNumber from "c/sfGpsDsFormNumber";
import tmpl from "./sfGpsDsCaOnFormNumber.html";

/**
 * @slot Number
 * @description Ontario Design System Number input for OmniStudio forms.
 * Extends the base form number class with Ontario DS styling.
 * Uses inputmode="decimal" for proper mobile keyboard.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-input styling via sfGpsDsCaOnTextInput
 * - WCAG 2.1 AA: Proper labeling, error messaging, keyboard support
 */
export default class SfGpsDsCaOnFormNumber extends SfGpsDsFormNumber {
  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdscaon-read-only";
    this.classList.add("caon-scope");
  }
}
