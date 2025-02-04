/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const FULLYEXPANDED_DEFAULT = false;
const FULLYCOLLAPSED_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api showButtons;
  @api expandAllLabel;
  @api collapseAllLabel;

  /* api: isFullyExpanded */

  _isFullyExpanded = FULLYEXPANDED_DEFAULT;
  _isFullyExpandedOriginal = FULLYEXPANDED_DEFAULT;

  @api
  get isFullyExpanded() {
    return this._isFullyExpandedOriginal;
  }

  set isFullyExpanded(value) {
    this._isFullyExpandedOriginal = value;
    this._isFullyExpanded = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FULLYEXPANDED_DEFAULT
    });
  }

  /* api: isFullyCollapsed */

  _isFullyCollapsed = FULLYCOLLAPSED_DEFAULT;
  _isFullyCollapsedOriginal = FULLYCOLLAPSED_DEFAULT;

  @api
  get isFullyCollapsed() {
    return this._isFullyCollapsedOriginal;
  }

  set isFullyCollapsed(value) {
    this._isFullyCollapsedOriginal = value;
    this._isFullyCollapsed = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FULLYCOLLAPSED_DEFAULT
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
