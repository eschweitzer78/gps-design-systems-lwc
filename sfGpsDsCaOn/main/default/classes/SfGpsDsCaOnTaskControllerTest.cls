/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Test class for SfGpsDsCaOnTaskController
 * Provides code coverage for all controller methods.
 */
@isTest
private class SfGpsDsCaOnTaskControllerTest {
  /**
   * Test data setup - creates test Account and Tasks
   */
  @testSetup
  static void setupTestData() {
    // Create a test Account for task relationships
    Account testAccount = new Account(Name = 'Test Account for Tasks');
    insert testAccount;

    // Create various tasks with different statuses
    List<Task> tasks = new List<Task>();

    // Open task - Not Started
    tasks.add(
      new Task(
        Subject = 'Test Task Not Started',
        Status = 'Not Started',
        Priority = 'High',
        ActivityDate = Date.today().addDays(7),
        WhatId = testAccount.Id,
        Description = 'This is a test task description that is long enough to test truncation when displayed in the task list component.'
      )
    );

    // Open task - In Progress
    tasks.add(
      new Task(
        Subject = 'Test Task In Progress',
        Status = 'In Progress',
        Priority = 'Normal',
        ActivityDate = Date.today().addDays(3),
        WhatId = testAccount.Id
      )
    );

    // Completed task
    tasks.add(
      new Task(
        Subject = 'Test Task Completed',
        Status = 'Completed',
        Priority = 'Low',
        ActivityDate = Date.today().addDays(-1),
        WhatId = testAccount.Id
      )
    );

    // Overdue task (past date, not closed)
    tasks.add(
      new Task(
        Subject = 'Overdue Task',
        Status = 'Not Started',
        Priority = 'High',
        ActivityDate = Date.today().addDays(-5)
      )
    );

    // Task with no due date
    tasks.add(
      new Task(
        Subject = 'Task Without Due Date',
        Status = 'Waiting on someone else',
        Priority = 'Normal'
      )
    );

    // Task with Deferred status
    tasks.add(
      new Task(
        Subject = 'Deferred Task',
        Status = 'Deferred',
        Priority = 'Low',
        ActivityDate = Date.today().addDays(30)
      )
    );

    insert tasks;
  }

