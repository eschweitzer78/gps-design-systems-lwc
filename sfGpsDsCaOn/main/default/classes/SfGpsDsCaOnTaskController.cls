/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Controller to fetch Salesforce Tasks for Ontario DS Task List component.
 * Provides methods to query tasks assigned to the current user or related to a specific record.
 */
public with sharing class SfGpsDsCaOnTaskController {
    
    /**
     * Get tasks assigned to the current user.
     * @param showCompleted Whether to include completed tasks
     * @param maxRecords Maximum number of records to return
     * @return List of TaskListItem objects formatted for Ontario DS Task List
     */
    @AuraEnabled(cacheable=true)
    public static List<TaskListItem> getCurrentUserTasks(Boolean showCompleted, Integer maxRecords) {
        Integer recordLimit = (maxRecords != null && maxRecords > 0) ? Math.min(maxRecords, 200) : 50;
        Boolean includeCompleted = showCompleted != null ? showCompleted : false;
        Id userId = UserInfo.getUserId();
        
        List<Task> tasks;
        if (includeCompleted) {
            tasks = [
                SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                FROM Task
                WHERE OwnerId = :userId
                WITH USER_MODE
                ORDER BY IsClosed ASC, ActivityDate ASC NULLS LAST, Priority DESC
                LIMIT :recordLimit
            ];
        } else {
            tasks = [
                SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                FROM Task
                WHERE OwnerId = :userId AND IsClosed = false
                WITH USER_MODE
                ORDER BY IsClosed ASC, ActivityDate ASC NULLS LAST, Priority DESC
                LIMIT :recordLimit
            ];
        }
        
        return mapTasksToItems(tasks);
    }
    
    /**
     * Get tasks related to a specific record (Account, Contact, Opportunity, etc.).
     * @param recordId The ID of the record to get related tasks for
     * @param showCompleted Whether to include completed tasks
     * @param maxRecords Maximum number of records to return
     * @return List of TaskListItem objects formatted for Ontario DS Task List
     */
    @AuraEnabled(cacheable=true)
    public static List<TaskListItem> getRelatedTasks(Id recordId, Boolean showCompleted, Integer maxRecords) {
        if (recordId == null) {
            return new List<TaskListItem>();
        }
        
        Integer recordLimit = (maxRecords != null && maxRecords > 0) ? Math.min(maxRecords, 200) : 50;
        Boolean includeCompleted = showCompleted != null ? showCompleted : false;
        
        List<Task> tasks;
        if (includeCompleted) {
            tasks = [
                SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                FROM Task
                WHERE (WhatId = :recordId OR WhoId = :recordId)
                WITH USER_MODE
                ORDER BY IsClosed ASC, ActivityDate ASC NULLS LAST, Priority DESC
                LIMIT :recordLimit
            ];
        } else {
            tasks = [
                SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                FROM Task
                WHERE (WhatId = :recordId OR WhoId = :recordId) AND IsClosed = false
                WITH USER_MODE
                ORDER BY IsClosed ASC, ActivityDate ASC NULLS LAST, Priority DESC
                LIMIT :recordLimit
            ];
        }
        
        return mapTasksToItems(tasks);
    }
    
    /**
     * Get tasks due within a specific date range for the current user.
     * @param startDate Start of the date range
     * @param endDate End of the date range
     * @param showCompleted Whether to include completed tasks
     * @return List of TaskListItem objects formatted for Ontario DS Task List
     */
    @AuraEnabled(cacheable=true)
    public static List<TaskListItem> getTasksByDateRange(Date startDate, Date endDate, Boolean showCompleted) {
        Id userId = UserInfo.getUserId();
        Boolean includeCompleted = showCompleted != null ? showCompleted : false;
        
        List<Task> tasks;
        
        // Use static SOQL based on parameter combinations for security compliance
        if (startDate != null && endDate != null) {
            if (includeCompleted) {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId AND ActivityDate >= :startDate AND ActivityDate <= :endDate
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            } else {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId AND ActivityDate >= :startDate AND ActivityDate <= :endDate AND IsClosed = false
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            }
        } else if (startDate != null) {
            if (includeCompleted) {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId AND ActivityDate >= :startDate
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            } else {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId AND ActivityDate >= :startDate AND IsClosed = false
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            }
        } else if (endDate != null) {
            if (includeCompleted) {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId AND ActivityDate <= :endDate
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            } else {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId AND ActivityDate <= :endDate AND IsClosed = false
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            }
        } else {
            if (includeCompleted) {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            } else {
                tasks = [
                    SELECT Id, Subject, Description, Status, Priority, ActivityDate, WhatId, What.Name
                    FROM Task
                    WHERE OwnerId = :userId AND IsClosed = false
                    WITH USER_MODE
                    ORDER BY ActivityDate ASC NULLS LAST, Priority DESC
                    LIMIT 200
                ];
            }
        }
        
        return mapTasksToItems(tasks);
    }
    
    /**
     * Maps Salesforce Task records to TaskListItem objects.
     */
    private static List<TaskListItem> mapTasksToItems(List<Task> tasks) {
        List<TaskListItem> items = new List<TaskListItem>();
        
        for (Task t : tasks) {
            TaskListItem item = new TaskListItem();
            item.id = t.Id;
            item.label = t.Subject != null ? t.Subject : 'Untitled Task';
            item.hintText = buildHint(t);
            item.status = mapStatus(t.Status);
            item.statusLabel = t.Status;
            item.url = '/' + t.Id;
            items.add(item);
        }
        
        return items;
    }
    
    /**
     * Builds a hint string from task details.
     */
    private static String buildHint(Task t) {
        List<String> parts = new List<String>();
        
        if (t.ActivityDate != null) {
            if (t.ActivityDate < Date.today() && !isTaskClosed(t.Status)) {
                parts.add('Overdue: ' + t.ActivityDate.format());
            } else {
                parts.add('Due: ' + t.ActivityDate.format());
            }
        }
        
        if (t.What != null && t.What.Name != null) {
            parts.add('Related to: ' + t.What.Name);
        }
        
        if (t.Description != null && t.Description.length() > 0) {
            String descText = t.Description.length() > 100 
                ? t.Description.substring(0, 100) + '...' 
                : t.Description;
            parts.add(descText);
        }
        
        return parts.isEmpty() ? null : String.join(parts, ' | ');
    }
    
    /**
     * Maps Salesforce Task Status to Ontario DS Task List status.
     */
    private static String mapStatus(String salesforceStatus) {
        if (salesforceStatus == null) {
            return 'not-started';
        }
        
        String status = salesforceStatus.toLowerCase();
        
        if (status.contains('completed') || status.contains('closed')) {
            return 'complete';
        } else if (status.contains('in progress') || status.contains('started')) {
            return 'in-progress';
        } else if (status.contains('waiting') || status.contains('blocked') || status.contains('on hold')) {
            return 'cannot-start-yet';
        } else if (status.contains('deferred') || status.contains('optional')) {
            return 'optional';
        } else {
            return 'not-started';
        }
    }
    
    /**
     * Checks if a task status indicates the task is closed.
     */
    private static Boolean isTaskClosed(String status) {
        if (status == null) return false;
        String s = status.toLowerCase();
        return s.contains('completed') || s.contains('closed');
    }
    
    /**
     * Inner class representing a task item for the Ontario DS Task List.
     */
    public class TaskListItem {
        @AuraEnabled public Id id;
        @AuraEnabled public String label;
        @AuraEnabled public String hintText;
        @AuraEnabled public String status;
        @AuraEnabled public String statusLabel;
        @AuraEnabled public String url;
    }
}
