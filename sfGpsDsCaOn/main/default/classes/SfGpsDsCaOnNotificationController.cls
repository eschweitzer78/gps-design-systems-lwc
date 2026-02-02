/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Controller to fetch notification counts and data for Ontario DS Notification Card.
 *
 * This controller provides a flexible approach to notification aggregation.
 * By default, it queries Tasks to provide notification-like functionality.
 * You can extend or modify this to work with custom notification objects
 * or Salesforce's Custom Notification Types.
 *
 * Notification Types:
 * - action: High-priority Tasks that are overdue or due today
 * - reminder: Tasks due within the next 7 days
 * - status: Tasks updated by others in the last 24 hours
 */
public with sharing class SfGpsDsCaOnNotificationController {
  /**
   * Get notification summary for all types for the current user.
   * @return Map of notification type to NotificationSummary
   */
  @AuraEnabled(cacheable=true)
  public static Map<String, NotificationSummary> getNotificationSummaries() {
    Map<String, NotificationSummary> summaries = new Map<String, NotificationSummary>();

    summaries.put('action', getActionNotifications());
    summaries.put('reminder', getReminderNotifications());
    summaries.put('status', getStatusNotifications());

    return summaries;
  }

  /**
   * Get notification summary for a specific type.
   * @param notificationType The type of notification: action, reminder, or status
   * @return NotificationSummary for the requested type
   */
  @AuraEnabled(cacheable=true)
  public static NotificationSummary getNotificationsByType(
    String notificationType
  ) {
    if (notificationType == null) {
      notificationType = 'action';
    }

    String normalizedType = notificationType.toLowerCase();

    if (normalizedType == 'action') {
      return getActionNotifications();
    } else if (normalizedType == 'reminder') {
      return getReminderNotifications();
    } else if (normalizedType == 'status') {
      return getStatusNotifications();
    } else {
      // Default to action if unknown type
      return getActionNotifications();
    }
  }

  /**
   * Get count of unread notifications for a specific type.
   * @param notificationType The type of notification
   * @return Integer count of unread notifications
   */
  @AuraEnabled(cacheable=true)
  public static Integer getUnreadCount(String notificationType) {
    NotificationSummary summary = getNotificationsByType(notificationType);
    return summary.unreadCount;
  }

  /**
   * Action Notifications: Items requiring immediate user attention.
   * Queries high-priority open Tasks that are overdue or due today.
   */
  private static NotificationSummary getActionNotifications() {
    Id userId = UserInfo.getUserId();
    NotificationSummary summary = new NotificationSummary();
    summary.notificationType = 'action';
    summary.heading = 'Action required';
    summary.description = 'Check messages that need your attention, including requests for more information or additional actions.';

    Integer count = 0;

    // Count high-priority open Tasks that are overdue or due today
    try {
      count = [
        SELECT COUNT()
        FROM Task
        WHERE
          OwnerId = :userId
          AND IsClosed = FALSE
          AND Priority = 'High'
          AND ActivityDate <= TODAY
        WITH USER_MODE
      ];
    } catch (Exception e) {
      // Task object may not be accessible
      count = 0;
    }

    summary.unreadCount = count;
    summary.url = '/notifications?type=action';

    return summary;
  }

  /**
   * Reminder Notifications: Upcoming deadlines and scheduled tasks.
   * Queries Tasks due within the next 7 days.
   */
  private static NotificationSummary getReminderNotifications() {
    Id userId = UserInfo.getUserId();
    NotificationSummary summary = new NotificationSummary();
    summary.notificationType = 'reminder';
    summary.heading = 'Reminders';
    summary.description = 'View reminder notices for upcoming actions, such as renewals, deadlines, and reporting requirements.';

    Date today = Date.today();
    Date nextWeek = today.addDays(7);

    Integer count = 0;
    try {
      count = [
        SELECT COUNT()
        FROM Task
        WHERE
          OwnerId = :userId
          AND IsClosed = FALSE
          AND ActivityDate >= :today
          AND ActivityDate <= :nextWeek
        WITH USER_MODE
      ];
    } catch (Exception e) {
      count = 0;
    }

    summary.unreadCount = count;
    summary.url = '/notifications?type=reminder';

    return summary;
  }

  /**
   * Status Notifications: Updates on items the user is following.
   * Queries recently updated Tasks that the user owns.
   */
  private static NotificationSummary getStatusNotifications() {
    Id userId = UserInfo.getUserId();
    NotificationSummary summary = new NotificationSummary();
    summary.notificationType = 'status';
    summary.heading = 'Status updates';
    summary.description = 'View messages about updates to the status of your applications or requests.';

    Integer count = 0;
    Datetime last24Hours = Datetime.now().addDays(-1);

    try {
      // Count Tasks updated in last 24 hours by someone other than the user
      count = [
        SELECT COUNT()
        FROM Task
        WHERE
          OwnerId = :userId
          AND LastModifiedDate >= :last24Hours
          AND LastModifiedById != :userId
        WITH USER_MODE
      ];
    } catch (Exception e) {
      count = 0;
    }

    summary.unreadCount = count;
    summary.url = '/notifications?type=status';

    return summary;
  }

  /**
   * Inner class representing a notification summary for the Ontario DS Notification Card.
   */
  public class NotificationSummary {
    @AuraEnabled
    public String notificationType;
    @AuraEnabled
    public String heading;
    @AuraEnabled
    public String description;
    @AuraEnabled
    public Integer unreadCount;
    @AuraEnabled
    public String url;
  }
}
