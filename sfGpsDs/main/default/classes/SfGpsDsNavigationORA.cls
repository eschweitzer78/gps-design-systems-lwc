global class SfGpsDsNavigationORA extends SfGpsDsBaseORA implements Callable {
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
        List<NavigationMenuItem> lnmi = getNavigationItems(developerName);
        output.put('items', JSON.deserializeUntyped(JSON.serialize(lnmi)));
      }
      when 'GetHierarchicalNavigation' {
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

  @AuraEnabled(cacheable=true)
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
  }

  @AuraEnabled(cacheable=true)
  public static String getBaseUrl() {
    return URL.getSalesforceBaseUrl().toExternalForm();
  }

  public class MalformedCallException extends Exception {
  }
}
