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
      when 'GetNavigationV2' {
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

        GetNavigationItemsResp resp = getNavigationItemsV2(
          communityId,
          developerName,
          communityPreview
        );

        output.put('response', JSON.deserializeUntyped(JSON.serialize(resp)));
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

  public class GetNavigationItemsResp {
    public List<ConnectApi.NavigationMenuItem> items;
    public String errorMessage;
  }

  @AuraEnabled(cacheable=false)
  public static GetNavigationItemsResp getNavigationItemsV2(
    String communityId,
    String developerName,
    Boolean communityPreview
  ) {
    GetNavigationItemsResp resp = new GetNavigationItemsResp();

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

      resp.items = coll.menuItems;
    } catch (Exception e) {
      resp.errorMessage = e.getMessage();
    }

    return resp;
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
