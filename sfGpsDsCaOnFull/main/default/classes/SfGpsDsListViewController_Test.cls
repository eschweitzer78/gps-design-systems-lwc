/*
 * @author: Emmanuel Schweitzer
 */
@IsTest
private class SfGpsDsListViewController_Test {
  @IsTest
  private static void getListViewNameNullReturnsNull() {
    String rv = SfGpsDsListViewController.getListViewNameById(null);
    System.assertEquals(null, rv, 'Null listview should return null name.');
  }

  @IsTest
  private static void testGetListViewNameById() {
    Test.startTest();
    List<ListView> lvList = [
      SELECT Id, NamespacePrefix, DeveloperName
      FROM ListView
    ];

    Integer maxQueries = 10;

    for (ListView lv : lvList) {
      String rv = SfGpsDsListViewController.getListViewNameById(lv.Id);
      String expectedName =
        (lv.NamespacePrefix != null ? lv.NamespacePrefix + '__' : '') +
        lv.DeveloperName;
      System.assertEquals(
        expectedName,
        rv,
        'Both list views should have the same DeveloperName.'
      );
      maxQueries--;

      if (maxQueries == 0) {
        break;
      }
    }

    Test.stopTest();
  }

  @IsTest
  private static void testGetCount() {
    final String testPrefix = 'PI314159265359_';
    final Integer maxContacts = 8;

    Test.startTest();

    List<Contact> contactList = new List<Contact>();
    Integer nContacts = Integer.valueOf(Math.random() * maxContacts);

    for (Integer i = 0; i < nContacts; i++) {
      contactList.add(new Contact(LastName = testPrefix + i));
    }

    insert contactList;

    String filteredByInfo =
      '[{"fieldApiName":"Name","label":"Name","operandLabels":["' +
      testPrefix +
      '"],"operator":"Contains"}]';
    Integer rv = SfGpsDsListViewController.getCount(
      'Contact',
      '1',
      filteredByInfo
    );

    System.assertEquals(
      nContacts,
      rv,
      'Should have ' +
        nContacts +
        ' accounts whose name is starting with ' +
        testPrefix +
        ' vs. ' +
        rv
    );
  }

  @IsTest
  private static void testGetRecords() {
    final String testPrefix = 'PI314159265359.';

    Test.startTest();

    List<Contact> contactList = new List<Contact>();
    Integer nContacts = 8;
    Date bdate = Date.today();

    for (Integer i = 0; i < nContacts; i++) {
      contactList.add(
        new Contact(
          FirstName = 'Alana',
          LastName = testPrefix + i,
          Birthdate = bdate
        )
      );
    }

    insert contactList;

    String filteredByInfo =
      '[{"fieldApiName":"Name","label":"Name","operandLabels":["' +
      testPrefix +
      '"],"operator":"Contains"},{"fieldApiName":"Name","label":"Name","operandLabels":[".2", ".3"],"operator":"NotContain"}]';
    String displayColumns =
      '[' +
      '{"fieldApiName":"Account.Name","label":"Account Name","sortable":false},' /* traversing */ +
      '{"fieldApiName":"FirstName","label":"FirstName","sortable":true},' /* Text */ +
      '{"fieldApiName":"LastName","label":"LastName","sortable":true},' /* Text */ +
      '{"fieldApiName":"IsDeleted","label":"Is Deleted","sortable":false},' /* Boolean */ +
      '{"fieldApiName":"Birthdate","label":"Birthdate","sortable":false},' /* Date */ +
      '{"fieldApiName":"LastModifiedDate","label":"Last Modified Date","sortable":false},' /* DateTime */ +
      '{"fieldApiName":"MailingLatitude","label":"Mailing Latitude","sortable":false},' /* Double */ +
      '{"fieldApiName":"ContactSource","label":"Contact Source","sortable":false}' /* Picklist */ +
      ']';
    String orderedByInfo =
      '[' +
      '{"fieldApiName":"LastName","isAscending":true,"label":"Last Name ASC"}' +
      ']';

    List<sObject> recordList = SfGpsDsListViewController.getRecords(
      'Contact',
      displayColumns,
      '1 AND 2',
      filteredByInfo,
      orderedByInfo,
      0,
      100
    );

    System.assertEquals(
      nContacts - 2,
      recordList.size(),
      'Should have ' +
        (nContacts - 2) +
        ' contact whose last name is starting with ' +
        testPrefix +
        ' but without the .2 or .3 suffix vs. ' +
        recordList.size()
    );

    for (sObject record : recordList) {
      Contact contact = (Contact) record;
      Date actualBirthdate = contact.Birthdate;

      System.assertEquals(
        actualBirthdate,
        bdate,
        'Birthdate should be read correctly.'
      );
    }
  }

