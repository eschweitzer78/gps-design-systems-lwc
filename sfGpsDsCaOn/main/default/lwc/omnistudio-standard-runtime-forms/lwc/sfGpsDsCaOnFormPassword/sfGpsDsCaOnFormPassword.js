/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormPassword from "c/sfGpsDsFormPassword";
import tmpl from "./sfGpsDsCaOnFormPassword.html";

/**
 * @slot Password
 * @description Ontario Design System Password input for OmniStudio forms.
 * Extends the base form password class with Ontario DS styling.
 * Uses type="password" for secure input masking.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-input styling via sfGpsDsCaOnTextInput
 * - WCAG 2.1 AA: Proper labeling, error messaging, keyboard support
 */
export default class SfGpsDsCaOnFormPassword extends SfGpsDsFormPassword {
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