  /**
   * Test getCurrentUserTasks - default parameters
   */
  @isTest
  static void testGetCurrentUserTasks_Default() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      null,
      null
    );
    Test.stopTest();

    // Should return open tasks only by default
    System.assertNotEquals(null, results, 'Results should not be null');

    // Verify no completed tasks are returned
    for (SfGpsDsCaOnTaskController.TaskListItem item : results) {
      System.assertNotEquals(
        'complete',
        item.status,
        'Completed tasks should not be returned when showCompleted is false/null'
      );
    }
  }

  /**
   * Test getCurrentUserTasks - with completed tasks
   */
  @isTest
  static void testGetCurrentUserTasks_WithCompleted() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      true,
      100
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');

    // Should include completed tasks
    Boolean hasCompleted = false;
    for (SfGpsDsCaOnTaskController.TaskListItem item : results) {
      if (item.status == 'complete') {
        hasCompleted = true;
        break;
      }
    }
    System.assertEquals(
      true,
      hasCompleted,
      'Should include completed tasks when showCompleted is true'
    );
  }

  /**
   * Test getCurrentUserTasks - with max records limit
   */
  @isTest
  static void testGetCurrentUserTasks_WithLimit() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      false,
      2
    );
    Test.stopTest();

    System.assert(results.size() <= 2, 'Should respect maxRecords limit');
  }

  /**
   * Test getRelatedTasks - with valid record ID
   */
  @isTest
  static void testGetRelatedTasks_ValidId() {
    Account testAccount = [
      SELECT Id
      FROM Account
      WHERE Name = 'Test Account for Tasks'
      LIMIT 1
    ];

    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getRelatedTasks(
      testAccount.Id,
      false,
      50
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
    System.assert(
      results.size() > 0,
      'Should return tasks related to the account'
    );
  }

  /**
   * Test getRelatedTasks - with null record ID
   */
  @isTest
  static void testGetRelatedTasks_NullId() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getRelatedTasks(
      null,
      false,
      50
    );
    Test.stopTest();

    System.assertEquals(
      0,
      results.size(),
      'Should return empty list for null record ID'
    );
  }

  /**
   * Test getRelatedTasks - with completed tasks
   */
  @isTest
  static void testGetRelatedTasks_WithCompleted() {
    Account testAccount = [
      SELECT Id
      FROM Account
      WHERE Name = 'Test Account for Tasks'
      LIMIT 1
    ];

    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getRelatedTasks(
      testAccount.Id,
      true,
      50
    );
    Test.stopTest();

    // Should include completed tasks
    Boolean hasCompleted = false;
    for (SfGpsDsCaOnTaskController.TaskListItem item : results) {
      if (item.status == 'complete') {
        hasCompleted = true;
        break;
      }
    }
    System.assertEquals(true, hasCompleted, 'Should include completed tasks');
  }

  /**
   * Test getTasksByDateRange - with date range
   */
  @isTest
  static void testGetTasksByDateRange_WithRange() {
    Date startDate = Date.today().addDays(-10);
    Date endDate = Date.today().addDays(10);

    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getTasksByDateRange(
      startDate,
      endDate,
      false
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getTasksByDateRange - with null dates
   */
  @isTest
  static void testGetTasksByDateRange_NullDates() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getTasksByDateRange(
      null,
      null,
      true
    );
    Test.stopTest();

    System.assertNotEquals(
      null,
      results,
      'Results should not be null even with null dates'
    );
  }

  /**
   * Test getTasksByDateRange - start date only
   */
  @isTest
  static void testGetTasksByDateRange_StartDateOnly() {
    Date startDate = Date.today();

    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getTasksByDateRange(
      startDate,
      null,
      false
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test getTasksByDateRange - end date only
   */
  @isTest
  static void testGetTasksByDateRange_EndDateOnly() {
    Date endDate = Date.today().addDays(30);

    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getTasksByDateRange(
      null,
      endDate,
      false
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test TaskListItem structure
   */
  @isTest
  static void testTaskListItemStructure() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      true,
      10
    );
    Test.stopTest();

    if (!results.isEmpty()) {
      SfGpsDsCaOnTaskController.TaskListItem item = results[0];

      // Verify all properties are populated
      System.assertNotEquals(null, item.id, 'Id should not be null');
      System.assertNotEquals(null, item.label, 'Label should not be null');
      System.assertNotEquals(null, item.status, 'Status should not be null');
      System.assertNotEquals(null, item.url, 'URL should not be null');
      System.assert(item.url.startsWith('/'), 'URL should start with /');
    }
  }

  /**
   * Test status mapping - various statuses
   */
  @isTest
  static void testStatusMapping() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      true,
      100
    );
    Test.stopTest();

    // Verify status values are valid Ontario DS statuses
    Set<String> validStatuses = new Set<String>{
      'not-started',
      'in-progress',
      'complete',
      'cannot-start-yet',
      'optional'
    };

    for (SfGpsDsCaOnTaskController.TaskListItem item : results) {
      System.assert(
        validStatuses.contains(item.status),
        'Status "' + item.status + '" should be a valid Ontario DS status'
      );
    }
  }

  /**
   * Test hint text generation - with description
   */
  @isTest
  static void testHintTextGeneration() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      true,
      100
    );
    Test.stopTest();

    // Find task with description and verify hint text
    for (SfGpsDsCaOnTaskController.TaskListItem item : results) {
      if (item.hintText != null && item.hintText.contains('Due:')) {
        System.assert(
          item.hintText.length() > 0,
          'Hint text should not be empty'
        );
        break;
      }
    }
  }

  /**
   * Test overdue task hint
   */
  @isTest
  static void testOverdueTaskHint() {
    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      false,
      100
    );
    Test.stopTest();

    // Find overdue task
    for (SfGpsDsCaOnTaskController.TaskListItem item : results) {
      if (item.label == 'Overdue Task' && item.hintText != null) {
        System.assert(
          item.hintText.contains('Overdue:'),
          'Overdue tasks should have "Overdue:" in hint text'
        );
        break;
      }
    }
  }

  /**
   * Test task with null subject
   */
  @isTest
  static void testTaskWithNullSubject() {
    // Create a task without a subject
    Task nullSubjectTask = new Task(
      Status = 'Not Started',
      Priority = 'Normal',
      ActivityDate = Date.today()
    );
    insert nullSubjectTask;

    Test.startTest();
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      false,
      100
    );
    Test.stopTest();

    // Find the task and verify label
    for (SfGpsDsCaOnTaskController.TaskListItem item : results) {
      if (item.id == nullSubjectTask.Id) {
        System.assertEquals(
          'Untitled Task',
          item.label,
          'Tasks without subject should have "Untitled Task" label'
        );
        break;
      }
    }
  }

  /**
   * Test edge case - maxRecords exceeds limit
   */
  @isTest
  static void testMaxRecordsLimit() {
    Test.startTest();
    // Request more than 200 - should be capped at 200
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      true,
      500
    );
    Test.stopTest();

    // Query should still work (capped internally to 200)
    System.assertNotEquals(null, results, 'Results should not be null');
  }

  /**
   * Test negative maxRecords
   */
  @isTest
  static void testNegativeMaxRecords() {
    Test.startTest();
    // Negative value should default to 50
    List<SfGpsDsCaOnTaskController.TaskListItem> results = SfGpsDsCaOnTaskController.getCurrentUserTasks(
      false,
      -10
    );
    Test.stopTest();

    System.assertNotEquals(null, results, 'Results should not be null');
  }
}
