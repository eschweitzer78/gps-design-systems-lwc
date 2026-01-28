/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnSiteTaskCardComm";

/**
 * Ontario Design System - Site Task Card Component (Experience Builder)
 *
 * A card displaying a registration site with its associated tasks.
 * Used in the Stormwater Management Works "Getting Started" page.
 *
 * Features:
 * - Site name header with Remove action
 * - Embedded task list
 * - Progress summary (e.g., "0 out of 3 sections")
 */
export default class SfGpsDsCaOnSiteTaskCardComm extends SfGpsDsLwc {
  static renderMode = "light";

  /**
   * Unique identifier for this site
   */
  @api siteId;

  /**
   * Site name/identifier displayed in header
   */
  @api siteName;

  /**
   * JSON string of task items
   * Format: [{ label, hint, status, statusLabel, url }]
   */
  @api tasksJson;

  /**
   * Whether to show the Remove action
   */
  @api
  get allowRemove() {
    return this._allowRemove !== false;
  }
  set allowRemove(val) {
    this._allowRemove = val;
  }
  _allowRemove;

  /**
   * Heading level for the site name
   */
  @api headingLevel = "h3";

  /**
   * Additional CSS class
   */
  @api className;

  /* computed */

  get parsedTasks() {
    if (!this.tasksJson) return [];
    if (typeof this.tasksJson === "string") {
      try {
        return JSON.parse(this.tasksJson);
      } catch {
        this.addError("ST-JSON", "Error parsing tasks JSON");
        return [];
      }
    }
    return Array.isArray(this.tasksJson) ? this.tasksJson : [];
  }

  /* event handlers */

  handleRemove(event) {
    if (DEBUG) console.log(CLASS_NAME, "handleRemove", event.detail);

    // Re-dispatch the event
    this.dispatchEvent(
      new CustomEvent("remove", {
        detail: event.detail,
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("caon-scope");

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }
}
