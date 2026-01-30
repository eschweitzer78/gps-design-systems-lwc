/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { NavigationMixin } from "lightning/navigation";

// Type definitions for Summary List (copied to avoid cross-module dependency)
export interface SummaryListItem {
  key: string;
  value: string;
  changeLabel?: string;
  changeUrl?: string;
}

export type SummaryListRatio = "1-1" | "1-2" | "1-3" | "2-1" | "2-3";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnFormReview";

// Generate unique IDs for ARIA associations
let idCounter = 0;
const generateId = (prefix: string): string => `${prefix}-${++idCounter}`;

/**
 * Interface for a section in the form review
 */
export interface FormReviewSection {
  id?: string;
  heading: string;
  headingActionLabel?: string;
  headingActionUrl?: string;
  items: SummaryListItem[];
  ratio?: SummaryListRatio;
}

/**
 * Ontario Design System Form Review Component
 * 
 * Implements the ODS Form Review pattern for displaying a summary of form responses
 * before submission. Uses multiple Summary List sections with submit/cancel actions.
 * 
 * @see https://designsystem.ontario.ca/components/detail/form-review.html
 */
export default class SfGpsDsCaOnFormReview extends NavigationMixin(SfGpsDsLwc) {
  static renderMode = "light";

  // Unique IDs for ARIA associations (generated per instance)
  private _warningId = generateId("form-review-warning");

  // Status message for screen reader announcements
  // @ts-ignore
  @track
  statusMessage = "";

  /**
   * Page heading displayed at the top of the review
   * e.g., "Review your answers"
   */
  // @ts-ignore
  @api
  heading?: string;

  /**
   * Instructional subheading text
   * e.g., "Please review your answers before submitting"
   */
  // @ts-ignore
  @api
  subheading?: string;

  /**
   * Array of sections to display, each containing a Summary List
   */
  // @ts-ignore
  @api
  sections?: FormReviewSection[] | string;

  /**
   * Label for the submit button
   */
  // @ts-ignore
  @api
  submitLabel?: string;
  _submitLabel = this.defineStringProperty("submitLabel", {
    defaultValue: "Submit"
  });

  /**
   * Label for the cancel button
   */
  // @ts-ignore
  @api
  cancelLabel?: string;
  _cancelLabel = this.defineStringProperty("cancelLabel", {
    defaultValue: "Cancel"
  });

  /**
   * URL for cancel navigation (if not using event-based navigation)
   */
  // @ts-ignore
  @api
  cancelUrl?: string;

  /**
   * Show a warning callout before submit button
   */
  // @ts-ignore
  @api
  showSubmitWarning?: boolean;
  _showSubmitWarning = this.defineBooleanProperty("showSubmitWarning", {
    defaultValue: false
  });

  /**
   * Warning message to display when showSubmitWarning is true
   */
  // @ts-ignore
  @api
  submitWarningMessage?: string;
  _submitWarningMessage = this.defineStringProperty("submitWarningMessage", {
    defaultValue: "Once you submit, you will not be able to make changes."
  });

  /**
   * Disable the submit button
   */
  // @ts-ignore
  @api
  submitDisabled?: boolean;
  _submitDisabled = this.defineBooleanProperty("submitDisabled", {
    defaultValue: false
  });

  /**
   * Additional CSS classes
   */
  // @ts-ignore
  @api
  className?: string;

  /* getters */

  get computedSections(): Array<FormReviewSection & { _id: string }> {
    if (!this.sections) return [];

    let parsedSections: FormReviewSection[];
    if (typeof this.sections === "string") {
      try {
        parsedSections = JSON.parse(this.sections);
      } catch {
        return [];
      }
    } else {
      parsedSections = this.sections;
    }

    return parsedSections.map((section, index) => ({
      ...section,
      _id: section.id || `section-${index}`
    }));
  }

  get hasSections(): boolean {
    return this.computedSections.length > 0;
  }

  get hasHeading(): boolean {
    return Boolean(this.heading);
  }

  get hasSubheading(): boolean {
    return Boolean(this.subheading);
  }

