/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

const I18N = {
  expandAll: "Expand all",
  collapseAll: "Collapse all"
};

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswAccordionGroup";

const SHOWBUTTONS_DEFAULT = false;
const ISFULLYEXPANDED_DEFAULT = false;
const ISFULLYCOLLAPSED_DEFAULT = false;

export default 
class SfGpsDsAuNswAccordionGroup 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  showButtons?: boolean;
  _showButtons = this.defineBooleanProperty("showButtons", {
    defaultValue: SHOWBUTTONS_DEFAULT
  });

  // @ts-ignore
  @api 
  isFullyExpanded?: boolean;
  _isFullyExpanded = this.defineBooleanProperty("isFullyExpanded", {
    defaultValue: ISFULLYEXPANDED_DEFAULT
  });

  // @ts-ignore
  @api 
  isFullyCollapsed?: boolean;
  _isFullyCollapsed = this.defineBooleanProperty("isFullyCollapsed", {
    defaultValue: ISFULLYCOLLAPSED_DEFAULT
  });
  

  // @ts-ignore
  @api 
  className?: string;

  /* computed */

  get computedClassName(): any {
    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> get computedClassName"
      );
    }

    const rv = {
      "nsw-accordion": true,
      ready: true,
      [this.className || ""]: !!this.className
    };

    if (DEBUG) console.debug(CLASS_NAME, "> get computedClassName", JSON.stringify(rv));
    return rv;
  }

  get i18n(): object {
    return I18N;
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleExpandAll(
    _event: MouseEvent
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleExpandAll");
    /* we do not change the internal state, this is a request to the parent */
    this.dispatchEvent(new CustomEvent("expandall"));
    if (DEBUG) console.debug(CLASS_NAME, "< handleExpandAll");
  }

  // eslint-disable-next-line no-unused-vars
  handleCollapseAll(
    _event: MouseEvent
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleCollapseAll");
    /* we do not change the internal state, this is a request to the parent */
    this.dispatchEvent(new CustomEvent("collapseall"));
    if (DEBUG) console.debug(CLASS_NAME, "< handleCollapseAll");
  }

  /* deprecated */

  // @ts-ignore
  @api 
  content: any;
}
