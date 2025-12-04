public without sharing class SfGpsDsCommunitiesUtilities {
  private static Boolean orgPersonAccountStatus = Schema.sObjectType.Account.fields.getMap()
    .containsKey('isPersonAccount');

  public static Boolean isPersonAccountEnabled() {
    return orgPersonAccountStatus;
  }

  public static Map<String, Object> getAuthConfig() {
    Map<String, Object> rv = new Map<String, Object>();

    Id networkId = Network.getNetworkId();
    String baseUrl = Site.getBaseSecureUrl();
    String pathPrefix = Site.getPathPrefix();
    Boolean isLoginEnabled = Site.isLoginEnabled();
    Boolean isRegistrationEnabled = Site.isRegistrationEnabled();

    System.debug(UserInfo.getUserId());

    rv.put('baseUrl', baseUrl);
    rv.put('pathPrefix', pathPrefix);
    rv.put('isLoginEnabled', isLoginEnabled);
    rv.put('registrationIsEnabled1', isRegistrationEnabled);
    rv.put('communitiesLanding', Network.communitiesLanding().getUrl());
    rv.put('loginUrl1', Network.getLoginUrl(networkId));
    rv.put('registrationUrl1', Network.getSelfRegUrl(networkId));

    Auth.AuthConfiguration authConfig = new Auth.AuthConfiguration(
      baseUrl,
      baseUrl
    );
    List<AuthProvider> authProviders = authConfig.getAuthProviders();
    List<SamlSsoConfig> samlProviders = authConfig.getSamlProviders();

    rv.put('backgroundColor', authConfig.getBackgroundColor());
    rv.put('footerText', authConfig.getFooterText());
    rv.put('forgotPasswordUrl', authConfig.getForgotPasswordUrl());
    rv.put('startUrl', authConfig.getStartUrl());
    rv.put('usernamePasswordEnabled', authConfig.getUsernamePasswordEnabled());

    Boolean selfRegEnabled = authConfig.getSelfRegistrationEnabled();
    rv.put('registrationEnabled', selfRegEnabled);
    String selfRegPasswordPolicyStatement;

    if (selfRegEnabled) {
      try {
        selfRegPasswordPolicyStatement = Site.getPasswordPolicyStatement();
      } catch (Exception e) {
        selfRegPasswordPolicyStatement = null;
      }
    }

    rv.put('registrationPasswordPolicy', selfRegPasswordPolicyStatement);

    for (AuthProvider authProvider : authProviders) {
      rv.put('auth:' + authProvider, 'Yo');
    }

    for (String key : rv.keySet()) {
      System.debug(key + '=' + rv.get(key));
    }

    return rv;
  }
}
