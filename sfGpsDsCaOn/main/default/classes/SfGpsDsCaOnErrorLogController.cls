/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * @description Controller for logging frontend errors from LWC components.
 * Provides centralized error collection and optional Platform Event publishing.
 *
 * @group Error Tracking
 * @see sfGpsDsCaOnErrorTracker (LWC)
 */
public with sharing class SfGpsDsCaOnErrorLogController {
  /**
   * @description Maximum length for error message field
   */
  private static final Integer MAX_MESSAGE_LENGTH = 32000;

  /**
   * @description Maximum length for correlation ID
   */
  private static final Integer MAX_CORRELATION_ID_LENGTH = 50;

  /**
   * @description Logs an error from the frontend.
   *
   * @param errorJson JSON string containing error details
   * @return String Confirmation message with log ID
   * @example
   * String result = SfGpsDsCaOnErrorLogController.logError('{"message":"Test error","component":"TestComp"}');
   */
  @AuraEnabled
  public static String logError(String errorJson) {
    if (String.isBlank(errorJson)) {
      throw new AuraHandledException('Error JSON is required');
    }

    try {
      ErrorInfo error = parseErrorJson(errorJson);

      // Log to debug log with correlation ID
      System.debug(
        LoggingLevel.ERROR,
        String.format(
          '[{0}] [{1}] {2}: {3}',
          new List<String>{
            error.correlationId,
            error.component,
            error.category,
            error.message
          }
        )
      );

      // Log additional details
      System.debug(
        LoggingLevel.DEBUG,
        String.format(
          '[{0}] Details: {1}',
          new List<String>{ error.correlationId, JSON.serialize(error.details) }
        )
      );

      // Optionally create custom object record
      // createErrorLogRecord(error);

      // Optionally publish Platform Event
      // publishErrorEvent(error);

      return 'Logged with ID: ' + error.correlationId;
    } catch (Exception e) {
      System.debug(
        LoggingLevel.ERROR,
        'Failed to log frontend error: ' + e.getMessage()
      );
      throw new AuraHandledException('Failed to log error: ' + e.getMessage());
    }
  }

  /**
   * @description Logs multiple errors in batch.
   *
   * @param errorsJson JSON array of error objects
   * @return Integer Number of errors logged
   */
  @AuraEnabled
  public static Integer logErrors(String errorsJson) {
    if (String.isBlank(errorsJson)) {
      return 0;
    }

    try {
      List<Object> errors = (List<Object>) JSON.deserializeUntyped(errorsJson);
      Integer count = 0;

      for (Object errorObj : errors) {
        try {
          logError(JSON.serialize(errorObj));
          count++;
        } catch (Exception e) {
          System.debug(
            LoggingLevel.WARN,
            'Failed to log individual error: ' + e.getMessage()
          );
        }
      }

      return count;
    } catch (Exception e) {
      throw new AuraHandledException(
        'Failed to parse errors: ' + e.getMessage()
      );
    }
  }

  /**
   * @description Retrieves recent errors by correlation ID.
   * Useful for support investigations.
   *
   * @param correlationId The correlation ID to search for
   * @return List<String> Debug log entries matching the correlation ID
   */
  @AuraEnabled(cacheable=true)
  public static List<String> getErrorsByCorrelationId(String correlationId) {
    // This would typically query a custom object or external system
    // For now, return a placeholder message
    return new List<String>{
      'Search debug logs for correlation ID: ' + correlationId,
      'Use Developer Console > Debug Logs to find entries'
    };
  }

  /**
   * @description Parses error JSON into structured object.
   *
   * @param errorJson JSON string
   * @return ErrorInfo Parsed error information
   */
  private static ErrorInfo parseErrorJson(String errorJson) {
    Map<String, Object> errorMap = (Map<String, Object>) JSON.deserializeUntyped(
      errorJson
    );

    ErrorInfo error = new ErrorInfo();

    error.correlationId = truncate(
      String.valueOf(errorMap.get('correlationId')),
      MAX_CORRELATION_ID_LENGTH
    );

    if (String.isBlank(error.correlationId)) {
      error.correlationId = 'SFGPS-' + String.valueOf(DateTime.now().getTime());
    }

    error.message = truncate(
      String.valueOf(errorMap.get('message')),
      MAX_MESSAGE_LENGTH
    );

    error.component = String.valueOf(errorMap.get('component'));
    error.category = String.valueOf(errorMap.get('category'));
    error.severity = String.valueOf(errorMap.get('severity'));
    error.timestamp = String.valueOf(errorMap.get('timestamp'));
    error.stack = truncate(
      String.valueOf(errorMap.get('stack')),
      MAX_MESSAGE_LENGTH
    );

    if (errorMap.containsKey('details')) {
      error.details = (Map<String, Object>) errorMap.get('details');
    } else {
      error.details = new Map<String, Object>();
    }

    // Add server-side context
    error.details.put('userId', UserInfo.getUserId());
    error.details.put('userName', UserInfo.getUserName());
    error.details.put('orgId', UserInfo.getOrganizationId());
    error.details.put('serverTimestamp', DateTime.now().format());

    return error;
  }

  /**
   * @description Truncates a string to maximum length.
   *
   * @param value String to truncate
   * @param maxLength Maximum allowed length
   * @return String Truncated string
   */
  private static String truncate(String value, Integer maxLength) {
    if (String.isBlank(value)) {
      return '';
    }
    return value.length() > maxLength ? value.substring(0, maxLength) : value;
  }

  /**
   * @description Inner class for structured error information.
   */
  public class ErrorInfo {
    public String correlationId { get; set; }
    public String message { get; set; }
    public String component { get; set; }
    public String category { get; set; }
    public String severity { get; set; }
    public String timestamp { get; set; }
    public String stack { get; set; }
    public Map<String, Object> details { get; set; }
  }

  // ========================================
  // Optional: Custom Object Logging
  // Uncomment and customize if using custom object
  // ========================================

  /*
    private static void createErrorLogRecord(ErrorInfo error) {
        sfGpsDsCaOnErrorLog__c logRecord = new sfGpsDsCaOnErrorLog__c(
            CorrelationId__c = error.correlationId,
            Component__c = error.component,
            Category__c = error.category,
            Severity__c = error.severity,
            Message__c = error.message,
            Stack__c = error.stack,
            Details__c = JSON.serialize(error.details),
            ErrorTimestamp__c = DateTime.now(),
            User__c = UserInfo.getUserId()
        );
        
        insert logRecord;
    }
    */

  // ========================================
  // Optional: Platform Event Publishing
  // Uncomment and customize if using Platform Events
  // ========================================

  /*
    private static void publishErrorEvent(ErrorInfo error) {
        sfGpsDsCaOnError__e errorEvent = new sfGpsDsCaOnError__e(
            CorrelationId__c = error.correlationId,
            Component__c = error.component,
            Category__c = error.category,
            Severity__c = error.severity,
            Message__c = error.message
        );
        
        Database.SaveResult sr = EventBus.publish(errorEvent);
        
        if (!sr.isSuccess()) {
            System.debug(LoggingLevel.WARN, 'Failed to publish error event: ' + sr.getErrors());
        }
    }
    */
}
