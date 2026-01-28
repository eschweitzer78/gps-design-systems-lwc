/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnAccordionGroupLwr";

export default class SfGpsDsCaOnAccordionGroupLwr extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  name?: string;

  // @ts-ignore
  @api
  showExpandCollapse?: boolean;

  // @ts-ignore
  @api
  expandLabel?: string = "Expand all";

  // @ts-ignore
  @api
  collapseLabel?: string = "Collapse all";

  // @ts-ignore
  @api
  className?: string;

  _allExpanded = false;

  get computedShowExpandCollapse(): boolean {
    return this.showExpandCollapse !== false;
  }

  get expandCollapseLabel(): string {
    return this._allExpanded ? this.collapseLabel : this.expandLabel;
  }

  get ariaExpandedAll(): string {
    return this._allExpanded ? "true" : "false";
  }

  handleExpandCollapseAll(): void {
    this._allExpanded = !this._allExpanded;

    // Dispatch event to child accordions
    this.dispatchEvent(
      new CustomEvent("expandcollapseall", {
        detail: { expanded: this._allExpanded },
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
