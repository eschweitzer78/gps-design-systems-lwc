/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const I18N = {
  expandAll: "Expand all",
  collapseAll: "Collapse all"
};

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api showButtons;
  @api isFullyExpanded;
  @api isFullyCollapsed;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "nsw-accordion": true,
      ready: true,
      [this.className]: this.className
    };
  }

  get i18n() {
    return I18N;
  }

  /* event management */

  handleExpandAll() {
    /* we do not change the internal state, this is a request to the parent */
    this.dispatchEvent(new CustomEvent("expandall"));
  }

  handleCollapseAll() {
    /* we do not change the internal state, this is a request to the parent */
    this.dispatchEvent(new CustomEvent("collapseall"));
  }

  /* deprecated */

  @api content;
}
