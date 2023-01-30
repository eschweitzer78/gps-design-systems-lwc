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
      when 'GetHierarchicalNavigation' {
        System.debug('> get hierarchical navigation');
        String developerName = (String) getTypedFromMap(
          WhereFrom.INPUT,
          'developerName',
          String.class,
          false
        );
        List<NavigationMenuItem> lnmi = getNavigationItems(developerName);
        Map<String, NavigationMenuItem> mnmi = new Map<String, NavigationMenuItem>();

        for (NavigationMenuItem nmi : lnmi) {
          mnmi.put(nmi.Id, nmi);
        }

        Map<String, Object> items = (Map<String, Object>) JSON.deserializeUntyped(
          JSON.serialize(mnmi)
        );
        List<Object> rootItems = new List<Object>();

        for (Object o : items.values()) {
          Map<String, Object> item = (Map<String, Object>) o;
          String parentId = (String) item.get('ParentId');

          if (parentId == null) {
            rootItems.add(item);
          } else {
            Map<String, Object> parent = (Map<String, Object>) items.get(
              parentId
            );

            List<Object> children = (List<Object>) parent.get('children');
            if (children == null) {
              children = new List<Object>();
              parent.put('children', children);
            }

            children.add(o);
          }
        }

        output.put('rootItems', rootItems);
        System.debug('< get hierarchical navigation');
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
