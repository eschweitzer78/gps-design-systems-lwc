/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Test class for SfGpsDsCaOnDecisionExplainerController.
 * Tests the Decision Explainer API integration for business rule explanations.
 */
@isTest
private class SfGpsDsCaOnDecisionExplainerCtrlTest {
  /**
   * Test evaluateExpressionSet with valid input.
   * Note: This test uses mock data since actual expression sets may not be available in test context.
   */
  @isTest
  static void testEvaluateExpressionSet_WithValidInput() {
    // Prepare test input
    String expressionSetApiName = 'Test_Expression_Set';
    Map<String, Object> inputVars = new Map<String, Object>{
      'income' => 50000,
      'dependents' => 2,
      'isVeteran' => true
    };
    String inputVariablesJson = JSON.serialize(inputVars);

    Test.startTest();

    // Call the method - this will likely fail in test context without actual expression set
    // but we're testing the error handling
    SfGpsDsCaOnDecisionExplainerController.DecisionExplanationResult result = SfGpsDsCaOnDecisionExplainerController.evaluateExpressionSet(
      expressionSetApiName,
      inputVariablesJson
    );

    Test.stopTest();

    // In test context without actual expression set, we expect an error result
    System.assertNotEquals(null, result, 'Result should not be null');
    // The result will contain either success data or an error message
    if (!result.success) {
      System.assertNotEquals(
        null,
        result.errorMessage,
        'Error message should be set when not successful'
      );
    }
  }

  /**
   * Test evaluateExpressionSet with null expression set name.
   */
  @isTest
  static void testEvaluateExpressionSet_WithNullName() {
    String inputVariablesJson = '{"test": "value"}';

    Test.startTest();

    Boolean exceptionThrown = false;
    try {
      SfGpsDsCaOnDecisionExplainerController.evaluateExpressionSet(
        null,
        inputVariablesJson
      );
    } catch (AuraHandledException e) {
      exceptionThrown = true;
      // AuraHandledException message may be wrapped, just verify exception was thrown
    } catch (Exception e) {
      exceptionThrown = true;
      // Any exception is acceptable for invalid input
    }

    Test.stopTest();

    System.assertEquals(
      true,
      exceptionThrown,
      'Should throw exception for null name'
    );
  }

  /**
   * Test evaluateExpressionSet with empty input variables.
   */
  @isTest
  static void testEvaluateExpressionSet_WithEmptyInput() {
    String expressionSetApiName = 'Test_Expression_Set';

    Test.startTest();

    SfGpsDsCaOnDecisionExplainerController.DecisionExplanationResult result = SfGpsDsCaOnDecisionExplainerController.evaluateExpressionSet(
      expressionSetApiName,
      ''
    );

    Test.stopTest();

    System.assertNotEquals(
      null,
      result,
      'Result should not be null even with empty input'
    );
  }

  /**
   * Test evaluateExpressionSet with invalid JSON input.
   */
  @isTest
  static void testEvaluateExpressionSet_WithInvalidJson() {
    String expressionSetApiName = 'Test_Expression_Set';
    String invalidJson = 'not valid json';

    Test.startTest();

    SfGpsDsCaOnDecisionExplainerController.DecisionExplanationResult result = SfGpsDsCaOnDecisionExplainerController.evaluateExpressionSet(
      expressionSetApiName,
      invalidJson
    );

    Test.stopTest();

    System.assertNotEquals(null, result, 'Result should not be null');
    System.assertEquals(false, result.success, 'Should fail with invalid JSON');
    System.assertNotEquals(
      null,
      result.errorMessage,
      'Should have error message'
    );
  }

  /**
   * Test evaluateViaIntegrationProcedure with invalid IP name format.
   */
  @isTest
  static void testEvaluateViaIntegrationProcedure_InvalidFormat() {
    String invalidIpName = 'InvalidFormatNoUnderscore';
    String inputDataJson = '{"test": "value"}';

    Test.startTest();

    Boolean exceptionThrown = false;
    String exceptionMessage = '';
    try {
      SfGpsDsCaOnDecisionExplainerController.evaluateViaIntegrationProcedure(
        invalidIpName,
        inputDataJson
      );
    } catch (AuraHandledException e) {
      exceptionThrown = true;
      exceptionMessage = e.getMessage();
    }

    Test.stopTest();

    System.assertEquals(
      true,
      exceptionThrown,
      'Should throw AuraHandledException for invalid format'
    );
    // AuraHandledException wraps the message, so check it's related to IP format
    System.assert(
      exceptionMessage != null && exceptionMessage.length() > 0,
      'Exception message should not be empty'
    );
  }

  /**
   * Test evaluateViaIntegrationProcedure when OmniStudio is not available.
   */
  @isTest
  static void testEvaluateViaIntegrationProcedure_OmniStudioNotAvailable() {
    String ipName = 'Type_SubType';
    String inputDataJson = '{"test": "value"}';

    Test.startTest();

    // In most test contexts, OmniStudio won't be available
    SfGpsDsCaOnDecisionExplainerController.DecisionExplanationResult result = null;
    Boolean exceptionThrown = false;

    try {
      result = SfGpsDsCaOnDecisionExplainerController.evaluateViaIntegrationProcedure(
        ipName,
        inputDataJson
      );
    } catch (AuraHandledException e) {
      exceptionThrown = true;
      // Expected when OmniStudio is not available
    }

    Test.stopTest();

    // Either we get an error result or an exception
    System.assert(
      exceptionThrown || (result != null && !result.success),
      'Should either throw exception or return error result when OmniStudio is not available'
    );
  }

