@IsTest
private class SfGpsDsListViewORA_Test {
  private static final String OBJECT_NAME = 'Account';
  private static final String LISTVIEW_NAME = 'RecentlyViewedAccounts';

  /** 2023-06-20 ESC
   *
   * I know a static ID looks wrong, but the ID returned by the listviews API is actually
   * consistently the same no matter what the org is, and it is NOT a record
   * in the ListView table at all.
   */

  private static final String LV_ID = '00B5j00000GK7a9EAD';

  @IsTest
  private static void testGetListViews() {
    Test.setMock(HttpCalloutMock.class, new SfGpsDsListViewORA_Mock());
    Test.startTest();

    SfGpsDsListViewORA.ListViewInfoList lvil = SfGpsDsListViewORA.getListViews(
      OBJECT_NAME
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

  @IsTest
  private static void testGetListViewIdByName() {
    Test.setMock(HttpCalloutMock.class, new SfGpsDsListViewORA_Mock());
    Test.startTest();

    String result = SfGpsDsListViewORA.getListViewIdByName(
      OBJECT_NAME,
      LISTVIEW_NAME
    );

    System.assertEquals(LV_ID, result, 'Excepted correct List View Id');

    Test.stopTest();
  }

  @IsTest
  private static void testGetRecords() {
    Test.setMock(HttpCalloutMock.class, new SfGpsDsListViewORA_Mock());
    Test.startTest();

    SfGpsDsListViewORA lvORA = new SfGpsDsListViewORA();

    Map<String, Object> input = new Map<String, Object>{
      'objectName' => OBJECT_NAME,
      'listViewName' => LISTVIEW_NAME
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

  @IsTest
  private static void testGetWrongMethod() {
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
