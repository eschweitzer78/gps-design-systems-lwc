/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnActivityStatusCard";

/**
 * Ontario Design System - Activity Status Card Component
 *
 * Displays an activity/application status card with:
 * - Activity type name and remove action
 * - Business name and registration site fields
 * - Progress indicator (steps completed)
 * - Start/Continue action button
 *
 * Designed to work with Salesforce Public Sector Solutions
 * BusinessLicenseApplication records.
 *
 * @see https://developer.salesforce.com/docs/atlas.en-us.psc_api.meta/psc_api/sforce_api_objects_businesslicenseapplication.htm
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Follows card patterns
 * - WCAG 2.1 AA: Proper headings, keyboard accessible
 */
export default class SfGpsDsCaOnActivityStatusCard extends LightningElement {
  static renderMode = "light";

  /**
   * Unique record ID (e.g., BusinessLicenseApplication.Id)
   */
  @api recordId;

  /**
   * Activity type name (e.g., "Air emissions")
   */
  @api activityName;

  /**
   * Business/Account name
   */
  @api businessName;

  /**
   * Registration site name(s)
   */
  @api registrationSites;

  /**
   * Number of completed steps
   */
  @api stepsCompleted = 0;

  /**
   * Total number of steps
   */
  @api totalSteps = 0;

  /**
   * URL to navigate to when Start/Continue is clicked
   */
  @api actionUrl;

  /**
   * Whether the remove action is allowed (default: true via getter)
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
   * Heading level for accessibility
   */
  @api headingLevel = "h3";

  /**
   * Additional CSS class
   */
  @api className;

  /* computed */

  get computedCardClassName() {
    return computeClass({
      "sfgpsdscaon-activity-status-card": true,
      [this.className]: this.className
    });
  }

  get hasBusinessName() {
    return Boolean(this.businessName);
  }

  get hasRegistrationSites() {
    return Boolean(this.registrationSites);
  }

  get progressText() {
    return `${this.stepsCompleted} out of ${this.totalSteps} steps completed`;
  }

  get progressPercentage() {
    if (this.totalSteps === 0) return 0;
    return Math.round((this.stepsCompleted / this.totalSteps) * 100);
  }

  get isNotStarted() {
    return this.stepsCompleted === 0;
  }

  get isInProgress() {
    return this.stepsCompleted > 0 && this.stepsCompleted < this.totalSteps;
  }

  get isComplete() {
    return this.stepsCompleted >= this.totalSteps && this.totalSteps > 0;
  }

  get statusIconClass() {
    if (this.isComplete)
      return "sfgpsdscaon-activity-status-card__status-icon--complete";
    if (this.isNotStarted)
      return "sfgpsdscaon-activity-status-card__status-icon--not-started";
    return "sfgpsdscaon-activity-status-card__status-icon--in-progress";
  }

  get actionButtonLabel() {
    if (this.isComplete) return "View";
    if (this.isInProgress) return "Continue";
    return "Start";
  }

  get isH2() {
    return this.headingLevel === "h2";
  }

  get isH3() {
    return this.headingLevel === "h3";
  }

  get isH4() {
    return this.headingLevel === "h4";
  }

  get removeAriaLabel() {
    return `Remove ${this.activityName || "activity"} from registration`;
  }

  /* event handlers */

  handleRemove(event) {
    event.preventDefault();

    if (DEBUG) console.log(CLASS_NAME, "handleRemove", this.recordId);

    this.dispatchEvent(
      new CustomEvent("remove", {
        detail: {
          recordId: this.recordId,
          activityName: this.activityName
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleAction(event) {
    if (DEBUG)
      console.log(CLASS_NAME, "handleAction", this.recordId, this.actionUrl);

    this.dispatchEvent(
      new CustomEvent("action", {
        detail: {
          recordId: this.recordId,
          activityName: this.activityName,
          actionUrl: this.actionUrl
        },
        bubbles: true,
        composed: true
      })
    );

    // If URL provided and not handled by parent, navigate
    if (this.actionUrl && !event.defaultPrevented) {
      // Navigation will be handled by parent or NavigationMixin
    }
  }

  /* lifecycle */

  connectedCallback() {
    this.classList.add("caon-scope");

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this.recordId);
  }
}
