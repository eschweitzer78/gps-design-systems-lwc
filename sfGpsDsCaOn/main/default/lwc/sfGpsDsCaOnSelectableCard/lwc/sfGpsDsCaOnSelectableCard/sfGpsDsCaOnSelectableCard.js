/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, LightningElement } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnSelectableCard";

/**
 * Ontario Design System - Selectable Card Component
 *
 * A card with checkbox, title, description, optional link, badge, and expandable content.
 * Used for service/activity selection interfaces.
 *
 * Compliance:
 * - LWR: Light DOM compatible
 * - LWS: No restricted APIs
 * - Ontario DS: Follows checkbox and card patterns
 * - WCAG 2.1 AA: Proper checkbox labeling, keyboard accessible
 */
export default class SfGpsDsCaOnSelectableCard extends LightningElement {
  static renderMode = "light";

  /**
   * Unique value identifier for this card
   */
  @api value;

  /**
   * Card title/label
   */
  @api label;

  /**
   * Brief description displayed below the title
   */
  @api description;

  /**
   * Link label displayed below the description
   */
  @api linkLabel;

  /**
   * URL for the link
   */
  @api linkUrl;

  /**
   * Extended content shown when "View more" is clicked
   */
  @api expandedContent;

  /**
   * Badge text to display next to the title (e.g., "NEW", "IN PROGRESS")
   */
  @api badge;

  /**
   * Badge variant for color styling
   * Options: success (green), info (blue), warning (yellow), error (red)
   */
  @api badgeVariant = "info";

  /**
   * Whether the card is selected (checked)
   */
  @api checked = false;

  /**
   * Whether the card is disabled
   */
  @api disabled = false;

  /**
   * Name attribute for the checkbox input
   */
  @api name;

  /**
   * Additional CSS class
   */
  @api className;

  /* internal state */
  _isExpanded = false;
  _uniqueId;

  /* computed */

  get computedCardClassName() {
    return computeClass({
      "sfgpsdscaon-selectable-card": true,
      "sfgpsdscaon-selectable-card--selected": this.checked,
      "sfgpsdscaon-selectable-card--disabled": this.disabled,
      [this.className]: this.className
    });
  }

  get hasDescription() {
    return Boolean(this.description);
  }

  get hasLink() {
    return Boolean(this.linkLabel && this.linkUrl);
  }

  get hasBadge() {
    return Boolean(this.badge);
  }

  get computedBadgeClassName() {
    const variant = this.badgeVariant || "info";
    return computeClass({
      "sfgpsdscaon-selectable-card__badge": true,
      [`sfgpsdscaon-selectable-card__badge--${variant}`]: true
    });
  }

  get hasExpandedContent() {
    return Boolean(this.expandedContent);
  }

  get isExpanded() {
    return this._isExpanded;
  }

  get expandButtonLabel() {
    return this._isExpanded ? "View less" : "View more";
  }

  get expandButtonAriaExpanded() {
    return String(this._isExpanded);
  }

  get expandedContentId() {
    return `${this._uniqueId}-expanded`;
  }

  get checkboxId() {
    return `${this._uniqueId}-checkbox`;
  }

  /* event handlers */

  handleCheckboxChange(event) {
    const isChecked = event.target.checked;

    if (DEBUG)
      console.log(CLASS_NAME, "handleCheckboxChange", this.value, isChecked);

    this.dispatchEvent(
      new CustomEvent("select", {
        detail: {
          value: this.value,
          checked: isChecked
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleExpandClick() {
    this._isExpanded = !this._isExpanded;

    if (DEBUG) console.log(CLASS_NAME, "handleExpandClick", this._isExpanded);
  }

  /* lifecycle */

  connectedCallback() {
    this._uniqueId = `selectable-card-${Math.random().toString(36).substring(2, 9)}`;
    this.classList.add("caon-scope");

    if (DEBUG) {
      console.log(CLASS_NAME, "connectedCallback", {
        value: this.value,
        label: this.label,
        description: this.description,
        checked: this.checked,
        expandedContent: this.expandedContent
      });
    }
  }

  renderedCallback() {
    if (DEBUG) {
      console.log(CLASS_NAME, "renderedCallback", {
        value: this.value,
        checked: this.checked,
        hasDescription: this.hasDescription,
        hasExpandedContent: this.hasExpandedContent
      });
    }
  }
}
