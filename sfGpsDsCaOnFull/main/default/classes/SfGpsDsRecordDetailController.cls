/* ApexSOQLInject rule turned off as everything stems from a recordId with no further user input */
@SuppressWarnings('PMD.ApexSOQLInjection')
public with sharing class SfGpsDsRecordDetailController {
  @AuraEnabled(cacheable=true)
  public static List<String> getRecordSummary(String recordId) {
    String sObjectApiName;
    String sObjectLabel;
    String nameField;

    try {
      sObjectType soType = ((Id) recordId).getSObjectType();
      DescribeSObjectResult dor = soType.getDescribe();
      sObjectApiName = dor.getName();
      sObjectLabel = dor.getLabelPlural();
      sObjectField[] fields = dor.fields.getMap().values();

      for (sObjectField field : fields) {
        DescribeFieldResult dfr = field.getDescribe();

        if (dfr.isNameField()) {
          nameField = dfr.getName();
          break;
        }
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }

    if (nameField == null) {
      throw new AuraHandledException(
        'Cannot get name field for ' + sObjectApiName
      );
    }

    try {
      String query =
        'SELECT ' +
        nameField +
        ' FROM ' +
        sObjectApiName +
        ' WHERE Id = :recordId';
      List<sObject> recordList = database.query(query, AccessLevel.USER_MODE);

      return new List<String>{
        sObjectLabel,
        sObjectApiName,
        (recordList.size() > 0) ? (String) recordList[0].get(nameField) : ''
      };
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static String getObjectSummary(String objectApiName) {
    try {
      Type t = Type.forName(objectApiName);
      return ((sObject) t.newInstance())
        .getSObjectType()
        .getDescribe()
        .getLabelPlural();
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
