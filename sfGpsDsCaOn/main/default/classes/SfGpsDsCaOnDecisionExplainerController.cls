/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Controller to invoke Decision Explainer APIs for Ontario DS components.
 * Provides methods to evaluate expression sets and return business rule explanations.
 *
 * The DecisionExplainer API returns structured explanations showing how business rules
 * evaluated inputs and produced outcomes - critical for transparency in eligibility
 * determinations and benefit calculations.
 *
 * @see https://developer.salesforce.com/docs/atlas.en-us.psc_api.meta/psc_api/decision_explainer_apis_rest_references.htm
 */
public with sharing class SfGpsDsCaOnDecisionExplainerController {
  /**
   * Evaluate an expression set and return the decision explanation.
   *
   * @param expressionSetApiName The API name of the expression set to evaluate
   * @param inputVariablesJson JSON string containing input variables for the expression set
   * @return DecisionExplanationResult containing the evaluation results and step explanations
   */
  @AuraEnabled
  public static DecisionExplanationResult evaluateExpressionSet(
    String expressionSetApiName,
    String inputVariablesJson
  ) {
    DecisionExplanationResult result = new DecisionExplanationResult();
    result.steps = new List<StepExplanation>();
    result.outputs = new Map<String, Object>();

    try {
      // Parse input variables
      Map<String, Object> inputVariables = new Map<String, Object>();
      if (String.isNotBlank(inputVariablesJson)) {
        inputVariables = (Map<String, Object>) JSON.deserializeUntyped(
          inputVariablesJson
        );
      }

      // Validate expression set name
      if (String.isBlank(expressionSetApiName)) {
        throw new AuraHandledException('Expression Set API Name is required');
      }

      // Use HTTP callout to Expression Set API via Named Credential
      // This approach works across different org configurations
      result = callExpressionSetApi(expressionSetApiName, inputVariables);
    } catch (AuraHandledException e) {
      throw e;
    } catch (Exception e) {
      result.success = false;
      result.overallResult = 'error';
      result.errorMessage = 'An unexpected error occurred: ' + e.getMessage();
    }

    return result;
  }

  /**
   * Call the Expression Set API using HTTP callout.
   * Uses Named Credential 'SfGpsDsCaOnDecisionExplainer' if configured, otherwise falls back to Session ID.
   *
   * IMPORTANT: For LWR Experience Cloud sites with guest users, Named Credentials are REQUIRED
   * because UserInfo.getSessionId() returns null for guest users in LWR.
   */
  private static DecisionExplanationResult callExpressionSetApi(
    String expressionSetApiName,
    Map<String, Object> inputVariables
  ) {
    DecisionExplanationResult result = new DecisionExplanationResult();
    result.steps = new List<StepExplanation>();
    result.outputs = new Map<String, Object>();

    try {
      // Build request body
      Map<String, Object> requestBody = new Map<String, Object>{
        'inputVariables' => inputVariables,
        'options' => new Map<String, Object>{ 'includeExplanations' => true }
      };

      // Make the callout
      HttpRequest req = new HttpRequest();
      req.setMethod('POST');
      req.setHeader('Content-Type', 'application/json');
      req.setBody(JSON.serialize(requestBody));
      req.setTimeout(30000);

      // Try Named Credential first (required for LWR guest users)
      // Falls back to Session ID for backward compatibility
      String endpoint = buildExpressionSetEndpoint(expressionSetApiName, req);
      req.setEndpoint(endpoint);

      Http http = new Http();
      HttpResponse res = http.send(req);

      if (res.getStatusCode() == 200) {
        // Parse successful response
        Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(
          res.getBody()
        );
        result = parseApiResponse(responseBody);
      } else if (res.getStatusCode() == 401) {
        // Authentication failed - provide helpful error message
        result.success = false;
        result.overallResult = 'error';
        result.errorMessage = 'Authentication failed. For LWR Experience Cloud sites, configure the Named Credential \'SfGpsDsCaOnDecisionExplainer\'. See DECISION_EXPLAINER_SETUP.md for instructions.';
      } else {
        // Handle error response
        result.success = false;
        result.overallResult = 'error';
        result.errorMessage =
          'API call failed with status ' +
          res.getStatusCode() +
          ': ' +
          res.getBody();
      }
    } catch (CalloutException e) {
      result.success = false;
      result.overallResult = 'error';
      result.errorMessage = 'Callout failed: ' + e.getMessage();
    }

    return result;
  }

  /**
   * Build the Expression Set API endpoint.
   * Attempts to use Named Credential first for LWR compatibility,
   * falls back to Session ID for Aura-based sites.
   *
   * @param expressionSetApiName The API name of the expression set
   * @param req The HttpRequest to configure with authorization
   * @return The endpoint URL
   */
  private static String buildExpressionSetEndpoint(
    String expressionSetApiName,
    HttpRequest req
  ) {
    String apiPath =
      '/services/data/v62.0/connect/business-rules/expression-set/' +
      EncodingUtil.urlEncode(expressionSetApiName, 'UTF-8') +
      '/evaluate';

    // Try Named Credential first (required for LWR guest users)
    if (hasNamedCredential('SfGpsDsCaOnDecisionExplainer')) {
      // Named Credential handles authentication automatically
      return 'callout:SfGpsDsCaOnDecisionExplainer' + apiPath;
    }

    // Fall back to Session ID (works for authenticated users in Aura sites)
    String sessionId = getSessionId();
    if (String.isBlank(sessionId)) {
      throw new CalloutException(
        'No valid session found. For LWR Experience Cloud sites with guest users, ' +
          'configure the Named Credential \'SfGpsDsCaOnDecisionExplainer\'. ' +
          'See DECISION_EXPLAINER_SETUP.md for setup instructions.'
      );
    }

    req.setHeader('Authorization', 'Bearer ' + sessionId);
    return URL.getOrgDomainUrl().toExternalForm() + apiPath;
  }

  /**
   * Check if a Named Credential exists in the org.
   *
   * @param developerName The developer name of the Named Credential
   * @return True if the Named Credential exists
   */
  private static Boolean hasNamedCredential(String developerName) {
    try {
      Integer count = [
        SELECT COUNT()
        FROM NamedCredential
        WHERE DeveloperName = :developerName
        LIMIT 1
      ];
      return count > 0;
    } catch (Exception e) {
      // Query may fail due to permissions, assume NC doesn't exist
      return false;
    }
  }

  /**
   * Get the current session ID for API authentication.
   * Returns null for guest users in LWR Experience Cloud sites.
   *
   * @return The session ID or null if not available
   */
  private static String getSessionId() {
    return UserInfo.getSessionId();
  }

  /**
   * Build the Integration Procedure API endpoint.
   * Attempts to use Named Credential first for LWR compatibility,
   * falls back to Session ID for Aura-based sites.
   *
   * @param integrationProcedureName The name of the Integration Procedure (Type_SubType format)
   * @param req The HttpRequest to configure with authorization
   * @return The endpoint URL
   */
  private static String buildIntegrationProcedureEndpoint(
    String integrationProcedureName,
    HttpRequest req
  ) {
    String apiPath =
      '/services/apexrest/omnistudio/IntegrationProcedureService/' +
      EncodingUtil.urlEncode(integrationProcedureName, 'UTF-8');

    // Try Named Credential first (required for LWR guest users)
    if (hasNamedCredential('SfGpsDsCaOnDecisionExplainer')) {
      // Named Credential handles authentication automatically
      return 'callout:SfGpsDsCaOnDecisionExplainer' + apiPath;
    }

    // Fall back to Session ID (works for authenticated users in Aura sites)
    String sessionId = getSessionId();
    if (String.isBlank(sessionId)) {
      throw new CalloutException(
        'No valid session found. For LWR Experience Cloud sites with guest users, ' +
          'configure the Named Credential \'SfGpsDsCaOnDecisionExplainer\'. ' +
          'See DECISION_EXPLAINER_SETUP.md for setup instructions.'
      );
    }

    req.setHeader('Authorization', 'Bearer ' + sessionId);
    return URL.getOrgDomainUrl().toExternalForm() + apiPath;
  }

  /**
   * Parse the API response into our result structure.
   */
  private static DecisionExplanationResult parseApiResponse(
    Map<String, Object> responseBody
  ) {
    DecisionExplanationResult result = new DecisionExplanationResult();
    result.steps = new List<StepExplanation>();
    result.outputs = new Map<String, Object>();

    // Parse success status
    if (responseBody.containsKey('isSuccess')) {
      result.success = (Boolean) responseBody.get('isSuccess');
    } else {
      result.success = true; // Assume success if not specified
    }

    // Parse outputs
    if (responseBody.containsKey('outputVariables')) {
      result.outputs = (Map<String, Object>) responseBody.get(
        'outputVariables'
      );
    }

    // Parse explanations
    if (responseBody.containsKey('explanations')) {
      List<Object> explanations = (List<Object>) responseBody.get(
        'explanations'
      );
      Integer sequence = 0;
      for (Object explObj : explanations) {
        Map<String, Object> explMap = (Map<String, Object>) explObj;
        StepExplanation step = new StepExplanation();
        step.stepName = (String) explMap.get('stepName');
        step.stepLabel = (String) explMap.get('stepLabel');
        step.message = (String) explMap.get('message');
        step.passed = explMap.containsKey('passed')
          ? (Boolean) explMap.get('passed')
          : true;
        step.showDetails = explMap.containsKey('includeInOutput')
          ? (Boolean) explMap.get('includeInOutput')
          : false;
        step.sequenceNumber = sequence++;

        if (step.showDetails && explMap.containsKey('outputDataMap')) {
          step.details = (Map<String, Object>) explMap.get('outputDataMap');
        }

        result.steps.add(step);
      }
    }

    // Set overall result message
    if (result.success) {
      result.overallResult = 'passed';
      result.overallMessage = 'All eligibility criteria have been met.';
    } else {
      result.overallResult = 'failed';
      result.overallMessage = 'One or more eligibility criteria were not met.';
    }

    return result;
  }

  /**
   * Evaluate an expression set using an OmniStudio Integration Procedure.
   * Use this method when OmniStudio is available and configured with expression set evaluation.
   *
   * @param integrationProcedureName The name of the Integration Procedure (Type_SubType format)
   * @param inputData Input data for the Integration Procedure
   * @return DecisionExplanationResult containing the evaluation results
   */
  @AuraEnabled
  public static DecisionExplanationResult evaluateViaIntegrationProcedure(
    String integrationProcedureName,
    String inputDataJson
  ) {
    DecisionExplanationResult result = new DecisionExplanationResult();
    result.steps = new List<StepExplanation>();
    result.outputs = new Map<String, Object>();

    try {
      // Parse input data
      Map<String, Object> inputData = new Map<String, Object>();
      if (String.isNotBlank(inputDataJson)) {
        inputData = (Map<String, Object>) JSON.deserializeUntyped(
          inputDataJson
        );
      }

      // Parse Integration Procedure name (Type_SubType format)
      List<String> ipParts = integrationProcedureName.split('_');
      if (ipParts.size() < 2) {
        throw new AuraHandledException(
          'Invalid Integration Procedure name format. Expected: Type_SubType'
        );
      }

      // Call the Integration Procedure via REST API
      // This approach works without compile-time OmniStudio dependency
      HttpRequest req = new HttpRequest();
      req.setMethod('POST');
      req.setHeader('Content-Type', 'application/json');
      req.setBody(JSON.serialize(inputData));
      req.setTimeout(30000);

      // Build endpoint with Named Credential support for LWR compatibility
      String endpoint = buildIntegrationProcedureEndpoint(
        integrationProcedureName,
        req
      );
      req.setEndpoint(endpoint);

      Http http = new Http();
      HttpResponse res = http.send(req);

      if (res.getStatusCode() == 200) {
        Map<String, Object> ipResult = (Map<String, Object>) JSON.deserializeUntyped(
          res.getBody()
        );
        result = processIntegrationProcedureResult(ipResult);
      } else if (res.getStatusCode() == 404) {
        throw new AuraHandledException(
          'OmniStudio Integration Procedure not found. Ensure OmniStudio is installed and the procedure exists.'
        );
      } else {
        result.success = false;
        result.overallResult = 'error';
        result.errorMessage =
          'Integration Procedure call failed: ' + res.getBody();
      }
    } catch (AuraHandledException e) {
      throw e;
    } catch (CalloutException e) {
      result.success = false;
      result.overallResult = 'error';
      result.errorMessage =
        'Integration Procedure callout failed: ' + e.getMessage();
    } catch (Exception e) {
      result.success = false;
      result.overallResult = 'error';
      result.errorMessage =
        'Integration Procedure execution failed: ' + e.getMessage();
    }

    return result;
  }

  /**
   * Process the result from an Integration Procedure into our standard format.
   */
  private static DecisionExplanationResult processIntegrationProcedureResult(
    Map<String, Object> ipResult
  ) {
    DecisionExplanationResult result = new DecisionExplanationResult();
    result.steps = new List<StepExplanation>();
    result.outputs = new Map<String, Object>();

    // Extract standard fields from IP result
    if (ipResult.containsKey('success')) {
      result.success = (Boolean) ipResult.get('success');
    }

    if (ipResult.containsKey('overallResult')) {
      result.overallResult = (String) ipResult.get('overallResult');
    }

    if (ipResult.containsKey('overallMessage')) {
      result.overallMessage = (String) ipResult.get('overallMessage');
    }

    if (ipResult.containsKey('outputs')) {
      result.outputs = (Map<String, Object>) ipResult.get('outputs');
    }

    // Process step explanations
    if (ipResult.containsKey('steps')) {
      List<Object> stepsData = (List<Object>) ipResult.get('steps');
      for (Object stepObj : stepsData) {
        Map<String, Object> stepData = (Map<String, Object>) stepObj;
        StepExplanation step = new StepExplanation();
        step.stepName = (String) stepData.get('stepName');
        step.stepLabel = (String) stepData.get('stepLabel');
        step.message = (String) stepData.get('message');
        step.passed = stepData.containsKey('passed')
          ? (Boolean) stepData.get('passed')
          : true;
        step.showDetails = stepData.containsKey('showDetails')
          ? (Boolean) stepData.get('showDetails')
          : false;
        step.sequenceNumber = stepData.containsKey('sequenceNumber')
          ? ((Decimal) stepData.get('sequenceNumber')).intValue()
          : 0;

        if (stepData.containsKey('details')) {
          step.details = (Map<String, Object>) stepData.get('details');
        }

        result.steps.add(step);
      }
      result.steps.sort();
    }

    return result;
  }

  /**
   * Get available expression sets for configuration purposes.
   *
   * @return List of available expression set names
   */
  @AuraEnabled(cacheable=true)
  public static List<ExpressionSetInfo> getAvailableExpressionSets() {
    List<ExpressionSetInfo> expressionSets = new List<ExpressionSetInfo>();

    try {
      // Query ExpressionSetDefinition if available (API v58.0+)
      // This is a metadata query, results may vary based on permissions
      List<SObject> esDefs = Database.query(
        'SELECT Id, DeveloperName, MasterLabel, Description ' +
          'FROM ExpressionSetDefinition ' +
          'WHERE IsActive = true ' +
          'ORDER BY MasterLabel ASC ' +
          'LIMIT 100'
      );

      for (SObject esDef : esDefs) {
        ExpressionSetInfo info = new ExpressionSetInfo();
        info.id = (String) esDef.get('Id');
        info.apiName = (String) esDef.get('DeveloperName');
        info.label = (String) esDef.get('MasterLabel');
        info.description = (String) esDef.get('Description');
        expressionSets.add(info);
      }
    } catch (Exception e) {
      // ExpressionSetDefinition may not be queryable in all orgs
      // Return empty list if not available
      System.debug(
        LoggingLevel.WARN,
        'Unable to query ExpressionSetDefinition: ' + e.getMessage()
      );
    }

    return expressionSets;
  }

  /**
   * Result wrapper for decision explanation responses.
   */
  public class DecisionExplanationResult {
    @AuraEnabled
    public Boolean success;
    @AuraEnabled
    public String overallResult; // 'passed', 'failed', 'error'
    @AuraEnabled
    public String overallMessage;
    @AuraEnabled
    public List<StepExplanation> steps;
    @AuraEnabled
    public Map<String, Object> outputs;
    @AuraEnabled
    public String errorMessage;
  }

  /**
   * Individual step explanation within an expression set evaluation.
   */
  public class StepExplanation implements Comparable {
    @AuraEnabled
    public String stepName;
    @AuraEnabled
    public String stepLabel;
    @AuraEnabled
    public String message;
    @AuraEnabled
    public Boolean passed;
    @AuraEnabled
    public Boolean showDetails;
    @AuraEnabled
    public Integer sequenceNumber;
    @AuraEnabled
    public Map<String, Object> details;

    public Integer compareTo(Object other) {
      StepExplanation otherStep = (StepExplanation) other;
      if (this.sequenceNumber == null)
        return 1;
      if (otherStep.sequenceNumber == null)
        return -1;
      return this.sequenceNumber - otherStep.sequenceNumber;
    }
  }

  /**
   * Expression set metadata information.
   */
  public class ExpressionSetInfo {
    @AuraEnabled
    public String id;
    @AuraEnabled
    public String apiName;
    @AuraEnabled
    public String label;
    @AuraEnabled
    public String description;
  }
}
