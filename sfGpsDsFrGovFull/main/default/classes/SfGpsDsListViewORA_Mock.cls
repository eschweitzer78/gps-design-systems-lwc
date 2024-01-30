@isTest
global class SfGpsDsListViewORA_Mock implements HttpCalloutMock {
  global HttpResponse respond(HttpRequest req) {
    if (req.getEndpoint() == null) {
      return null;
    } else if (req.getEndpoint().endsWith('/listviews')) {
      return respondListviews();
    } else if (req.getEndpoint().endsWith('/describe')) {
      return respondDescribe();
    }

    return null;
  }

  public HttpResponse respondListviews() {
    HttpResponse res = new HttpResponse();
    res.setHeader('Content-Type', 'application/json');
    res.setBody(
      '{"done":true,"listviews":[{"describeUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7UgEAL/describe",' +
        '"developerName":"PublicSector__AllAccounts","id":"00B5j00000GK7UgEAL","label":' +
        '"All Accounts","resultsUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7UgEAL/results",' +
        '"soqlCompatible":true,"url":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7UgEAL"},{"describeUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7YHEA1/describe",' +
        '"developerName":"All_Person_Accounts","id":"00B5j00000GK7YHEA1","label":' +
        '"All Person Accounts","resultsUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7YHEA1/results",' +
        '"soqlCompatible":true,"url":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7YHEA1"},{"describeUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7ZUEA1/describe",' +
        '"developerName":"NewThisWeek","id":"00B5j00000GK7ZUEA1","label":"New This Week",' +
        '"resultsUrl":"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7ZUEA1/results",' +
        '"soqlCompatible":true,"url":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7ZUEA1"},{"describeUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7ZvEAL/describe",' +
        '"developerName":"MyAccounts","id":"00B5j00000GK7ZvEAL","label":"My Accounts",' +
        '"resultsUrl":"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7ZvEAL/results",' +
        '"soqCompatible":true,"url":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7ZvEAL"},{"describeUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7a9EAD/describe",' +
        '"developerName":"RecentlyViewedAccounts","id":"00B5j00000GK7a9EAD","label":' +
        '"Recently Viewed Accounts","resultsUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7a9EAD/results",' +
        '"soqlCompatible":true,"url":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7a9EAD"},{"describeUrl":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7bEEAT/describe",' +
        '"developerName":"All_Organizations","id":"00B5j00000GK7bEEAT","label":"All Organizations",' +
        '"resultsUrl":"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7bEEAT/results",' +
        '"soqlCompatible":true,"url":' +
        '"/services/data/v54.0/sobjects/Account/listviews/00B5j00000GK7bEEAT"}],"nextRecordsUrl":' +
        'null,"size":6,"sobjectType":"Account"}'
    );
    res.setStatusCode(200);
    return res;
  }

  public HttpResponse respondDescribe() {
    HttpResponse res = new HttpResponse();
    res.setHeader('Content-Type', 'application/json');
    res.setBody(
      '{"columns":[{"ascendingLabel":"Z-A","descendingLabel":"A-Z","fieldNameOrPath":"Name",' +
        '"hidden":false,"label":"Account Name","searchable":true,"selectListItem":"Name",' +
        '"sortDirection":"ascending","sortIndex":0,"sortable":true,"type":"string"},' +
        '{"ascendingLabel":"Z-A","descendingLabel":"A-Z","fieldNameOrPath":"BillingState",' +
        '"hidden":false,"label":"Billing State/Province","searchable":true,"selectListItem":' +
        '"BillingState","sortDirection":null,"sortIndex":null,"sortable":true,"type":"string"},' +
        '{"ascendingLabel":"9-0","descendingLabel":"0-9","fieldNameOrPath":"Phone","hidden":false,' +
        '"label":"Phone","searchable":true,"selectListItem":"Phone","sortDirection":null,' +
        '"sortIndex":null,"sortable":true,"type":"phone"},{"ascendingLabel":"Low to High",' +
        '"descendingLabel":"High to Low","fieldNameOrPath":"Type","hidden":false,"label":"Type",' +
        '"searchable":true,"selectListItem":"toLabel(Type)","sortDirection":null,"sortIndex":null,' +
        '"sortable":true,"type":"picklist"},{"ascendingLabel":"Z-A","descendingLabel":"A-Z",' +
        '"fieldNameOrPath":"Owner.Alias","hidden":false,"label":"Account Owner Alias","searchable":' +
        'false,"selectListItem":"Owner.Alias","sortDirection":null,"sortIndex":null,"sortable":true,' +
        '"type":"string"},{"ascendingLabel":null,"descendingLabel":null,"fieldNameOrPath":"Id",' +
        '"hidden":true,"label":"Account ID","searchable":false,"selectListItem":"Id","sortDirection"' +
        ':null,"sortIndex":null,"sortable":false,"type":"id"},{"ascendingLabel":null,' +
        '"descendingLabel":null,"fieldNameOrPath":"RecordTypeId","hidden":true,"label":' +
        '"Record Type ID","searchable":false,"selectListItem":"RecordTypeId","sortDirection":null,' +
        '"sortIndex":null,"sortable":false,"type":"reference"},{"ascendingLabel":null,' +
        '"descendingLabel":null,"fieldNameOrPath":"CreatedDate","hidden":true,"label":"Created Date"' +
        ',"searchable":false,"selectListItem":"CreatedDate","sortDirection":null,"sortIndex":null,' +
        '"sortable":false,"type":"datetime"},{"ascendingLabel":null,"descendingLabel":null,' +
        '"fieldNameOrPath":"LastModifiedDate","hidden":true,"label":"Last Modified Date",' +
        '"searchable":false,"selectListItem":"LastModifiedDate","sortDirection":null,"sortIndex":' +
        'null,"sortable":false,"type":"datetime"},{"ascendingLabel":null,"descendingLabel":null,' +
        '"fieldNameOrPath":"SystemModstamp","hidden":true,"label":"System Modstamp","searchable":' +
        'false,"selectListItem":"SystemModstamp","sortDirection":null,"sortIndex":null,"sortable":' +
        'false,"type":"datetime"},{"ascendingLabel":null,"descendingLabel":null,"fieldNameOrPath":' +
        '"Owner.Id","hidden":true,"label":"User ID","searchable":false,"selectListItem":"Owner.Id",' +
        '"sortDirection":null,"sortIndex":null,"sortable":false,"type":"id"},{"ascendingLabel":null,' +
        '"descendingLabel":null,"fieldNameOrPath":"OwnerId","hidden":true,"label":"Owner ID",' +
        '"searchable":false,"selectListItem":"OwnerId","sortDirection":null,"sortIndex":null,' +
        '"sortable":false,"type":"reference"}],"id":"00B5j00000GK7a9","orderBy":[{"fieldNameOrPath":' +
        '"Name","nullsPosition":"first","sortDirection":"ascending"},{"fieldNameOrPath":"Id",' +
        '"nullsPosition":"first","sortDirection":"ascending"}],"query":"SELECT Name, BillingState, ' +
        // Tweak this as scratch orgs do not have RecordTypeId until when a record type is created
        // 'Phone, toLabel(Type), Owner.Alias, Id, RecordTypeId, CreatedDate, LastModifiedDate, ' +
        'Phone, toLabel(Type), Owner.Alias, Id, CreatedDate, LastModifiedDate, ' +
        'SystemModstamp, Owner.Id, OwnerId FROM Account USING SCOPE mru ORDER BY Name ASC NULLS ' +
        'FIRST, Id ASC NULLS FIRST","relatedEntityId":null,"scope":"mru","scopeEntityId":null,' +
        '"sobjectType":"Account","whereCondition":{"conditions":[],"conjunction":"and"}}'
    );
    res.setStatusCode(200);
    return res;
  }
}
