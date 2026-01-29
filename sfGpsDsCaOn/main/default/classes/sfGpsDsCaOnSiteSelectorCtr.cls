/**
 * @description Controller for Site Selector Visualforce page.
 * Provides ESRI API key, community URL, and default coordinates.
 * LWR/LWS compatible via postMessage origin validation.
 *
 * @author Shannon Schupbach, Jeremy Blankenship
 * @since 2026
 */
public with sharing class sfGpsDsCaOnSiteSelectorCtr {
  /** @description ESRI API key for map services */
  public String apiKey { get; set; }

  /** @description Default latitude for map center */
  public String defaultLatitude { get; set; }

  /** @description Default longitude for map center */
  public String defaultLongitude { get; set; }

  /** @description Community URL for postMessage origin validation */
  public String communityUrl { get; set; }

  /** @description Whether the loading resource exists */
  public Boolean hasLoadingResource { get; set; }

  /**
   * @description Constructor - initializes configuration from custom metadata
   */
  public sfGpsDsCaOnSiteSelectorCtr() {
    // Get ESRI API key from custom metadata
    // Uses the same pattern as PSA-ESRI-MAPS-LWR-DEV
    apiKey = getCustomMetadataValue('ESRI_API_Key');

    // Get default coordinates from URL parameters or custom metadata
    defaultLatitude = ApexPages.currentPage().getParameters().get('latitude');
    defaultLongitude = ApexPages.currentPage().getParameters().get('longitude');

    // Fall back to custom metadata defaults if not provided
    if (String.isBlank(defaultLatitude)) {
      defaultLatitude = getCustomMetadataValue('Default_Latitude');
      if (String.isBlank(defaultLatitude)) {
        defaultLatitude = '43.6532'; // Toronto
      }
    }

    if (String.isBlank(defaultLongitude)) {
      defaultLongitude = getCustomMetadataValue('Default_Longitude');
      if (String.isBlank(defaultLongitude)) {
        defaultLongitude = '-79.3832'; // Toronto
      }
    }

    // Get community URL for postMessage validation
    communityUrl = fetchCommunityURL();

    // Check if loading resource exists
    hasLoadingResource = checkResourceExists('sfGpsDsCaOnLoading');
  }

  /**
   * @description Gets a value from custom metadata (utils__mdt - PSA-ESRI-MAPS pattern)
   * @param developerName The custom metadata record developer name
   * @return The value or empty string if not found
   */
  private String getCustomMetadataValue(String developerName) {
    try {
      // Use utils__mdt (PSA-ESRI-MAPS pattern) via dynamic query
      // This avoids compile-time dependency on custom metadata type
      String query = 'SELECT Value__c FROM utils__mdt WHERE DeveloperName = :developerName LIMIT 1';
      List<SObject> utils = Database.query(query);
      if (!utils.isEmpty() && utils[0].get('Value__c') != null) {
        return (String) utils[0].get('Value__c');
      }
    } catch (Exception e) {
      // Custom metadata may not exist yet
      System.debug(
        LoggingLevel.WARN,
        'Could not fetch custom metadata: ' +
          developerName +
          ' - ' +
          e.getMessage()
      );
    }
    return '';
  }

  /**
   * @description Fetches the community URL for postMessage validation
   * @return The secure URL of the community site
   */
  @AuraEnabled(cacheable=true)
  public static String fetchCommunityURL() {
    try {
      // Get site name from custom metadata or use default
      String siteName = 'EASR'; // Default site name

      // Try to get from utils__mdt (PSA-ESRI-MAPS pattern)
      try {
        String query = 'SELECT Value__c FROM utils__mdt WHERE DeveloperName = \'SiteName\' LIMIT 1';
        List<SObject> configs = Database.query(query);
        if (!configs.isEmpty() && configs[0].get('Value__c') != null) {
          siteName = (String) configs[0].get('Value__c');
        }
      } catch (Exception ex) {
        // Custom metadata doesn't exist, use default
      }

      // Query Site and SiteDetail
      List<Site> sites = [
        SELECT Id, Name
        FROM Site
        WHERE Name = :siteName
        WITH USER_MODE
        LIMIT 1
      ];

      if (!sites.isEmpty()) {
        List<SiteDetail> details = [
          SELECT SecureURL
          FROM SiteDetail
          WHERE DurableId = :sites[0].Id
          WITH USER_MODE
          LIMIT 1
        ];

        if (!details.isEmpty() && details[0].SecureURL != null) {
          // Extract just the origin (protocol + hostname) from the URL
          // event.origin in JavaScript only contains protocol://hostname, not the path
          String secureUrl = details[0].SecureURL;
          try {
            URL urlObj = new URL(secureUrl);
            // Return just protocol + host (origin)
            return urlObj.getProtocol() + '://' + urlObj.getHost();
          } catch (Exception urlEx) {
            // If URL parsing fails, try to extract origin manually
            // Find the third slash (after protocol://)
            Integer thirdSlash = secureUrl.indexOf('/', 8);
            if (thirdSlash > 0) {
              return secureUrl.substring(0, thirdSlash);
            }
            return secureUrl.removeEnd('/');
          }
        }
      }
    } catch (Exception e) {
      System.debug(
        LoggingLevel.WARN,
        'Could not fetch community URL: ' + e.getMessage()
      );
    }
    return '';
  }

  /**
   * @description Fetches the Visualforce domain URL for postMessage origin
   * @return The Visualforce domain URL
   */
  @AuraEnabled(cacheable=true)
  public static String fetchVFDomainURL() {
    return 'https://' + DomainCreator.getVisualforceHostname('');
  }

  /**
   * @description Checks if a static resource exists
   * @param resourceName The static resource name
   * @return True if the resource exists
   */
  private Boolean checkResourceExists(String resourceName) {
    try {
      List<StaticResource> resources = [
        SELECT Id
        FROM StaticResource
        WHERE Name = :resourceName
        LIMIT 1
      ];
      return !resources.isEmpty();
    } catch (Exception e) {
      return false;
    }
  }
}
