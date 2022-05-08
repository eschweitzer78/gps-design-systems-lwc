/* Current status: DEV */

global with sharing class SfGpsDsListViewORA extends SfGpsDsBaseORA implements Callable {
  global Object call(String action, Map<String, Object> args) {
    init(args);

    switch on action {
      when 'GetRecords' {
        try {
          String objectName = (String) getTypedFromMap(
            WhereFrom.INPUT,
            'objectName',
            String.class,
            false
          );
          String listViewId = (String) getTypedFromMap(
            WhereFrom.INPUT,
            'objectName',
            String.class,
            true
          );
          String listViewName = (String) getTypedFromMap(
            WhereFrom.INPUT,
            'objectName',
            String.class,
            true
          );
          getListViewRecords(objectName, listViewId, listViewName);
        } catch (Exception e) {
          setError('Exception in GetRecords');
        }
      }
      when else {
        setError('Method ' + action + ' not available');
      }
    }

    return args;
  }

  @AuraEnabled(cacheable=true)
  public static ListViewInfoList getListViews(String objectName) {
    try {
      HttpRequest req = new HttpRequest();
      String endpointUrl =
        'callout:sfGpsDsApi/v52.0/sobjects/' +
        objectName +
        '/listviews';

      req.setEndpoint(endpointUrl);
      req.setMethod('GET');

      Http http = new Http();
      HttpResponse response = http.send(req);

      if (response.getStatusCode() == 200) {
        System.debug(response.getBody());
        ListViewInfoList listviews = (ListViewInfoList) JSON.deserialize(
          response.getBody(),
          ListViewInfoList.class
        );

        return listviews;
      }

      throw new AuraHandledException(response.getStatus());
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  static String getListViewIdByName(String objectName, String listviewName) {
    try {
      HttpRequest req = new HttpRequest();
      String endpointUrl =
        'callout:sfGpsDsApi/v52.0/sobjects/' +
        objectName +
        '/listviews';

      req.setEndpoint(endpointUrl);
      req.setMethod('GET');

      Http http = new Http();
      HttpResponse response = http.send(req);

      if (response.getStatusCode() == 200) {
        System.debug(response.getBody());
        ListViewInfoList listviews = (ListViewInfoList) JSON.deserialize(
          response.getBody(),
          ListViewInfoList.class
        );

        for (ListViewInfo info : listviews.listviews) {
          if (info.developerName == listviewName) {
            return info.id;
          }
        }
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }

    return null;
  }

  @AuraEnabled(cacheable=true)
  public static List<sObject> getListViewRecords(
    String objectName,
    String listViewId,
    String listViewName
  ) {
    try {
      if ((listViewId == null || listViewId == '') && (listViewName != null)) {
        listViewId = getListViewIdByName(objectName, listViewName);
      }

      HttpRequest req = new HttpRequest();
      String endpointUrl =
        'callout:sfGpsDsApi/v52.0/sobjects/' +
        objectName +
        '/listviews/' +
        listViewId +
        '/describe';

      req.setEndpoint(endpointUrl);
      req.setMethod('GET');

      Http http = new Http();
      HttpResponse response = http.send(req);

      if (response.getStatusCode() == 200) {
        System.debug(response.getBody());
        ListViewDescribe listview = (ListViewDescribe) JSON.deserialize(
          response.getBody(),
          ListViewDescribe.class
        );
        List<sObject> rows = Database.query(listview.query);

        return rows;
      }

      throw new AuraHandledException(response.getStatus());
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  public class MalformedCallException extends Exception {
  }

  public class ListViewColumn {
    public String ascendingLabel; // Z-A, A-Z
    public String descendingLabel;
    public String fieldNameOrPath;
    public Boolean hidden;
    public String label;
    public String selectListItem;
    public String sortDirection; // ascending, descending
    public Integer sortIndex;
    public Boolean sortable;
    public String type;
  }

  public class ListViewOrderBy {
    public String fieldNameOrPath;
    public String nullsPosition; // first
    public String sortDirecion; // ascending, descending
  }

  public class ListViewDescribe {
    public String id;
    public List<ListViewColumn> columns;
    public List<ListViewOrderBy> orderBy;
    public String query;
    public String scope;
    public String sobjectType;
  }

  public class ListViewInfo {
    public String describeUrl;
    public String developerName;
    public String id;
    public String label;
    public String resultsUrl;
    public Boolean soqlCompatible;
    public String url;
  }

  public class ListViewInfoList {
    public Boolean done;
    public List<ListViewInfo> listviews;
    public String nextRecordsUrl;
    public Integer size;
    public String sobjectType;
  }
}
