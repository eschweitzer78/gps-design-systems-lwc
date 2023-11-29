/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";

export default class sfGpsDsAuNswAccordionGroupHead extends LightningElement {
  static renderMode = "light";

  @api showButtons;
  @api isFullyExpanded;
  @api isFullyCollapsed;
  @api expandAllLabel;
  @api collapseAllLabel;

  /* event management */

  handleCollapseAll() {
    this.dispatchEvent(new CustomEvent("collapseall"));
  }

  handleExpandAll() {
    this.dispatchEvent(new CustomEvent("expandall"));
  }
}
