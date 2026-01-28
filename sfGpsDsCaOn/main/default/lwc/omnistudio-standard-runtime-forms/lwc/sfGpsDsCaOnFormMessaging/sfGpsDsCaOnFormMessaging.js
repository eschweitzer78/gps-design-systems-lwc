/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMessaging from "c/sfGpsDsFormMessaging";
import tmpl from "./sfGpsDsCaOnFormMessaging.html";

/**
 * @slot Messaging
 * @description Ontario Design System Messaging component for OmniStudio forms.
 * Displays alert messages using Ontario DS page alerts.
 * Supports Success, Requirement (Error), Warning, and Comment (Info) message types.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-page-alert web component
 * - WCAG 2.1 AA: Alert role for screen readers, proper color contrast
 */
export default class SfGpsDsCaOnFormMessaging extends SfGpsDsFormMessaging {
  /* computed */

  /**
   * Maps OmniStudio message types to Ontario DS alert types
   */
  get ontarioAlertType() {
    if (this.isSuccess) return "success";
    if (this.isRequirement) return "error";
    if (this.isWarning) return "warning";
    if (this.isComment) return "informational";
    return "informational";
  }

  get mergedTitleText() {
    return this._propSetMap?.titleText || "";
  }

  get mergedMessageText() {
    return this._propSetMap?.messageText || "";
  }

  get messageText() {
    return this._propSetMap?.messageText;
  }

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
