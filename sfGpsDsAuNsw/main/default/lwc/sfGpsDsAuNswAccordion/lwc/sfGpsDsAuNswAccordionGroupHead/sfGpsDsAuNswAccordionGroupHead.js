/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

export default class sfGpsDsAuNswAccordionGroupHead extends LightningElement {
  static renderMode = "light";

  @api showButtons;
  @api expandAllLabel;
  @api collapseAllLabel;

  /* api: isFullyExpanded */

  _isFullyExpandedOriginal;
  _isFullyExpanded;

  @api
  get isFullyExpanded() {
    return this._isFullyExpandedOriginal;
  }

  set isFullyExpanded(value) {
    this._isFullyExpandedOriginal = value;
    this._isFullyExpanded = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: isFullyCollapsed */

  _isFullyCollapsedOriginal;
  _isFullyCollapsed;

  @api
  get isFullyCollapsed() {
    return this._isFullyCollapsedOriginal;
  }

  set isFullyCollapsed(value) {
    this._isFullyCollapsedOriginal = value;
    this._isFullyCollapsed = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* event management */

  handleCollapseAll() {
    this.dispatchEvent(new CustomEvent("collapseall"));
  }

  handleExpandAll() {
    this.dispatchEvent(new CustomEvent("expandall"));
  }
}
