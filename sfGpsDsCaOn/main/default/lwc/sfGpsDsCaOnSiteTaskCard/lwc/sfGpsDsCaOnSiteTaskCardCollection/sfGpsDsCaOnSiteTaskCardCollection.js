/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnSiteTaskCardCollection";

/**
 * Ontario Design System - Site Task Card Collection Component
 *
 * Manages a collection of Site Task Cards for displaying multiple registration sites.
 * Used in the Stormwater Management Works "Getting Started" page.
 *
 * Features:
 * - Display multiple site cards
 * - Handle remove events
 * - Empty state handling
 */
export default class SfGpsDsCaOnSiteTaskCardCollection extends SfGpsDsLwc {
  static renderMode = "light";

  /**
   * Array of sites with their tasks
   * Format: [{ siteId, siteName, tasks: [{ label, status, statusLabel, url }] }]
   */
  @api
  get sites() {
    return this._sites;
  }
  set sites(val) {
    if (typeof val === "string") {
      try {
        this._sites = JSON.parse(val);
      } catch {
        this.addError("STC-JSON", "Error parsing sites JSON");
        this._sites = [];
      }
    } else {
      this._sites = val || [];
    }
    this._updateDecoratedSites();
  }
  @track _sites = [];

  /**
   * Whether to show the Remove action on cards
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
   * Heading level for site names
   */
  @api headingLevel = "h3";

  /**
   * Additional CSS class
   */
  @api className;

  /* internal */
  @track _decoratedSites = [];

  /* computed */

  get hasSites() {
    return this._decoratedSites && this._decoratedSites.length > 0;
  }

  get decoratedSites() {
    return this._decoratedSites;
  }

  /* methods */

  _updateDecoratedSites() {
    this._decoratedSites = (this._sites || []).map((site, index) => ({
      ...site,
      key: `site-${index}-${site.siteId || index}`
    }));
  }

  /* event handlers */

  handleRemove(event) {
    const { siteId, siteName } = event.detail;

    if (DEBUG) console.log(CLASS_NAME, "handleRemove", siteId, siteName);

    // Re-dispatch the event
    this.dispatchEvent(
      new CustomEvent("siteremove", {
        detail: {
          siteId,
          siteName
        },
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("caon-scope");
    this._updateDecoratedSites();

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }
}
