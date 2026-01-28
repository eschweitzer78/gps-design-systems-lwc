/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormFormula from "c/sfGpsDsFormFormula";
import tmpl from "./sfGpsDsCaOnFormFormula.html";

/**
 * @slot Formula
 * @description Ontario Design System Formula display for OmniStudio forms.
 * Read-only display of calculated values.
 * Extends the base form formula class with Ontario DS styling.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario form styling
 * - WCAG 2.1 AA: Read-only, properly labeled
 */
export default class SfGpsDsCaOnFormFormula extends SfGpsDsFormFormula {
  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.classList.add("caon-scope");
  }
}
