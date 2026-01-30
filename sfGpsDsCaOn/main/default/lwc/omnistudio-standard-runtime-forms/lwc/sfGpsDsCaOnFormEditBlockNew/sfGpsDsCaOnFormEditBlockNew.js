/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptEditBlockNew from "c/sfGpsDsOsrtOmniscriptEditBlockNew";
import tmpl from "./sfGpsDsCaOnFormEditBlockNew.html";

/**
 * @slot EditBlockNew
 * @description Ontario Design System EditBlock New button for OmniStudio forms.
 * Provides the "Add new" button for creating new EditBlock entries.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses Ontario button styling
 * - WCAG 2.1 AA: Proper button labeling
 */
export default class SfGpsDsCaOnFormEditBlockNew extends OmniscriptEditBlockNew {
  render() {
    return tmpl;
  }

  connectedCallback() {
    super.connectedCallback();

    // Remove SLDS classes
    this.classList.remove(`${this._theme}-large-size_3-of-12`);
    this.classList.remove(`${this._theme}-medium-size_6-of-12`);
    this.classList.remove(`${this._theme}-small-size_1-of-1`);
    this.classList.remove(`${this._theme}-m-bottom_xx-small`);
    this.classList.remove(`${this._theme}-p-right_small`);

    // Add Ontario classes
    this.classList.add(
      "ontario-col-sm-12",
      "ontario-col-md-6",
      "ontario-col-lg-3",
      "ontario-m-right-sm",
      "ontario-m-bottom-sm",
      "caon-scope"
    );
  }
}
