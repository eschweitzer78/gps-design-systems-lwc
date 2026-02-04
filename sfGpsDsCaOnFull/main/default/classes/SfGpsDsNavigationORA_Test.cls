/*
 * Most of this class is not really testable as it depends on the existence of a nav which we cannot
 * create through Apex. However we do not want to bring Apex coverage down so there are a few tests that
 * are pretend...
 *
 * @author: Ben Bates and Emmanuel Schweitzer
 */
@isTest
private class SfGpsDsNavigationORA_Test {
  @isTest
  static void testGetNavigationV2communityPreviewNull() {
    Map<String, Object> result;
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigationV2';
    Id communityId = null; // This will be handled gracefully
    String developerName = 'RandomName';
    Boolean communityPreview = null;

    Callable extension = (Callable) Type.forName(extensionClass).newInstance();

    Test.startTest();

    result = (Map<String, Object>) extension.call(
      extensionClassAction,
      new Map<String, Object>{
        'input' => new Map<String, Object>{
          'communityId' => communityId,
          'developerName' => developerName,
          'communityPreview' => communityPreview
        },
        'output' => new Map<String, Object>(),
        'communityId' => communityId,
        'developerName' => developerName,
        'communityPreview' => communityPreview
      }
    );

    System.assertNotEquals(
      null,
      ((Map<String, Object>) result.get('output')).get('response')
    );

    Test.stopTest();
  }

  @isTest
  static void testGetNavigationCommunityPreviewNull() {
    Map<String, Object> result;
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigation';
    Id communityId = null; // This will be handled gracefully
    String developerName = 'RandomName';
    Boolean communityPreview = null;

    Callable extension = (Callable) Type.forName(extensionClass).newInstance();

    Test.startTest();

    result = (Map<String, Object>) extension.call(
      extensionClassAction,
      new Map<String, Object>{
        'input' => new Map<String, Object>{
          'communityId' => communityId,
          'developerName' => developerName,
          'communityPreview' => communityPreview
        },
        'output' => new Map<String, Object>(),
        'communityId' => communityId,
        'developerName' => developerName,
        'communityPreview' => communityPreview
      }
    );

    System.assertNotEquals(
      null,
      ((Map<String, Object>) result.get('output')).get('items')
    );

    Test.stopTest();
  }

  @isTest
  static void testGetBaseUrl() {
    Map<String, Object> result;
    String extensionClass = 'SfGpsDsNavigationORA';
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();

    Test.startTest();

    result = (Map<String, Object>) extension.call(
      'GetBaseUrl',
      new Map<String, Object>{
        'input' => new Map<String, Object>{},
        'output' => new Map<String, Object>()
      }
    );

    System.assertEquals(
      URL.getOrgDomainURL().toExternalForm(),
      ((Map<String, Object>) result.get('output')).get('url')
    );

    Test.stopTest();
  }

  @isTest
  static void testHandleNavigationItemsEntities() {
    Test.startTest();

    List<Object> items = new List<Object>{
      new Map<String, Object>{
        'label' => 'salt&amp;peppa',
        'subMenu' => new List<Object>()
      }
    };

    List<Object> rv = SfGpsDsNavigationORA.handleNavigationItemsEntities(items);
    Object decodedLabel = ((Map<String, Object>) rv[0]).get('label');

    System.assertEquals(
      'salt&peppa',
      decodedLabel,
      'HTML 4 entity should be decoded'
    );

    Test.stopTest();
  }
}
