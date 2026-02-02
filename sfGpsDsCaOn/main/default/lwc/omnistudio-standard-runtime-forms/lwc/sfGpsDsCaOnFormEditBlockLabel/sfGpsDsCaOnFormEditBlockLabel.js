/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptEditBlockLabel from "c/sfGpsDsOsrtOmniscriptEditBlockLabel";
import tmpl from "./sfGpsDsCaOnFormEditBlockLabel.html";

/**
 * @slot EditBlockLabel
 * @description Ontario Design System EditBlock Label for OmniStudio forms.
 * Displays the heading and global actions for an EditBlock.
 *
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses Ontario heading and button styling
 * - WCAG 2.1 AA: Proper heading structure
 */
export default class SfGpsDsCaOnFormEditBlockLabel extends OmniscriptEditBlockLabel {
  /* computed */

  get computedIsH3Heading() {
    return (this._propSetMap.headingLevel || 3) === 3;
  }

  render() {
    return tmpl;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("caon-scope");
  }
}
