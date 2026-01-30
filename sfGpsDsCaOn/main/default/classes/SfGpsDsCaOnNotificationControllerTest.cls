/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
@isTest
private class SfGpsDsCaOnNotificationControllerTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test Tasks
        List<Task> tasks = new List<Task>();
        
        // High priority task due today (action)
        tasks.add(new Task(
            Subject = 'High Priority Task',
            Status = 'Not Started',
            Priority = 'High',
            ActivityDate = Date.today()
        ));
        
        // Task due in 3 days (reminder)
        tasks.add(new Task(
            Subject = 'Upcoming Task',
            Status = 'Not Started',
            Priority = 'Normal',
            ActivityDate = Date.today().addDays(3)
        ));
        
        // Completed task
        tasks.add(new Task(
            Subject = 'Completed Task',
            Status = 'Completed',
            Priority = 'Normal',
            ActivityDate = Date.today().addDays(-1)
        ));
        
        insert tasks;
    }
    
    @isTest
    static void testGetNotificationSummaries() {
        Test.startTest();
        Map<String, SfGpsDsCaOnNotificationController.NotificationSummary> summaries = 
            SfGpsDsCaOnNotificationController.getNotificationSummaries();
        Test.stopTest();
        
        System.assertNotEquals(null, summaries, 'Summaries should not be null');
        System.assert(summaries.containsKey('action'), 'Should contain action type');
        System.assert(summaries.containsKey('reminder'), 'Should contain reminder type');
        System.assert(summaries.containsKey('status'), 'Should contain status type');
    }
    
    @isTest
    static void testGetNotificationsByType_Action() {
        Test.startTest();
        SfGpsDsCaOnNotificationController.NotificationSummary summary = 
            SfGpsDsCaOnNotificationController.getNotificationsByType('action');
        Test.stopTest();
        
        System.assertNotEquals(null, summary, 'Summary should not be null');
        System.assertEquals('action', summary.notificationType, 'Type should be action');
        System.assertEquals('Action required', summary.heading, 'Heading should match');
        System.assert(summary.unreadCount >= 0, 'Count should be non-negative');
    }
    
    @isTest
    static void testGetNotificationsByType_Reminder() {
        Test.startTest();
        SfGpsDsCaOnNotificationController.NotificationSummary summary = 
            SfGpsDsCaOnNotificationController.getNotificationsByType('reminder');
        Test.stopTest();
        
        System.assertNotEquals(null, summary, 'Summary should not be null');
        System.assertEquals('reminder', summary.notificationType, 'Type should be reminder');
        System.assertEquals('Reminders', summary.heading, 'Heading should match');
    }
    
    @isTest
    static void testGetNotificationsByType_Status() {
        Test.startTest();
        SfGpsDsCaOnNotificationController.NotificationSummary summary = 
            SfGpsDsCaOnNotificationController.getNotificationsByType('status');
        Test.stopTest();
        
        System.assertNotEquals(null, summary, 'Summary should not be null');
        System.assertEquals('status', summary.notificationType, 'Type should be status');
        System.assertEquals('Status updates', summary.heading, 'Heading should match');
    }
    
    @isTest
    static void testGetNotificationsByType_Null() {
        Test.startTest();
        SfGpsDsCaOnNotificationController.NotificationSummary summary = 
            SfGpsDsCaOnNotificationController.getNotificationsByType(null);
        Test.stopTest();
        
        System.assertNotEquals(null, summary, 'Summary should not be null');
        System.assertEquals('action', summary.notificationType, 'Should default to action');
    }
    
    @isTest
    static void testGetNotificationsByType_Invalid() {
        Test.startTest();
        SfGpsDsCaOnNotificationController.NotificationSummary summary = 
            SfGpsDsCaOnNotificationController.getNotificationsByType('invalid');
        Test.stopTest();
        
        System.assertNotEquals(null, summary, 'Summary should not be null');
        System.assertEquals('action', summary.notificationType, 'Should default to action for invalid type');
    }
    
    @isTest
    static void testGetUnreadCount() {
        Test.startTest();
        Integer actionCount = SfGpsDsCaOnNotificationController.getUnreadCount('action');
        Integer reminderCount = SfGpsDsCaOnNotificationController.getUnreadCount('reminder');
        Integer statusCount = SfGpsDsCaOnNotificationController.getUnreadCount('status');
        Test.stopTest();
        
        System.assert(actionCount >= 0, 'Action count should be non-negative');
        System.assert(reminderCount >= 0, 'Reminder count should be non-negative');
        System.assert(statusCount >= 0, 'Status count should be non-negative');
    }
}
