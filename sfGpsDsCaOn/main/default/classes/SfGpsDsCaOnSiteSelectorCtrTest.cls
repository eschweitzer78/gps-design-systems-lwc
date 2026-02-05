/**
 * @description Test class for SfGpsDsCaOnSiteSelectorCtr
 * Tests the Site Selector Visualforce controller functionality.
 *
 * @author Shannon Schupbach
 * @since 2026
 */
@IsTest
private class SfGpsDsCaOnSiteSelectorCtrTest {
  /**
   * @description Test constructor with default values (no URL parameters)
   */
  @IsTest
  static void testConstructorDefaults() {
    // Setup - no URL parameters
    Test.setCurrentPage(Page.sfGpsDsCaOnSiteSelectorPage);

    Test.startTest();
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    Test.stopTest();

    // Verify defaults are set (either from custom metadata or hardcoded defaults)
    System.assertNotEquals(
      null,
      controller.defaultLatitude,
      'Default latitude should be set'
    );
    System.assertNotEquals(
      null,
      controller.defaultLongitude,
      'Default longitude should be set'
    );

    // Verify values are valid coordinates (not empty)
    System.assert(
      String.isNotBlank(controller.defaultLatitude),
      'Default latitude should not be blank'
    );
    System.assert(
      String.isNotBlank(controller.defaultLongitude),
      'Default longitude should not be blank'
    );

    // Verify values are numeric
    try {
      Decimal lat = Decimal.valueOf(controller.defaultLatitude);
      Decimal lng = Decimal.valueOf(controller.defaultLongitude);
      System.assert(lat >= -90 && lat <= 90, 'Latitude should be valid range');
      System.assert(
        lng >= -180 && lng <= 180,
        'Longitude should be valid range'
      );
    } catch (Exception e) {
      System.assert(
        false,
        'Coordinates should be valid decimals: ' + e.getMessage()
      );
    }
  }

  /**
   * @description Test constructor with URL parameters for coordinates
   */
  @IsTest
  static void testConstructorWithUrlParams() {
    // Setup - with URL parameters
    PageReference pageRef = Page.sfGpsDsCaOnSiteSelectorPage;
    pageRef.getParameters().put('latitude', '45.4215');
    pageRef.getParameters().put('longitude', '-75.6972');
    Test.setCurrentPage(pageRef);

    Test.startTest();
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    Test.stopTest();

    // Verify URL parameters override defaults
    System.assertEquals(
      '45.4215',
      controller.defaultLatitude,
      'Latitude should come from URL parameter'
    );
    System.assertEquals(
      '-75.6972',
      controller.defaultLongitude,
      'Longitude should come from URL parameter'
    );
  }

  /**
   * @description Test constructor with partial URL parameters
   */
  @IsTest
  static void testConstructorWithPartialUrlParams() {
    // Setup - only latitude in URL
    PageReference pageRef = Page.sfGpsDsCaOnSiteSelectorPage;
    pageRef.getParameters().put('latitude', '45.4215');
    // longitude not set
    Test.setCurrentPage(pageRef);

    Test.startTest();
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    Test.stopTest();

    // Verify latitude from URL
    System.assertEquals(
      '45.4215',
      controller.defaultLatitude,
      'Latitude should come from URL parameter'
    );

    // Verify longitude is set (from custom metadata or hardcoded default)
    System.assertNotEquals(
      null,
      controller.defaultLongitude,
      'Longitude should be set'
    );
    System.assert(
      String.isNotBlank(controller.defaultLongitude),
      'Longitude should not be blank'
    );
  }

  /**
   * @description Test fetchCommunityURL method
   */
  @IsTest
  static void testFetchCommunityURL() {
    Test.startTest();
    String communityUrl = SfGpsDsCaOnSiteSelectorCtr.fetchCommunityURL();
    Test.stopTest();

    // In test context without a real Site, this should return empty or handle gracefully
    // The method should not throw an exception
    System.assertNotEquals(
      null,
      communityUrl,
      'Community URL should not be null'
    );
  }