  /**
   * Test getAvailableExpressionSets.
   */
  @isTest
  static void testGetAvailableExpressionSets() {
    Test.startTest();

    List<SfGpsDsCaOnDecisionExplainerController.ExpressionSetInfo> expressionSets = SfGpsDsCaOnDecisionExplainerController.getAvailableExpressionSets();

    Test.stopTest();

    // The result may be empty if ExpressionSetDefinition is not available in test context
    System.assertNotEquals(
      null,
      expressionSets,
      'Should return a list (even if empty)'
    );
  }

  /**
   * Test DecisionExplanationResult wrapper class.
   */
  @isTest
  static void testDecisionExplanationResultClass() {
    SfGpsDsCaOnDecisionExplainerController.DecisionExplanationResult result = new SfGpsDsCaOnDecisionExplainerController.DecisionExplanationResult();

    result.success = true;
    result.overallResult = 'passed';
    result.overallMessage = 'Test message';
    result.steps = new List<SfGpsDsCaOnDecisionExplainerController.StepExplanation>();
    result.outputs = new Map<String, Object>{ 'key' => 'value' };
    result.errorMessage = null;

    System.assertEquals(true, result.success, 'Success should be true');
    System.assertEquals(
      'passed',
      result.overallResult,
      'Overall result should be passed'
    );
    System.assertEquals(
      'Test message',
      result.overallMessage,
      'Overall message should match'
    );
    System.assertNotEquals(null, result.steps, 'Steps should not be null');
    System.assertNotEquals(null, result.outputs, 'Outputs should not be null');
  }

  /**
   * Test StepExplanation wrapper class and Comparable implementation.
   */
  @isTest
  static void testStepExplanationClass() {
    SfGpsDsCaOnDecisionExplainerController.StepExplanation step1 = new SfGpsDsCaOnDecisionExplainerController.StepExplanation();
    step1.stepName = 'Step1';
    step1.stepLabel = 'First Step';
    step1.message = 'Step 1 passed';
    step1.passed = true;
    step1.showDetails = true;
    step1.sequenceNumber = 1;
    step1.details = new Map<String, Object>{ 'output' => 100 };

    SfGpsDsCaOnDecisionExplainerController.StepExplanation step2 = new SfGpsDsCaOnDecisionExplainerController.StepExplanation();
    step2.stepName = 'Step2';
    step2.sequenceNumber = 2;

    SfGpsDsCaOnDecisionExplainerController.StepExplanation stepNoSequence = new SfGpsDsCaOnDecisionExplainerController.StepExplanation();
    stepNoSequence.stepName = 'StepNoSeq';

    // Test compareTo
    System.assertEquals(
      -1,
      step1.compareTo(step2),
      'Step1 should come before Step2'
    );
    System.assertEquals(
      1,
      step2.compareTo(step1),
      'Step2 should come after Step1'
    );
    System.assertEquals(
      1,
      stepNoSequence.compareTo(step1),
      'Step without sequence should come last'
    );
    System.assertEquals(
      -1,
      step1.compareTo(stepNoSequence),
      'Step with sequence should come first'
    );

    // Verify properties
    System.assertEquals('Step1', step1.stepName, 'Step name should match');
    System.assertEquals(
      'First Step',
      step1.stepLabel,
      'Step label should match'
    );
    System.assertEquals(true, step1.passed, 'Passed should be true');
  }

  /**
   * Test ExpressionSetInfo wrapper class.
   */
  @isTest
  static void testExpressionSetInfoClass() {
    SfGpsDsCaOnDecisionExplainerController.ExpressionSetInfo info = new SfGpsDsCaOnDecisionExplainerController.ExpressionSetInfo();

    info.id = '001000000000001';
    info.apiName = 'Test_Expression_Set';
    info.label = 'Test Expression Set';
    info.description = 'A test expression set';

    System.assertEquals('001000000000001', info.id, 'ID should match');
    System.assertEquals(
      'Test_Expression_Set',
      info.apiName,
      'API name should match'
    );
    System.assertEquals(
      'Test Expression Set',
      info.label,
      'Label should match'
    );
    System.assertEquals(
      'A test expression set',
      info.description,
      'Description should match'
    );
  }

  /**
   * Test step sorting functionality.
   */
  @isTest
  static void testStepSorting() {
    List<SfGpsDsCaOnDecisionExplainerController.StepExplanation> steps = new List<SfGpsDsCaOnDecisionExplainerController.StepExplanation>();

    SfGpsDsCaOnDecisionExplainerController.StepExplanation step3 = new SfGpsDsCaOnDecisionExplainerController.StepExplanation();
    step3.stepName = 'Step3';
    step3.sequenceNumber = 3;

    SfGpsDsCaOnDecisionExplainerController.StepExplanation step1 = new SfGpsDsCaOnDecisionExplainerController.StepExplanation();
    step1.stepName = 'Step1';
    step1.sequenceNumber = 1;

    SfGpsDsCaOnDecisionExplainerController.StepExplanation step2 = new SfGpsDsCaOnDecisionExplainerController.StepExplanation();
    step2.stepName = 'Step2';
    step2.sequenceNumber = 2;

    // Add in wrong order
    steps.add(step3);
    steps.add(step1);
    steps.add(step2);

    // Sort
    steps.sort();

    // Verify order
    System.assertEquals(
      'Step1',
      steps[0].stepName,
      'First step should be Step1'
    );
    System.assertEquals(
      'Step2',
      steps[1].stepName,
      'Second step should be Step2'
    );
    System.assertEquals(
      'Step3',
      steps[2].stepName,
      'Third step should be Step3'
    );
  }
}
