/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnActivityStatusCardCollection";

/**
 * Ontario Design System - Activity Status Card Collection
 *
 * Grid container for Activity Status Cards.
 * Displays BusinessLicenseApplication records in a responsive grid.
 *
 * @see https://developer.salesforce.com/docs/atlas.en-us.psc_api.meta/psc_api/sforce_api_objects_businesslicenseapplication.htm
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Follows grid patterns
 * - WCAG 2.1 AA: Proper list semantics
 */
export default class SfGpsDsCaOnActivityStatusCardCollection extends SfGpsDsLwc {
  static renderMode = "light";

  /**
   * JSON array of activity records
   * Format: [{ recordId, activityName, businessName, registrationSites, stepsCompleted, totalSteps, actionUrl }]
   */
  @api
  get activities() {
    return this._activities;
  }
  set activities(val) {
    if (typeof val === "string") {
      try {
        this._activities = JSON.parse(val);
      } catch (e) {
        console.error(CLASS_NAME, "Error parsing activities JSON", e);
        this._activities = [];
      }
    } else {
      this._activities = val || [];
    }
  }
  _activities = [];

  /**
   * Number of cards per row on desktop
   */
  @api cardsPerRow = "2";

  /**
   * Whether remove action is allowed (default: true via getter)
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
   * Heading level for card titles
   */
  @api headingLevel = "h3";

  /**
   * Additional CSS class
   */
  @api className;

  /* computed */

  get computedClassName() {
    return computeClass({
      "sfgpsdscaon-activity-status-card-collection": true,
      [`sfgpsdscaon-activity-status-card-collection--${this.cardsPerRow}-per-row`]:
        this.cardsPerRow,
      [this.className]: this.className
    });
  }

  get hasActivities() {
    return this._activities && this._activities.length > 0;
  }

  get decoratedActivities() {
    return (this._activities || []).map((activity, index) => ({
      ...activity,
      key: `activity-${index}-${activity.recordId || index}`
    }));
  }

  /* event handlers */

  handleRemove(event) {
    const { recordId, activityName } = event.detail;

    if (DEBUG) console.log(CLASS_NAME, "handleRemove", recordId);

    this.dispatchEvent(
      new CustomEvent("removeactivity", {
        detail: {
          recordId,
          activityName
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleAction(event) {
    const { recordId, activityName, actionUrl } = event.detail;

    if (DEBUG) console.log(CLASS_NAME, "handleAction", recordId, actionUrl);

    this.dispatchEvent(
      new CustomEvent("activityaction", {
        detail: {
          recordId,
          activityName,
          actionUrl
        },
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }
}