  /**
   * @description Test fetchVFDomainURL method
   */
  @IsTest
  static void testFetchVFDomainURL() {
    Test.startTest();
    String vfDomain = SfGpsDsCaOnSiteSelectorCtr.fetchVFDomainURL();
    Test.stopTest();

    // Verify VF domain is returned
    System.assertNotEquals(null, vfDomain, 'VF Domain URL should not be null');
    System.assert(
      vfDomain.startsWith('https://'),
      'VF Domain should start with https://'
    );
    System.assert(
      vfDomain.contains('.force.com') || vfDomain.contains('.visualforce.com'),
      'VF Domain should contain force.com or visualforce.com'
    );
  }

  /**
   * @description Test that API key property is accessible
   */
  @IsTest
  static void testApiKeyProperty() {
    Test.setCurrentPage(Page.sfGpsDsCaOnSiteSelectorPage);

    Test.startTest();
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    String apiKey = controller.apiKey;
    Test.stopTest();

    // API key may be empty in test context without custom metadata
    // Just verify it doesn't throw an exception
    System.assertNotEquals(
      null,
      apiKey,
      'API key should not be null (may be empty)'
    );
  }

  /**
   * @description Test that community URL property is accessible
   */
  @IsTest
  static void testCommunityUrlProperty() {
    Test.setCurrentPage(Page.sfGpsDsCaOnSiteSelectorPage);

    Test.startTest();
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    String communityUrl = controller.communityUrl;
    Test.stopTest();

    // Community URL may be empty in test context without a real Site
    System.assertNotEquals(
      null,
      communityUrl,
      'Community URL should not be null (may be empty)'
    );
  }

  /**
   * @description Test hasLoadingResource property
   */
  @IsTest
  static void testHasLoadingResourceProperty() {
    Test.setCurrentPage(Page.sfGpsDsCaOnSiteSelectorPage);

    Test.startTest();
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    Boolean hasResource = controller.hasLoadingResource;
    Test.stopTest();

    // Should return false since sfGpsDsCaOnLoading resource doesn't exist
    System.assertEquals(
      false,
      hasResource,
      'hasLoadingResource should be false'
    );
  }

  /**
   * @description Test controller handles missing custom metadata gracefully
   */
  @IsTest
  static void testMissingCustomMetadata() {
    Test.setCurrentPage(Page.sfGpsDsCaOnSiteSelectorPage);

    Test.startTest();
    // This should not throw an exception even without custom metadata
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    Test.stopTest();

    // Verify controller initialized successfully with defaults
    System.assertNotEquals(
      null,
      controller,
      'Controller should be instantiated'
    );
    System.assertNotEquals(
      null,
      controller.defaultLatitude,
      'Should have default latitude'
    );
    System.assertNotEquals(
      null,
      controller.defaultLongitude,
      'Should have default longitude'
    );
  }

  /**
   * @description Test controller with empty URL parameters
   */
  @IsTest
  static void testEmptyUrlParams() {
    PageReference pageRef = Page.sfGpsDsCaOnSiteSelectorPage;
    pageRef.getParameters().put('latitude', '');
    pageRef.getParameters().put('longitude', '');
    Test.setCurrentPage(pageRef);

    Test.startTest();
    SfGpsDsCaOnSiteSelectorCtr controller = new SfGpsDsCaOnSiteSelectorCtr();
    Test.stopTest();

    // Empty strings should fall back to defaults (from custom metadata or hardcoded)
    System.assertNotEquals(
      null,
      controller.defaultLatitude,
      'Should have latitude'
    );
    System.assertNotEquals(
      null,
      controller.defaultLongitude,
      'Should have longitude'
    );
    System.assert(
      String.isNotBlank(controller.defaultLatitude),
      'Latitude should not be blank'
    );
    System.assert(
      String.isNotBlank(controller.defaultLongitude),
      'Longitude should not be blank'
    );

    // Verify values are valid coordinates
    try {
      Decimal lat = Decimal.valueOf(controller.defaultLatitude);
      Decimal lng = Decimal.valueOf(controller.defaultLongitude);
      System.assert(lat >= -90 && lat <= 90, 'Latitude should be valid range');
      System.assert(
        lng >= -180 && lng <= 180,
        'Longitude should be valid range'
      );
    } catch (Exception e) {
      System.assert(
        false,
        'Coordinates should be valid decimals: ' + e.getMessage()
      );
    }
  }
}
