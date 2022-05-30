@IsTest
private class SfGpsDsBaseORA_Test {
  private class SfGpsDsBaseTestORA extends SfGpsDsBaseORA {
    SfGpsDsBaseTestORA(
      Map<String, Object> input,
      Map<String, Object> output,
      Map<String, Object> options
    ) {
      init(
        new Map<String, Object>{
          'input' => input,
          'output' => output,
          'options' => options
        }
      );
    }
  }

  @IsTest
  private static void testNullOutput() {
    Test.startTest();

    Boolean ex = false;

    try {
      Map<String, Object> input = new Map<String, Object>();
      Map<String, Object> options = new Map<String, Object>();

      SfGpsDsBaseTestORA b = new SfGpsDsBaseTestORA(input, null, options);
    } catch (SfGpsDsBaseORA.ArgsException e) {
      ex = true;
    }

    System.assertEquals(
      true,
      ex,
      'Expecting exception to have occurred on null output arg'
    );
    Test.stopTest();
  }

  @IsTest
  private static void testSetError() {
    Test.startTest();

    Map<String, Object> input = new Map<String, Object>();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> options = new Map<String, Object>();

    SfGpsDsBaseTestORA b = new SfGpsDsBaseTestORA(input, output, options);

    System.assertEquals(false, b.hasError(), 'Not expecting error');
    System.assertEquals(null, b.getErrorCode(), 'Not expecting error value');

    String errorText = 'Some text';
    b.setError(errorText);
    System.assertNotEquals(null, SfGpsDsBaseORA.ERROR_KEY, 'Expecting error');
    System.assertEquals(
      errorText,
      b.getErrorCode(),
      'Expecting error value ' + errorText
    );

    Test.stopTest();
  }

  @IsTest
  private static void testGetTypeFromMap() {
    Test.startTest();

    sObject sObj = new Account();
    Id id = Id.valueOf('00B5j00000GK7UgEAL');
    Blob bl = Blob.valueOf('Blah');
    Date d = Date.today();
    DateTime dt = DateTime.now();
    List<String> l = new List<String>{ 'a', 'b' };
    Double dbl = 3.14159;

    Map<String, Object> input = new Map<String, Object>{
      'sObject' => sObj,
      'Boolean' => true,
      'Id' => id,
      'String' => 'Hello',
      'Blob' => bl,
      'Date' => d,
      'Datetime' => dt,
      'Time' => dt.time(),
      'Integer' => 11,
      'Long' => 12L,
      'Decimal' => 3.14,
      'Double' => dbl,
      'List' => l
    };
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> options = new Map<String, Object>{ 'null' => null };

    SfGpsDsBaseTestORA b = new SfGpsDsBaseTestORA(input, output, options);

    System.assertEquals(
      sObj,
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.INPUT,
        'sObject',
        Account.class
      ),
      'Expecting right value'
    );
    System.assertEquals(
      true,
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.INPUT,
        'Boolean',
        Boolean.class
      ),
      'Expecting right value'
    );
    System.assertEquals(
      id,
      b.getTypedFromMap(SfGpsDsBaseORA.WhereFrom.INPUT, 'Id', Id.class),
      'Expecting right value'
    );
    System.assertEquals(
      'Hello',
      b.getTypedFromMap(SfGpsDsBaseORA.WhereFrom.INPUT, 'String', String.class),
      'Expecting right value'
    );
    System.assertEquals(
      bl,
      b.getTypedFromMap(SfGpsDsBaseORA.WhereFrom.INPUT, 'Blob', Blob.class),
      'Expecting right value'
    );
    System.assertEquals(
      d,
      b.getTypedFromMap(SfGpsDsBaseORA.WhereFrom.INPUT, 'Date', Date.class),
      'Expecting right value'
    );
    System.assertEquals(
      dt,
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.INPUT,
        'Datetime',
        Datetime.class
      ),
      'Expecting right value'
    );
    System.assertEquals(
      dt.time(),
      b.getTypedFromMap(SfGpsDsBaseORA.WhereFrom.INPUT, 'Time', Time.class),
      'Expecting right value'
    );
    System.assertEquals(
      11,
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.INPUT,
        'Integer',
        Integer.class
      ),
      'Expecting right value'
    );
    System.assertEquals(
      12L,
      b.getTypedFromMap(SfGpsDsBaseORA.WhereFrom.INPUT, 'Long', Long.class),
      'Expecting right value'
    );
    System.assertEquals(
      3.14,
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.INPUT,
        'Decimal',
        Decimal.class
      ),
      'Expecting right value'
    );
    System.assertEquals(
      dbl,
      b.getTypedFromMap(SfGpsDsBaseORA.WhereFrom.INPUT, 'Double', Double.class),
      'Expecting right value'
    );
    System.assertEquals(
      l,
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.INPUT,
        'List',
        List<Object>.class
      ),
      'Expecting right value'
    );

    System.assertEquals(
      null,
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.OPTIONS,
        'null',
        sObject.class,
        true
      ),
      'Expecting null'
    );

    Boolean ex = false;
    try {
      b.getTypedFromMap(
        SfGpsDsBaseORA.WhereFrom.INPUT,
        'Integer',
        String.class
      );
    } catch (SfGpsDsBaseORA.TypeException e) {
      ex = true;
    }

    System.assertEquals(true, ex, 'Expecting exception to occur');

    Test.stopTest();
  }

  @IsTest
  private static void testPutOutput() {
    Test.startTest();

    Map<String, Object> input = new Map<String, Object>();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> options = new Map<String, Object>();

    SfGpsDsBaseTestORA b = new SfGpsDsBaseTestORA(input, output, options);

    b.putOutput('Key', 'Val');

    System.assertEquals('Val', output.get('Key'), 'Expecting value "Val"');

    Test.stopTest();
  }
}
