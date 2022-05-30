@IsTest
private class SfGpsDsListViewORA_Test {
  private final static String LV_ID = '00B5j00000GK7a9EAD';

  private @IsTest
  static void testGetListViews() {
    Test.setMock(HttpCalloutMock.class, new SfGpsDsListViewORA_Mock());
    Test.startTest();

    SfGpsDsListViewORA.ListViewInfoList lvil = SfGpsDsListViewORA.getListViews(
      'Account'
    );
    System.assertNotEquals(null, lvil, 'Expected non-null response');
    System.assertEquals(true, lvil.done, 'Expecting done is true');
    System.assertNotEquals(
      null,
      lvil.listviews,
      'Expecting non-null listviews'
    );
    System.assertEquals(6, lvil.size, 'Expecting size to be 6');
    System.assertEquals(6, lvil.listviews.size(), 'Expecting 6 listviews');

    Test.stopTest();
  }

  private @IsTest
  static void testGetListViewIdByName() {
    Test.setMock(HttpCalloutMock.class, new SfGpsDsListViewORA_Mock());
    Test.startTest();

    String result = SfGpsDsListViewORA.getListViewIdByName(
      'Account',
      'RecentlyViewedAccounts'
    );
    System.assertEquals(LV_ID, result, 'Excepted correct List View Id');

    Test.stopTest();
  }

  private @IsTest
  static void testGetRecords() {
    Test.setMock(HttpCalloutMock.class, new SfGpsDsListViewORA_Mock());
    Test.startTest();

    SfGpsDsListViewORA lvORA = new SfGpsDsListViewORA();

    Map<String, Object> input = new Map<String, Object>{
      'objectName' => 'Account',
      'listViewName' => 'RecentlyViewedAccounts'
    };

    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> options = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => input,
      'output' => output,
      'options' => options
    };

    lvORA.call('GetRecords', args);

    System.assertEquals(
      false,
      lvORA.hasError(),
      'Expecting call to be successful'
    );

    Object recordsObj = output.get('records');
    System.assertEquals(
      true,
      recordsObj instanceof List<sObject>,
      'Expecting list of sObject'
    );

    List<sObject> records = (List<sObject>) recordsObj;
    System.assertNotEquals(null, records, 'Expect record list to be returned');

    Test.stopTest();
  }

  private @IsTest
  static void testGetWrongMethod() {
    Test.setMock(HttpCalloutMock.class, new SfGpsDsListViewORA_Mock());
    Test.startTest();

    SfGpsDsListViewORA lvORA = new SfGpsDsListViewORA();

    Map<String, Object> input = new Map<String, Object>();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> options = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => input,
      'output' => output,
      'options' => options
    };

    lvORA.call('lkjfRURO_rkljr9', args);

    System.assertEquals(
      'KO',
      output.get('error'),
      'Expecting call to be unsuccessful'
    );
    Test.stopTest();
  }
}
