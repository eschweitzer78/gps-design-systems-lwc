public with sharing class SfGpsDsUserController {
  @AuraEnabled(cacheable=true)
  public static UserDetails getUser() {
    Id networkId = Network.getNetworkId();
    UserDetails ud = new UserDetails();

    Network n = networkId != null
      ? [
          SELECT Id, UrlPathPrefix
          FROM Network
          WHERE Id = :networkId
          WITH USER_MODE
        ]
      : null;

    User u = [
      SELECT Id, Alias
      FROM User
      WHERE Id = :UserInfo.getUserId()
      WITH USER_MODE
    ];

    ud.userAlias = u.Alias;
    ud.isGuest = (UserInfo.getUserType() == 'Guest');
    ud.cBasePath = n != null ? n.UrlPathPrefix : null;

    return ud;
  }

  public class UserDetails {
    public @AuraEnabled
    String userAlias;

    public @AuraEnabled
    Boolean isGuest;

    public @AuraEnabled
    String cBasePath;
  }
}
