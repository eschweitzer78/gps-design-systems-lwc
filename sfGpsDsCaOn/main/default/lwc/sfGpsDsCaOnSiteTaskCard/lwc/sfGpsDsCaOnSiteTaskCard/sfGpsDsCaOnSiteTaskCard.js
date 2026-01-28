/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnSiteTaskCard";

/**
 * Ontario Design System - Site Task Card Component
 *
 * A card displaying a registration site with its associated tasks.
 * Used in the Stormwater Management Works "Getting Started" page.
 *
 * Features:
 * - Site name header with Remove action
 * - Embedded task list
 * - Progress summary (e.g., "0 out of 3 sections")
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Follows card patterns
 * - WCAG 2.1 AA: Proper headings, keyboard accessible, status announcements
 */
export default class SfGpsDsCaOnSiteTaskCard extends LightningElement {
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
   * Array of task items
   * Format: [{ label, hint, status, statusLabel, url }]
   */
  @api
  get tasks() {
    return this._tasks;
  }
  set tasks(val) {
    if (typeof val === "string") {
      try {
        this._tasks = JSON.parse(val);
      } catch (e) {
        console.error(CLASS_NAME, "Error parsing tasks JSON", e);
        this._tasks = [];
      }
    } else {
      this._tasks = val || [];
    }
  }
  @track _tasks = [];

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

  get computedCardClassName() {
    return computeClass({
      "sfgpsdscaon-site-task-card": true,
      [this.className]: this.className
    });
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

  get hasTasks() {
    return this._tasks && this._tasks.length > 0;
  }

  get totalTasks() {
    return this._tasks ? this._tasks.length : 0;
  }

  get completedTasks() {
    if (!this._tasks) return 0;
    return this._tasks.filter(
      (task) => task.status === "complete" || task.status === "completed"
    ).length;
  }

  get progressText() {
    const completed = this.completedTasks;
    const total = this.totalTasks;

    if (completed === 0) {
      return `${completed} out of ${total} sections (Not started)`;
    }
    if (completed === total) {
      return `${completed} out of ${total} sections (Complete)`;
    }
    return `${completed} out of ${total} sections (In progress)`;
  }

  get isNotStarted() {
    return this.completedTasks === 0;
  }

  get isComplete() {
    return this.completedTasks === this.totalTasks && this.totalTasks > 0;
  }

  get progressIconClass() {
    return computeClass({
      "ontario-icon": true,
      "sfgpsdscaon-site-task-card__progress-icon": true,
      "sfgpsdscaon-site-task-card__progress-icon--error": this.isNotStarted,
      "sfgpsdscaon-site-task-card__progress-icon--success": this.isComplete
    });
  }

  get removeAriaLabel() {
    return `Remove ${this.siteName} from registration`;
  }

  get tasksJson() {
    return JSON.stringify(this._tasks);
  }

  /* event handlers */

  handleRemove(event) {
    event.preventDefault();

    if (DEBUG) console.log(CLASS_NAME, "handleRemove", this.siteId);

    this.dispatchEvent(
      new CustomEvent("remove", {
        detail: {
          siteId: this.siteId,
          siteName: this.siteName
        },
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    this.classList.add("caon-scope");

    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this.siteId);
  }
}
