public with sharing class SfGpsDsListViewController {
  static final String ID_FIELDNAME = 'Id';
  static final String RECORDTYPEID_FIELDNAME = 'RecordTypeId';

  public class ListColumn {
    public @AuraEnabled
    String fieldApiName;
    public @AuraEnabled
    String label;
    public @AuraEnabled
    Boolean sortable;

    public ListColumn(String fieldApiName, String label, Boolean sortable) {
      this.fieldApiName = fieldApiName;
      this.label = label;
      this.sortable = sortable;
    }
  }

  static Map<String, String> opNameToOpMap = new Map<String, String>{
    'Equals' => '=',
    'GreaterOrEqual' => '>=',
    'GreaterThan' => '>',
    'LessOrEqual' => '<=',
    'LessThan' => '<',
    'NotEqual' => '<>',
    'Includes' => 'INCLUDES',
    'Excludes' => 'EXCLUDES'
  };

  public class ListFilterByInfo {
    public @AuraEnabled
    String fieldApiName;
    public @AuraEnabled
    String label;
    public @AuraEnabled
    String[] operandLabels;
    public @AuraEnabled
    String operator;

    public String getSOQL() {
      switch on this.operator {
        when 'Equals',
          'GreaterOrEqual',
          'GreaterThan',
          'LessOrEqual',
          'LessThan',
          'NotEqual' {
          List<String> rv = new List<String>();

          for (String label : operandLabels) {
            rv.add(
              fieldApiName +
              opNameToOpMap.get(this.operator) +
              '\'' +
              label +
              '\''
            );
          }

          return String.join(rv, ' OR ');
        }
        when 'Contains', 'NotContain' {
          List<String> rv = new List<String>();

          for (String label : operandLabels) {
            rv.add(fieldApiName + ' LIKE \'%' + label + '%\'');
          }

          return this.operator == 'Contains'
            ? String.join(rv, ' OR ')
            : 'NOT(' + String.join(rv, ' OR ') + ')';
        }
        when 'Excludes', 'Includes' {
          List<String> rv = new List<String>();

          for (String label : operandLabels) {
            rv.add('\'' + label + '\'');
          }

          return fieldApiName +
            ' ' +
            opNameToOpMap.get(this.operator) +
            '(' +
            String.join(rv, ';') +
            ')';
        }
        when 'StartsWith' {
          List<String> rv = new List<String>();

          for (String label : operandLabels) {
            rv.add(fieldApiName + ' LIKE \'' + label + '%\'');
          }
          return String.join(rv, ' OR ');
        }
        when 'Within' {
          return '';
        }
        when else {
          return '';
        }
      }
    }
  }

  public class ListOrderedByInfo {
    public @AuraEnabled
    String fieldApiName;
    public @AuraEnabled
    Boolean isAscending;
    public @AuraEnabled
    String label;

    public String getSOQL() {
      String rv = this.fieldApiName + (this.isAscending ? ' ASC' : ' DESC');
      return rv;
    }
  }

  static String getSOQL(
    String objectApiName,
    List<ListColumn> displayColumns,
    String filterLogicString,
    List<ListFilterByInfo> filterByInfo,
    List<ListOrderedByInfo> orderedByInfo
  ) {
    List<String> dcList = new List<String>();
    if (displayColumns != null) {
      for (ListColumn c : displayColumns) {
        dcList.add(c.fieldApiName);
      }
    }

    List<String> fbiList = new List<String>();
    if (filterByInfo != null) {
      for (ListFilterByInfo fbi : filterByInfo) {
        fbiList.add(fbi.getSOQL());
      }
    }

    List<String> obiList = new List<String>();
    if (orderedByInfo != null) {
      for (ListOrderedByInfo obi : orderedByInfo) {
        obiList.add(obi.getSOQL());
      }
    }

    return 'SELECT ' +
      ((dcList.size() > 0) ? String.join(dcList, ',') : 'COUNT()') +
      ' ' +
      'FROM ' +
      objectApiName +
      ((fbiList.size() > 0) ? ' WHERE ' + String.join(fbiList, ' AND ') : '') +
      ((obiList.size() > 0) ? ' ORDER BY ' + String.join(obiList, ',') : '') +
      ((dcList.size() > 0) ? ' LIMIT :pageSize OFFSET :offset' : '');
  }

  @AuraEnabled(cacheable=true)
  public static String getListViewNameById(String id) {
    try {
      List<ListView> lvList = [
        SELECT Id, NamespacePrefix, DeveloperName
        FROM ListView
        WHERE Id = :id
        WITH USER_MODE
      ];

      if (lvList.size() > 0) {
        String ns = lvList[0].NamespacePrefix;

        return ((ns != null && ns.length() > 0) ? (ns + '__') : '') +
          lvList[0].DeveloperName;
      }

      return null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static Integer getCount(
    String objectApiName,
    String filterLogicString,
    String filterByInfo
  ) {
    List<ListFilterByInfo> xfilterByInfo = filterByInfo != null
      ? (List<ListFilterByInfo>) JSON.deserialize(
          filterByInfo,
          List<ListFilterByInfo>.class
        )
      : null;

    try {
      String rv = getSOQL(
        objectApiName,
        null,
        filterLogicString,
        xfilterByInfo,
        null
      );
      return Database.countQuery(rv);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  static List<sObject> getRecords(
    String objectApiName,
    List<ListColumn> xdisplayColumns,
    String filterLogicString,
    List<ListFilterByInfo> xfilterByInfo,
    List<ListOrderedByInfo> xorderedByInfo,
    Integer offset,
    Integer pageSize
  ) {
    try {
      String rv = getSOQL(
        objectApiName,
        xdisplayColumns,
        filterLogicString,
        xfilterByInfo,
        xorderedByInfo
      );

      return Database.query(rv, AccessLevel.USER_MODE);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<sObject> getRecords(
    String objectApiName,
    String displayColumns,
    String filterLogicString,
    String filterByInfo,
    String orderedByInfo,
    Integer offset,
    Integer pageSize
  ) {
    List<ListColumn> xdisplayColumns = displayColumns != null
      ? (List<ListColumn>) JSON.deserialize(
          displayColumns,
          List<ListColumn>.class
        )
      : null;
    List<ListFilterByInfo> xfilterByInfo = filterByInfo != null
      ? (List<ListFilterByInfo>) JSON.deserialize(
          filterByInfo,
          List<ListFilterByInfo>.class
        )
      : null;
    List<ListOrderedByInfo> xorderedByInfo = orderedByInfo != null
      ? (List<ListOrderedByInfo>) JSON.deserialize(
          orderedByInfo,
          List<ListOrderedByInfo>.class
        )
      : null;

    return getRecords(
      objectApiName,
      xdisplayColumns,
      filterLogicString,
      xfilterByInfo,
      xorderedByInfo,
      offset,
      pageSize
    );
  }

  public class EnhancedRecordColumn {
    public @AuraEnabled
    String fieldApiName;
    public @AuraEnabled
    String dataType;
    public @AuraEnabled
    Object value;
    public @AuraEnabled
    String displayValue;
    public @AuraEnabled
    String relationshipObjectApiName;
    public @AuraEnabled
    String relationshipId;

    public EnhancedRecordColumn(
      String fieldName,
      Schema.DescribeFieldResult field,
      Object value,
      String displayValue,
      String relationshipObjectApiName,
      String relationshipId
    ) {
      this.fieldApiName = fieldName;
      this.dataType = field.getType().name();
      this.value = value;
      this.displayValue = displayValue;
      this.relationshipObjectApiName = relationshipObjectApiName;
      this.relationshipId = relationshipId;
    }
  }

  public class EnhancedRecord {
    public @AuraEnabled
    Map<String, EnhancedRecordColumn> columns;

    public EnhancedRecord() {
      columns = new Map<String, EnhancedRecordColumn>();
    }

    public void add(EnhancedRecordColumn column) {
      if (column != null) {
        columns.put(column.fieldApiName, column);
      }
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<EnhancedRecord> getEnhancedRecords(
    String objectApiName,
    String displayColumns,
    String filterLogicString,
    String filterByInfo,
    String orderedByInfo,
    Integer offset,
    Integer pageSize
  ) {
    List<ListColumn> xdisplayColumns = displayColumns != null
      ? (List<ListColumn>) JSON.deserialize(
          displayColumns,
          List<ListColumn>.class
        )
      : null;

    if (displayColumns != null) {
      Boolean hasId = false;
      Boolean hasRecordTypeId = false;

      for (ListColumn lc : xdisplayColumns) {
        // Note: In Apex string comparison is case insensitive
        if (lc.fieldApiName == ID_FIELDNAME) {
          hasId = true;
        } /* else if (lc.fieldApiName == RECORDTYPEID_FIELDNAME) {
          hasRecordTypeId = true;
        } */
      }

      if (!hasId) {
        xdisplayColumns.add(new ListColumn(ID_FIELDNAME, 'Id', false));
      }

      /*
      if (!hasRecordTypeId) {
        xdisplayColumns.add(new ListColumn(RECORDTYPEID_FIELDNAME, 'Record Type Id', false));
      }
      */
    }

    List<ListFilterByInfo> xfilterByInfo = filterByInfo != null
      ? (List<ListFilterByInfo>) JSON.deserialize(
          filterByInfo,
          List<ListFilterByInfo>.class
        )
      : null;

    List<ListOrderedByInfo> xorderedByInfo = orderedByInfo != null
      ? (List<ListOrderedByInfo>) JSON.deserialize(
          orderedByInfo,
          List<ListOrderedByInfo>.class
        )
      : null;

    List<sObject> records = getRecords(
      objectApiName,
      xdisplayColumns,
      filterLogicString,
      xfilterByInfo,
      xorderedByInfo,
      offset,
      pageSize
    );

    List<EnhancedRecord> rv = new List<EnhancedRecord>();
    Map<String, EnhancedTypeInfo> typeInfoMap = new Map<String, EnhancedTypeInfo>();

    if (records != null) {
      EnhancedTypeInfos typeInfos = new EnhancedTypeInfos(objectApiName);

      for (sObject record : records) {
        EnhancedRecord er = new EnhancedRecord();
        for (ListColumn lc : xdisplayColumns) {
          String fqApiName = lc.fieldApiName;
          List<String> elements = fqApiName.split('\\.');
          String sObjectApiName;
          String sFieldApiName;
          String relationshipId;
          Object value;

          if (elements.size() > 1) {
            sObjectApiName = elements.get(0);
            sFieldApiName = elements.get(1);
            sObject so = record.getSObject(sObjectApiName);
            value = so
              ?.get(sFieldApiName); /* Might be a null-valued relationship */
            relationshipId = String.valueOf(so?.get('Id'));
          } else {
            sFieldApiName = fqApiName;
            value = record.get(fqApiName);
          }

          EnhancedFieldInfo efDesc = typeInfos.getFieldDesc(
            sObjectApiName,
            sFieldApiName
          );

          Schema.DescribeFieldResult fDesc = efDesc?.fieldDescription;
          String displayValue = null;

          Schema.DisplayType fType = (fDesc != null) ? fDesc.getType() : null;
          switch on fType {
            when Boolean {
              displayValue = String.valueOf(value);
            }
            when Currency {
              displayValue = value != null ? ((Decimal) value).format() : null;
            }
            when Date {
              displayValue = value != null ? ((Date) value).format() : null;
            }
            when DateTime {
              displayValue = value != null
                ? ((DateTime) value).formatLong()
                : null;
            }
            when Double {
              displayValue = value != null ? ((Double) value).format() : null;
            }
            when Email, EncryptedString, Id, String, TextArea, Url {
              displayValue = String.valueOf(value);
            }
            when Integer {
              displayValue = value != null ? ((Integer) value).format() : null;
            }
            when Long {
              displayValue = value != null ? ((Long) value).format() : null;
            }
            when Percent {
              displayValue = value != null
                ? ((Decimal) value).format() + '%'
                : null;
            }
            when PickList, MultiPickList {
              String stringValue = value != null ? (String) value : '';
              List<String> sValueList = stringValue.split(';');
              List<String> displayValueList = new List<String>();
              Map<String, PicklistEntry> pleMap = typeInfos.getFieldPicklistEntries(
                sObjectApiName,
                sFieldApiName
              );
              for (String sValue : sValueList) {
                PicklistEntry ple = pleMap.get(sValue);
                if (ple != null) {
                  displayValueList.add(ple.getLabel());
                }
              }
              displayValue = String.join(displayValueList, ';');
            }
            when Time {
              displayValue = String.valueOf(value);
            }
            when else {
              displayValue = value != null ? value.toString() : null;
            }
          }

          er.add(
            new EnhancedRecordColumn(
              lc.fieldApiName,
              fDesc,
              value,
              displayValue,
              relationshipId != null ? efDesc.objectInfo.getApiName() : null,
              relationshipId
            )
          );
        }

        rv.add(er);
      }
    }

    return rv;
  }

  public class EnhancedTypeInfo {
    String apiName;
    sObjectType type;
    DescribeSObjectResult oDesc;
    Map<String, Schema.SObjectField> fieldMap;
    Map<String, Schema.DescribeFieldResult> describeMap;
    Map<String, List<sObjectType>> relationshipMap;
    Map<String, Map<String, Schema.PicklistEntry>> picklistValueMap;

    EnhancedTypeInfo(String objectApiName) {
      init(Schema.getGlobalDescribe().get(objectApiName));
    }

    EnhancedTypeInfo(Schema.SObjectType type) {
      init(type);
    }

    void init(Schema.SObjectType type) {
      this.type = type;
      oDesc = type.getDescribe();
      apiName = oDesc.getLocalName();

      fieldMap = oDesc.fields.getMap();
      describeMap = new Map<String, Schema.DescribeFieldResult>();
      relationshipMap = new Map<String, List<sObjectType>>();
      picklistValueMap = new Map<String, Map<String, Schema.PicklistEntry>>();

      for (String key : fieldMap.keySet()) {
        Schema.SObjectField oField = fieldMap.get(key);
        Schema.DescribeFieldResult ofDesc = oField.getDescribe();
        describeMap.put(key, ofDesc);

        String relationshipName = ofDesc.relationshipName;
        if (relationshipName != null) {
          relationshipMap.put(ofDesc.relationshipName, ofDesc.getReferenceTo());
        }

        if (
          ofDesc.getType() == Schema.DisplayType.PickList ||
          ofDesc.getType() == Schema.DisplayType.MultiPickList
        ) {
          Map<String, Schema.PicklistEntry> mple = new Map<String, Schema.PicklistEntry>();
          for (PicklistEntry ple : ofDesc.getPicklistValues()) {
            mple.put(ple.getValue(), ple);
          }

          picklistValueMap.put(key, mple);
        }
      }
    }

    sObjectType getTypeForRelationship(String relationshipName) {
      List<sObjectType> rti = relationshipMap.get(relationshipName);

      // TODO what to do when there are multiple ones? isNamePointing() gives info.
      if (rti != null && rti.size() > 0) {
        return rti.get(0);
      }

      return null;
    }

    Schema.DescribeFieldResult getFieldDesc(String fieldApiName) {
      return describeMap.get(fieldApiName.toLowerCase());
    }

    Map<String, Schema.PicklistEntry> getFieldPicklistEntries(
      String fieldApiName
    ) {
      return picklistValueMap.get(fieldApiName.toLowerCase());
    }

    Schema.PicklistEntry getFieldPicklistEntry(
      String fieldApiName,
      String value
    ) {
      Map<String, Schema.PicklistEntry> m = getFieldPicklistEntries(
        fieldApiName
      );

      if (m == null) {
        return null;
      }

      return m.get(value);
    }

    sObjectType getType() {
      return this.type;
    }

    String getApiName() {
      return this.apiName;
    }
  }

  class EnhancedFieldInfo {
    EnhancedTypeInfo objectInfo;
    Schema.DescribeFieldResult fieldDescription;

    EnhancedFieldInfo(
      EnhancedTypeInfo objectInfo,
      Schema.DescribeFieldResult fieldDescription
    ) {
      this.objectInfo = objectInfo;
      this.fieldDescription = fieldDescription;
    }
  }

  public class EnhancedTypeInfos {
    Map<String, EnhancedTypeInfo> mapInfos;
    Map<sObjectType, EnhancedTypeInfo> mapInfosSot;
    String defaultObjectApiName;

    EnhancedTypeInfos(String defaultObjectApiName) {
      this.mapInfos = new Map<String, EnhancedTypeInfo>();
      this.mapInfosSot = new Map<sObjectType, EnhancedTypeInfo>();
      this.defaultObjectApiName = defaultObjectApiName.toLowerCase();
    }

    EnhancedTypeInfo getTypeInfo() {
      return getTypeInfo('');
    }

    EnhancedTypeInfo getTypeInfo(sObjectType sot) {
      EnhancedTypeInfo typeInfo = this.mapInfosSot.get(sot);
      if (typeInfo == null) {
        typeInfo = new EnhancedTypeInfo(sot);
        this.mapInfos.put(typeInfo.getApiName(), typeInfo);
        this.mapInfosSot.put(sot, typeInfo);
      }

      return typeInfo;
    }

    EnhancedTypeInfo getTypeInfo(String objectApiName) {
      String rObjectApiName = objectApiName == null ||
        objectApiName.length() == 0
        ? this.defaultObjectApiName
        : objectApiName;
      rObjectApiName = rObjectApiName.toLowerCase();

      EnhancedTypeInfo typeInfo = this.mapInfos.get(rObjectApiName);
      if (typeInfo == null) {
        typeInfo = new EnhancedTypeInfo(rObjectApiName);
        this.mapInfos.put(rObjectApiName, typeInfo);
        this.mapInfosSot.put(typeInfo.getType(), typeInfo);
      }

      return typeInfo;
    }

    EnhancedFieldInfo getFieldDesc(String objectApiName, String fieldApiName) {
      EnhancedTypeInfo typeInfo;

      if (objectApiName != null) {
        sObjectType sot = getTypeInfo().getTypeForRelationship(objectApiName);
        typeInfo = getTypeInfo(sot);
      } else {
        typeInfo = getTypeInfo();
      }

      return typeInfo != null
        ? new EnhancedFieldInfo(typeInfo, typeInfo.getFieldDesc(fieldApiName))
        : null;
    }

    Map<String, Schema.PicklistEntry> getFieldPicklistEntries(
      String objectApiName,
      String fieldApiName
    ) {
      if (objectApiName != null) {
        sObjectType sot = getTypeInfo().getTypeForRelationship(fieldApiName);
        EnhancedTypeInfo typeInfo = getTypeInfo(sot);
        return typeInfo != null
          ? typeInfo.getFieldPicklistEntries(fieldApiName)
          : null;
      }

      EnhancedTypeInfo typeInfo = getTypeInfo();
      return typeInfo != null
        ? typeInfo.getFieldPicklistEntries(fieldApiName)
        : null;
    }

    Schema.PicklistEntry getFieldPicklistEntry(
      String objectApiName,
      String fieldApiName,
      String value
    ) {
      if (objectApiName != null) {
        sObjectType sot = getTypeInfo().getTypeForRelationship(objectApiName);
        EnhancedTypeInfo typeInfo = getTypeInfo(sot);
        return typeInfo != null
          ? typeInfo.getFieldPicklistEntry(fieldApiName, value)
          : null;
      }

      EnhancedTypeInfo typeInfo = getTypeInfo();
      return typeInfo != null
        ? typeInfo.getFieldPicklistEntry(fieldApiName, value)
        : null;
    }
  }
}
