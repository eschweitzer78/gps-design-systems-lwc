/*
 * @author: Emmanuel Schweitzer
 */
@isTest
public class SfGpsDsEncodingOF_Test {
  final static String OP_URL_ENCODE = 'UrlEncode';
  final static String OP_URL_DECODE = 'UrlDecode';

  @isTest
  static void urlEncodeShouldCatchSpecialChars() {
    SfGpsDsEncodingOF r = new SfGpsDsEncodingOF();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => new Map<String, Object>{
        'arguments' => new List<String>{ 'Do you like this #urlstring?' }
      },
      'output' => output,
      'options' => new Map<String, Object>()
    };

    Test.startTest();
    Boolean rv = (Boolean) r.call(OP_URL_ENCODE, args);
    Test.stopTest();

    System.assertEquals(true, rv, 'UrlEncode should be successful.');
    System.assertEquals(
      'Do+you+like+this+%23urlstring%3F',
      output.get('result'),
      'UrlEncode should catch special characters'
    );
  }

  @isTest
  static void urlEncodeShouldEncodeIntegers() {
    SfGpsDsEncodingOF r = new SfGpsDsEncodingOF();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => new Map<String, Object>{
        'arguments' => new List<Integer>{ 1120 }
      },
      'output' => output,
      'options' => new Map<String, Object>()
    };

    Test.startTest();
    Boolean rv = (Boolean) r.call(OP_URL_ENCODE, args);
    Test.stopTest();

    System.assertEquals(true, rv, 'UrlEncode should be successful.');
    System.assertEquals(
      '1120',
      output.get('result'),
      'UrlEncode should encode integers'
    );
  }

  @isTest
  static void urlEncodeShouldFailWithoutArgs() {
    SfGpsDsEncodingOF r = new SfGpsDsEncodingOF();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => new Map<String, Object>{ 'arguments' => new List<String>() },
      'output' => output,
      'options' => new Map<String, Object>()
    };

    Test.startTest();
    Boolean rv = (Boolean) r.call(OP_URL_ENCODE, args);
    Test.stopTest();

    System.assertEquals(false, rv, 'UrlEncode should fail.');
  }

  @isTest
  static void urlDecodeShouldCatchSpecialChars1() {
    SfGpsDsEncodingOF r = new SfGpsDsEncodingOF();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => new Map<String, Object>{
        'arguments' => new List<String>{ 'Do+you+like+this+%23urlstring%3F' }
      },
      'output' => output,
      'options' => new Map<String, Object>()
    };

    Test.startTest();
    Boolean rv = (Boolean) r.call(OP_URL_DECODE, args);
    Test.stopTest();

    System.assertEquals(true, rv, 'UrlDecode should be successful.');
    System.assertEquals(
      'Do you like this #urlstring?',
      output.get('result'),
      'UrlDecode should catch special characters'
    );
  }

  @isTest
  static void urlDecodeShouldCatchSpecialChars2() {
    SfGpsDsEncodingOF r = new SfGpsDsEncodingOF();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => new Map<String, Object>{
        'arguments' => new List<String>{
          'Do%20you%20like%20this%20%23urlstring%3F'
        }
      },
      'output' => output,
      'options' => new Map<String, Object>()
    };

    Test.startTest();
    Boolean rv = (Boolean) r.call(OP_URL_DECODE, args);
    Test.stopTest();

    System.assertEquals(true, rv, 'UrlDecode should be successful.');
    System.assertEquals(
      'Do you like this #urlstring?',
      output.get('result'),
      'UrlDecode should catch special characters incl %20'
    );
  }

  @isTest
  static void urlDecodeShouldEncodeIntegers() {
    SfGpsDsEncodingOF r = new SfGpsDsEncodingOF();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => new Map<String, Object>{
        'arguments' => new List<Integer>{ 1120 }
      },
      'output' => output,
      'options' => new Map<String, Object>()
    };

    Test.startTest();
    Boolean rv = (Boolean) r.call(OP_URL_DECODE, args);
    Test.stopTest();

    System.assertEquals(true, rv, 'UrlDecode should be successful.');
    System.assertEquals(
      '1120',
      output.get('result'),
      'UrlDecode should decode integers'
    );
  }

  @isTest
  static void urlDecodeShouldFailWithoutArgs() {
    SfGpsDsEncodingOF r = new SfGpsDsEncodingOF();
    Map<String, Object> output = new Map<String, Object>();
    Map<String, Object> args = new Map<String, Object>{
      'input' => new Map<String, Object>{ 'arguments' => new List<String>() },
      'output' => output,
      'options' => new Map<String, Object>()
    };

    Test.startTest();
    Boolean rv = (Boolean) r.call(OP_URL_DECODE, args);
    Test.stopTest();

    System.assertEquals(false, rv, 'UrlDecode should fail.');
  }
}
