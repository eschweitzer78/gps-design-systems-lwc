/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
const NOTIFICATION_TYPE_VALUES = ["action", "reminder", "status"];
const NOTIFICATION_TYPE_DEFAULT = "action";
/**
 * Notification Card component for Ontario Design System.
 * Displays notification categories with colored headers and unread counts.
 */
export default class SfGpsDsCaOnNotificationCard extends SfGpsDsLwc {
  static renderMode = "light";
  // @ts-ignore
  @api
  heading;
  // @ts-ignore
  @api
  description;
  // @ts-ignore
  @api
  url;
  // @ts-ignore
  @api
  notificationType;
  // @ts-ignore
  @api
  unreadCount;
  // @ts-ignore
  @api
  className;
  /* Computed Properties */
  get normalizedType() {
    if (
      this.notificationType &&
      NOTIFICATION_TYPE_VALUES.includes(this.notificationType)
    ) {
      return this.notificationType;
    }
    return NOTIFICATION_TYPE_DEFAULT;
  }
  get computedClassName() {
    const classes = ["sfgpsdscaon-notification-card"];
    classes.push(`sfgpsdscaon-notification-card--${this.normalizedType}`);
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }
  get computedHeaderClassName() {
    return `sfgpsdscaon-notification-card__header sfgpsdscaon-notification-card__header--${this.normalizedType}`;
  }
  get hasUnread() {
    return (this.unreadCount || 0) > 0;
  }
  get computedUnreadCount() {
    return this.unreadCount || 0;
  }
  get badgeAriaLabel() {
    return `${this.computedUnreadCount} unread ${this.heading || ""} notifications`;
  }
  get computedUrl() {
    return this.url || "#";
  }
  /* Lifecycle */
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
