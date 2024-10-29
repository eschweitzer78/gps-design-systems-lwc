@IsTest
private class SfGpsDsRecordDetailController_Test {
  @IsTest
  private static void testGetRecordSummary() {
    Test.startTest();

    Contact c = new Contact(FirstName = 'Peregrin', LastName = 'Took');
    insert c;

    List<String> summary = SfGpsDsRecordDetailController.getRecordSummary(c.Id);

    System.assertEquals(3, summary.size(), 'Summary should have three entries');
    System.assertEquals(
      'Contact',
      summary[1],
      'Summary second entry should be Contact'
    );
    System.assertEquals(
      c.FirstName + ' ' + c.LastName,
      summary[2],
      'Summary third entry should be ' + c.FirstName + ' ' + c.LastName
    );

    Test.stopTest();
  }

  @IsTest
  private static void testGetObjectSummary() {
    Test.startTest();

    String summary = SfGpsDsRecordDetailController.getObjectSummary('Contact');
    System.assertNotEquals(null, summary, 'Summary should not be null');

    Test.stopTest();
  }

  @IsTest
  private static void getObjectSummaryThrowsExWithUnknownObj() {
    Test.startTest();
    Boolean hadException = false;

    try {
      SfGpsDsRecordDetailController.getObjectSummary('YabbaDabbaDoo');
    } catch (AuraException e) {
      hadException = true;
    }

    System.assertNotEquals(
      true,
      hadException,
      'Summary should raise exception'
    );

    Test.stopTest();
  }
}
