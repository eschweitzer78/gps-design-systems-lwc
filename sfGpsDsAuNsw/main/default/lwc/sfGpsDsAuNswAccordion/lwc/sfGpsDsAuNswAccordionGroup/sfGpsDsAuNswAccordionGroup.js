/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuNswAccordionGroup extends SfGpsDsLwc {
  static renderMode = "light";

  @api showButtons;
  @api isFullyExpanded;
  @api isFullyCollapsed;
  @api className;

  /* deprecated */
  @api content;

  get computedClassName() {
    return computeClass({
      "nsw-accordion": true,
      ready: true,
      [this.className]: this.className
    });
  }

  /* event management */

  handleExpandAll() {
    this.dispatchEvent(new CustomEvent("expandall"));
  }

  handleCollapseAll() {
    this.dispatchEvent(new CustomEvent("collapseall"));
  }
}
