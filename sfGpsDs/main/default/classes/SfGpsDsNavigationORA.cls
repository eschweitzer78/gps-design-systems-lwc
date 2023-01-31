global without sharing class SfGpsDsNavigationORA extends SfGpsDsBaseORA implements Callable {
  global Object call(String action, Map<String, Object> args) {
    init(args);

    switch on action {
      when 'GetNavigation' {
        String developerName = (String) getTypedFromMap(
          WhereFrom.INPUT,
          'developerName',
          String.class,
          false
        );

        Id communityId = (Id) getTypedFromMap(
          WhereFrom.INPUT,
          'communityId',
          Id.class,
          false
        );

        Boolean communityPreview = (Boolean) getTypedFromMap(
          WhereFrom.INPUT,
          'communityPreview',
          Boolean.class,
          true
        );

        if (communityPreview == null) {
          communityPreview = false;
        }

        List<ConnectApi.NavigationMenuItem> lcnmi = getNavigationItems(
          communityId,
          developerName,
          communityPreview
        );

        output.put('items', JSON.deserializeUntyped(JSON.serialize(lcnmi)));
      }
      when 'GetBaseUrl' {
        output.put('url', getBaseUrl());
      }
      when else {
        throw new MalformedCallException('Method not implemented');
      }
    }

    return args;
  }

  @AuraEnabled(cacheable=false)
  public static List<ConnectApi.NavigationMenuItem> getNavigationItems(
    String communityId,
    String developerName,
    Boolean communityPreview
  ) {
    try {
      ConnectApi.NavigationMenuItemCollection coll = ConnectApi.NavigationMenu.getCommunityNavigationMenu(
        communityId,
        null,
        developerName,
        communityPreview
          ? ConnectApi.PublishStatus.Draft
          : ConnectApi.PublishStatus.Live,
        false,
        false,
        null
      );

      return coll.menuItems;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static String getBaseUrl() {
    return URL.getSalesforceBaseUrl().toExternalForm();
  }

  public class MalformedCallException extends Exception {
  }
}
