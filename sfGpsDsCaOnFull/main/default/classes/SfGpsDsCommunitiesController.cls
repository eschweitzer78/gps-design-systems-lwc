public with sharing class SfGpsDsCommunitiesController {
  public class RegistrationException extends Exception {
  }

  private static final String[] WHITELISTED_FIELDNAMES = new List<String>{
    'Email',
    'FirstName',
    'LastName',
    'AboutMe',
    'Title',
    'Street',
    'City',
    'PostalCode',
    'State',
    'Country',
    'Fax',
    'Phone',
    'MobilePhone'
  };

  @AuraEnabled(cacheable=false)
  public static Map<String, Object> getAuthConfig() {
    return SfGpsDsCommunitiesUtilities.getAuthConfig();
  }

  @AuraEnabled(cacheable=false)
  public static String userLogin(String username, String password) {
    try {
      PageReference pageRef = Site.login(username, password, '/');
      return pageRef != null ? pageRef.getUrl() : null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=false)
  public static Boolean userForgotPassword(String username) {
    try {
      if (Site.isValidUserName(username)) {
        return Site.forgotPassword(username);
      } else {
        return false;
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
