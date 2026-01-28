/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

type NotificationType = "action" | "reminder" | "status";

const NOTIFICATION_TYPE_VALUES: NotificationType[] = ["action", "reminder", "status"];
const NOTIFICATION_TYPE_DEFAULT: NotificationType = "action";

/**
 * Notification Card component for Ontario Design System.
 * Displays notification categories with colored headers and unread counts.
 */
export default class SfGpsDsCaOnNotificationCard extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  heading?: string;

  // @ts-ignore
  @api
  description?: string;

  // @ts-ignore
  @api
  url?: string;

  // @ts-ignore
  @api
  notificationType?: string;

  // @ts-ignore
  @api
  unreadCount?: number;

  // @ts-ignore
  @api
  className?: string;

  /* Computed Properties */

  get normalizedType(): NotificationType {
    if (this.notificationType && NOTIFICATION_TYPE_VALUES.includes(this.notificationType as NotificationType)) {
      return this.notificationType as NotificationType;
    }
    return NOTIFICATION_TYPE_DEFAULT;
  }

  get computedClassName(): string {
    const classes = ["sfgpsdscaon-notification-card"];
    classes.push(`sfgpsdscaon-notification-card--${this.normalizedType}`);
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  get computedHeaderClassName(): string {
    return `sfgpsdscaon-notification-card__header sfgpsdscaon-notification-card__header--${this.normalizedType}`;
  }

  get hasUnread(): boolean {
    return (this.unreadCount || 0) > 0;
  }

  get computedUnreadCount(): number {
    return this.unreadCount || 0;
  }

  get badgeAriaLabel(): string {
    return `${this.computedUnreadCount} unread ${this.heading || ""} notifications`;
  }

  get computedUrl(): string {
    return this.url || "#";
  }

  /* Lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
