global without sharing class SfGpsDsNavigationORA extends SfGpsDsBaseORA implements Callable {
  global Object call(String action, Map<String, Object> args) {
    init(args);

    switch on action {
      when 'GetNavigation' {
        System.debug('> get navigation');
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

        List<NavigationMenuItem> lnmi = getNavigationItems(developerName);
        System.debug('get navigation found ' + JSON.serialize(lnmi));
        //output.put('items', JSON.deserializeUntyped(JSON.serialize(lnmi)));

        List<NavigationMenuItem> items = [
          SELECT Id, Label, NavigationLinkSetId
          FROM NavigationMenuItem
        ];

        System.debug('found ' + items.size() + ' items');
        for (NavigationMenuItem i : items) {
          System.debug(
            'LinkSet --> ' +
            i.Id +
            ' / ' +
            i.Label +
            ' ' +
            i.NavigationLinkSetId +
            ' <--'
          );
        }

        List<ConnectApi.NavigationMenuItem> lcnmi = getNavigationItems2(
          communityId,
          developerName,
          communityPreview
        );
        System.debug('getCommunityNavigationMenu2 ' + lcnmi);
        output.put('items', JSON.deserializeUntyped(JSON.serialize(lcnmi)));

        System.debug('< get navigation');
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
  public static List<NavigationMenuItem> getNavigationItems(
    String developerName
  ) {
    try {
      return [
        SELECT
          Id,
          AccessRestriction,
          Label,
          ParentId,
          Position,
          Status,
          Target,
          TargetPrefs,
          Type
        FROM NavigationMenuItem
        WHERE NavigationLinkSet.DeveloperName = :developerName
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }

    /* TODO: deal with NavigationTopics
        public static ConnectAPI.ManagedTopicCollection getNavigationTopics(){
        return ConnectAPI.ManagedTopics.getManagedTopics('YourCommunityId', 
        ConnectApi.ManagedTopicType.Navigational);
    } 
    when a topic is selected in a nav topic menu, goes to page
    .../topic/[topicId]/[topicName]
    */
  }

  @AuraEnabled(cacheable=false)
  public static List<ConnectApi.NavigationMenuItem> getNavigationItems2(
    String communityId,
    String developerName,
    Boolean communityPreview
  ) {
    System.debug('getNavigationItems2 ' + communityId + ' ' + developerName);
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