  get hasCancelUrl(): boolean {
    return Boolean(this.cancelUrl);
  }

  get computedClassName(): string {
    const classes = ["ontario-form-review"];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  get computedSubmitDisabled(): boolean {
    return this._submitDisabled.value;
  }

  get computedShowWarning(): boolean {
    return this._showSubmitWarning.value;
  }

  get computedWarningMessage(): string {
    return this._submitWarningMessage.value;
  }

  get computedSubmitLabel(): string {
    return this._submitLabel.value;
  }

  get computedCancelLabel(): string {
    return this._cancelLabel.value;
  }

  /**
   * Unique ID for the warning element (for aria-describedby)
   */
  get warningId(): string {
    return this._warningId;
  }

  /**
   * Returns the warning ID if warning is shown, for aria-describedby on submit button
   */
  get submitAriaDescribedBy(): string | null {
    return this.computedShowWarning ? this._warningId : null;
  }

  /* event handlers */

  handleSubmit(event: Event): void {
    event.preventDefault();
    
    // Announce to screen readers
    this.announceStatus("Submitting your application...");
    
    // Dispatch submit event - parent can handle the actual submission
    this.dispatchEvent(
      new CustomEvent("submit", {
        bubbles: true,
        composed: true
      })
    );

    // Check for OmniScript context and dispatch save event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    
    if (typeof self.dispatchOmniEventUtil === "function") {
      // OmniScript context - dispatch submit/save event
      // The "omnisave" event triggers OmniScript's save action
      self.dispatchOmniEventUtil(
        this,
        {},
        "omnisave"
      );
    }
  }

  handleCancel(event: Event): void {
    event.preventDefault();
    
    // Announce to screen readers
    this.announceStatus("Cancelling...");
    
    // Dispatch cancel event - parent can handle navigation
    this.dispatchEvent(
      new CustomEvent("cancel", {
        bubbles: true,
        composed: true,
        detail: {
          cancelUrl: this.cancelUrl
        }
      })
    );

    // Navigation handling:
    // 1. Check for OmniScript context (dispatchOmniEventUtil)
    // 2. Fall back to NavigationMixin for Experience Cloud
    // 3. Parent component can preventDefault and handle navigation itself
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    
    // Check for OmniScript context
    if (typeof self.dispatchOmniEventUtil === "function") {
      // OmniScript context - dispatch navigation event
      self.dispatchOmniEventUtil(
        this,
        { moveToStep: "previous" },
        "omniautoadvance"
      );
      return;
    }

    // Experience Cloud context - use NavigationMixin if URL is provided
    if (this.cancelUrl) {
      // Check if it's an absolute URL or relative path
      if (this.cancelUrl.startsWith("http")) {
        // External URL - use standard navigation
        self.navigate({
          type: "standard__webPage",
          attributes: {
            url: this.cancelUrl
          }
        });
      } else {
        // Relative URL - use community page navigation
        self.navigate({
          type: "comm__namedPage",
          attributes: {
            name: this.cancelUrl.replace(/^\//, "")
          }
        });
      }
    }
  }

  /**
   * Internal navigation method - wraps NavigationMixin.Navigate
   * Safely handles cases where NavigationMixin is not available (e.g., Jest tests)
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private navigate(pageRef: any): void {
    try {
      // @ts-ignore - NavigationMixin method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav = this[NavigationMixin.Navigate];
      if (typeof nav === "function") {
        nav.call(this, pageRef);
      }
    } catch {
      // Navigation not available (e.g., in test environment)
      console.warn("NavigationMixin.Navigate is not available");
    }
  }

  /**
   * Announce a status message to screen readers via aria-live region
   * @param message - Message to announce
   */
  private announceStatus(message: string): void {
    // Clear and re-set to ensure announcement
    this.statusMessage = "";
    // Use setTimeout to ensure DOM update triggers announcement
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.statusMessage = message;
    }, 100);
  }

  /**
   * Public method to announce custom status (e.g., "Submission complete")
   * Parent components can call this after successful submission
   */
  // @ts-ignore
  @api
  announce(message: string): void {
    this.announceStatus(message);
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