  @IsTest
  private static void testGetRecordsEqualsStartsWith() {
    final String testPrefix = 'PI314159265359.';

    Test.startTest();

    Contact c = new Contact(FirstName = 'Alana', LastName = testPrefix + '1');

    insert c;

    String filteredByInfo =
      '[' +
      '{"fieldApiName":"FirstName","label":"First Name","operandLabels":["Alana"],"operator":"Equals"},' +
      '{"fieldApiName":"LastName","label":"Last Name","operandLabels":["PI"],"operator":"StartsWith"}]';
    String displayColumns =
      '[' +
      '{"fieldApiName":"FirstName","label":"FirstName","sortable":true},' /* Text */ +
      '{"fieldApiName":"LastName","label":"LastName","sortable":true}' /* Text */ +
      ']';

    List<sObject> recordList = SfGpsDsListViewController.getRecords(
      'Contact',
      displayColumns,
      '1 OR 2',
      filteredByInfo,
      null,
      0,
      100
    );

    System.assertEquals(
      1,
      recordList.size(),
      'Should have 1 contact whose last name starts with PI or first name is Alana vs. ' +
      recordList.size()
    );
  }

  @IsTest
  private static void testGetEnhancedRecords() {
    final String testPrefix = 'PI314159265359.';

    Test.startTest();

    List<Contact> contactList = new List<Contact>();
    Integer nContacts = 8;
    Date bdate = Date.today();

    for (Integer i = 0; i < nContacts; i++) {
      contactList.add(
        new Contact(
          FirstName = 'Alana',
          LastName = testPrefix + i,
          Birthdate = bdate
        )
      );
    }

    insert contactList;

    String filteredByInfo =
      '[{"fieldApiName":"Name","label":"Name","operandLabels":["' +
      testPrefix +
      '"],"operator":"Contains"},{"fieldApiName":"Name","label":"Name","operandLabels":[".2", ".3"],"operator":"NotContain"}]';
    String displayColumns =
      '[' +
      '{"fieldApiName":"Account.Name","label":"Account Name","sortable":false},' /* traversing */ +
      '{"fieldApiName":"FirstName","label":"FirstName","sortable":true},' /* Text */ +
      '{"fieldApiName":"LastName","label":"LastName","sortable":true},' /* Text */ +
      '{"fieldApiName":"IsDeleted","label":"Is Deleted","sortable":false},' /* Boolean */ +
      '{"fieldApiName":"Birthdate","label":"Birthdate","sortable":false},' /* Date */ +
      '{"fieldApiName":"LastModifiedDate","label":"Last Modified Date","sortable":false},' /* DateTime */ +
      '{"fieldApiName":"MailingLatitude","label":"Mailing Latitude","sortable":false},' /* Double */ +
      '{"fieldApiName":"ContactSource","label":"Contact Source","sortable":false}' /* Picklist */ +
      ']';
    String orderedByInfo =
      '[' +
      '{"fieldApiName":"LastName","isAscending":true,"label":"Last Name ASC"}' +
      ']';

    List<SfGpsDsListViewController.EnhancedRecord> recordList = SfGpsDsListViewController.getEnhancedRecords(
      'Contact',
      displayColumns,
      '1 AND 2',
      filteredByInfo,
      orderedByInfo,
      0,
      100
    );

    System.assertEquals(
      nContacts - 2,
      recordList.size(),
      'Should have ' +
        (nContacts - 2) +
        ' contact whose last name is starting with ' +
        testPrefix +
        ' but without the .2 or .3 suffix vs. ' +
        recordList.size()
    );

    for (SfGpsDsListViewController.EnhancedRecord record : recordList) {
      Map<String, SfGpsDsListViewController.EnhancedRecordColumn> columns = record.columns;
      SfGpsDsListViewController.EnhancedRecordColumn erc = columns.get(
        'Birthdate'
      );
      Date actualBirthdate = (Date) erc.value;

      System.assertEquals(
        actualBirthdate,
        bdate,
        'Birthdate should be read correctly.'
      );
    }
  }

  @IsTest
  private static void tesEnhancedTypeInfo() {
    Test.startTest();

    SfGpsDsListViewController.EnhancedTypeInfos etiC = new SfGpsDsListViewController.EnhancedTypeInfos(
      'Contact'
    );
    SfGpsDsListViewController.EnhancedTypeInfos etiA = new SfGpsDsListViewController.EnhancedTypeInfos(
      'Account'
    );
    Map<String, Schema.PicklistEntry> pleMap = etiC.getFieldPicklistEntries(
      'Account',
      'AccountSource'
    );

    System.assertNotEquals(null, pleMap, 'Should return account sources.');

    for (String entry : pleMap.keySet()) {
      Schema.PicklistEntry ple = etiA.getFieldPicklistEntry(
        null,
        'AccountSource',
        entry
      );
      System.assertEquals(entry, ple.getValue(), 'Picklist entries must match');
    }

    Test.stopTest();
  }
}
