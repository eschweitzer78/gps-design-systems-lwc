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
          true
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

        List<Object> rv = (List<Object>) JSON.deserializeUntyped(
          JSON.serialize(lcnmi)
        );
        handleNavigationItemsEntities(rv);

        output.put('items', rv);
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
          true
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

        Map<String, Object> rv = (Map<String, Object>) JSON.deserializeUntyped(
          JSON.serialize(resp)
        );
        handleNavigationItemsEntities((List<Object>) rv.get('items'));
        output.put('response', rv);
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
    public @AuraEnabled
    List<ConnectApi.NavigationMenuItem> items;
    public @AuraEnabled
    String errorMessage;
  }

  @AuraEnabled(cacheable=false)
  public static GetNavigationItemsResp getNavigationItemsV2(
    String communityId,
    String developerName,
    Boolean communityPreview
  ) {
    GetNavigationItemsResp resp = new GetNavigationItemsResp();
    try {
      resp.items = getNavigationItems(
        communityId,
        developerName,
        communityPreview
      );
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
      Id cId = communityId != null
        ? Id.valueOf(communityId) // To cater to 15 vs 18 char
        : null;

      ConnectApi.NavigationMenuItemCollection coll = (cId != null)
        ? ConnectApi.NavigationMenu.getCommunityNavigationMenu(
            cId,
            null,
            developerName,
            communityPreview
              ? ConnectApi.PublishStatus.Draft
              : ConnectApi.PublishStatus.Live,
            false,
            false,
            null
          )
        : null;

      return coll != null
        ? coll.menuItems
        : new List<ConnectApi.NavigationMenuItem>();
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @TestVisible
  static List<Object> handleNavigationItemsEntities(List<Object> items) {
    if (items != null) {
      for (Object item : items) {
        Map<String, Object> mapItem = (Map<String, Object>) item;
        String label = ((String) mapItem.get('label'))?.unescapeHtml4();

        if (label != null) {
          mapItem.put('label', label);
          handleNavigationItemsEntities((List<Object>) mapItem.get('subMenu'));
        }
      }
    }

    return items;
  }

  @AuraEnabled(cacheable=true)
  public static String getBaseUrl() {
    return URL.getOrgDomainURL().toExternalForm();
  }

  public class MalformedCallException extends Exception {
  }
}
