@isTest
private class SfGpsDsNavigationORA_Test {
  /* 
        Navigation tests assume a Community site exists and that at least one NavigationLinkSet exists for that site.
    */

  @isTest
  static void testGetNavigationV2communityPreviewTrue() {
    List<NavigationMenuItem> navMenuItem = [
      SELECT Label, NavigationLinkSetId, Target
      FROM NavigationMenuItem
      LIMIT 1
    ];
    List<NavigationLinkSet> navLinkSet = [
      SELECT Id, DeveloperName, NetworkId
      FROM NavigationLinkSet
      WHERE Id = :navMenuItem.get(0).NavigationLinkSetId
      LIMIT 1
    ];
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigationV2';
    String communityId = navLinkSet.get(0).NetworkId;
    String developerName = navLinkSet.get(0).DeveloperName;
    Boolean communityPreview = true;
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();
    Map<String, Object> result;
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
    Test.stopTest();
    System.assertNotEquals(
      null,
      ((Map<String, Object>) result.get('output')).get('response')
    );
  }

  @isTest
  static void testGetNavigationV2communityPreviewFalse() {
    List<NavigationMenuItem> navMenuItem = [
      SELECT Label, NavigationLinkSetId, Target
      FROM NavigationMenuItem
      LIMIT 1
    ];
    List<NavigationLinkSet> navLinkSet = [
      SELECT Id, DeveloperName, NetworkId
      FROM NavigationLinkSet
      WHERE Id = :navMenuItem.get(0).NavigationLinkSetId
      LIMIT 1
    ];
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigationV2';
    String communityId = navLinkSet.get(0).NetworkId;
    String developerName = navLinkSet.get(0).DeveloperName;
    Boolean communityPreview = false;
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();
    Map<String, Object> result;
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
    Test.stopTest();
  }

  @isTest
  static void testGetNavigationV2communityPreviewNull() {
    List<NavigationMenuItem> navMenuItem = [
      SELECT Label, NavigationLinkSetId, Target
      FROM NavigationMenuItem
      LIMIT 1
    ];
    List<NavigationLinkSet> navLinkSet = [
      SELECT Id, DeveloperName, NetworkId
      FROM NavigationLinkSet
      WHERE Id = :navMenuItem.get(0).NavigationLinkSetId
      LIMIT 1
    ];
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigationV2';
    String communityId = navLinkSet.get(0).NetworkId;
    String developerName = navLinkSet.get(0).DeveloperName;
    Boolean communityPreview;
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();
    Map<String, Object> result;
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
    Test.stopTest();
  }

  @isTest
  static void testGetNavigationCommunityPreviewTrue() {
    List<NavigationMenuItem> navMenuItem = [
      SELECT Label, NavigationLinkSetId, Target
      FROM NavigationMenuItem
      LIMIT 1
    ];
    List<NavigationLinkSet> navLinkSet = [
      SELECT Id, DeveloperName, NetworkId
      FROM NavigationLinkSet
      WHERE Id = :navMenuItem.get(0).NavigationLinkSetId
      LIMIT 1
    ];
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigation';
    String communityId = navLinkSet.get(0).NetworkId;
    String developerName = navLinkSet.get(0).DeveloperName;
    Boolean communityPreview = true;
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();
    Map<String, Object> result;
    Test.startTest();
    try {
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
    } catch (Exception e) {
    }
    Test.stopTest();
  }

  @isTest
  static void testGetNavigationCommunityPreviewFalse() {
    List<NavigationMenuItem> navMenuItem = [
      SELECT Label, NavigationLinkSetId, Target
      FROM NavigationMenuItem
      LIMIT 1
    ];
    List<NavigationLinkSet> navLinkSet = [
      SELECT Id, DeveloperName, NetworkId
      FROM NavigationLinkSet
      WHERE Id = :navMenuItem.get(0).NavigationLinkSetId
      LIMIT 1
    ];
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigation';
    String communityId = navLinkSet.get(0).NetworkId;
    String developerName = navLinkSet.get(0).DeveloperName;
    Boolean communityPreview = false;
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();
    Map<String, Object> result;
    Test.startTest();
    try {
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
    } catch (Exception e) {
    }
    Test.stopTest();
  }

  @isTest
  static void testGetNavigationCommunityPreviewNull() {
    List<NavigationMenuItem> navMenuItem = [
      SELECT Label, NavigationLinkSetId, Target
      FROM NavigationMenuItem
      LIMIT 1
    ];
    List<NavigationLinkSet> navLinkSet = [
      SELECT Id, DeveloperName, NetworkId
      FROM NavigationLinkSet
      WHERE Id = :navMenuItem.get(0).NavigationLinkSetId
      LIMIT 1
    ];
    String extensionClass = 'SfGpsDsNavigationORA';
    String extensionClassAction = 'GetNavigation';
    String communityId = navLinkSet.get(0).NetworkId;
    String developerName = navLinkSet.get(0).DeveloperName;
    Boolean communityPreview;
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();
    Map<String, Object> result;
    Test.startTest();
    try {
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
    } catch (Exception e) {
    }
    Test.stopTest();
  }

  @isTest
  static void testGetBaseUrl() {
    String extensionClass = 'SfGpsDsNavigationORA';
    Callable extension = (Callable) Type.forName(extensionClass).newInstance();
    Map<String, Object> result;
    Test.startTest();
    result = (Map<String, Object>) extension.call(
      'GetBaseUrl',
      new Map<String, Object>{
        'input' => new Map<String, Object>{},
        'output' => new Map<String, Object>()
      }
    );
    Test.stopTest();
    System.assertEquals(
      URL.getOrgDomainURL().toExternalForm(),
      ((Map<String, Object>) result.get('output')).get('url')
    );
  }
}
