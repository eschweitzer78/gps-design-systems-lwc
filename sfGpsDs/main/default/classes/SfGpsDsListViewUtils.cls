public class SfGpsDsListViewUtils {
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

  public class ListFilteredByInfo {
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
        when 'Contains' {
          List<String> rv = new List<String>();

          for (String label : operandLabels) {
            rv.add(fieldApiName + ' LIKE \'%' + label + '%\'');
          }

          return String.join(rv, ' OR ');
        }
        when 'NotContain' {
          List<String> rv = new List<String>();

          for (String label : operandLabels) {
            rv.add('(NOT ' + fieldApiName + ' LIKE \'%' + label + '%\')');
          }

          return String.join(rv, ' AND ');
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

  public static String getSOQL(
    String objectApiName,
    List<ListColumn> displayColumns,
    String filterLogicString,
    List<ListFilteredByInfo> filteredByInfo,
    List<ListOrderedByInfo> orderedByInfo
  ) {
    List<String> dcList = new List<String>();
    List<String> fbiList = new List<String>();

    if (displayColumns != null) {
      for (ListColumn c : displayColumns) {
        dcList.add(c.fieldApiName);
      }
    }

    return getSelectClause(dcList) +
      'FROM ' +
      objectApiName +
      getWhereClause(filterLogicString, filteredByInfo) +
      getOrderByClause(orderedByInfo) +
      getLimitOffsetClause(dcList);
  }

  static String getSelectClause(List<String> dcList) {
    return 'SELECT ' +
      ((dcList.size() > 0) ? String.join(dcList, ',') : 'COUNT()') +
      ' ';
  }

  static String getWhereClause(
    String filterLogicString,
    List<ListFilteredByInfo> filteredByInfo
  ) {
    List<String> fbiList = new List<String>();

    if (filteredByInfo != null) {
      for (ListFilteredByInfo fbi : filteredByInfo) {
        fbiList.add(fbi.getSOQL());
      }
    }

    if (String.isBlank(filterLogicString)) {
      return ((fbiList.size() > 0)
        ? ' WHERE ' + String.join(fbiList, ' AND ')
        : '');
    }

    String index = '';
    String rv = ' WHERE ';
    Integer length = filterLogicString.length();
    for (Integer i = 0; i <= length; i++) {
      String c = i < length ? filterLogicString.substring(i, i + 1) : '';

      if (c.isNumeric()) {
        index += c;
      } else {
        if (index != '') {
          Integer indexNum = Integer.valueOf(index);
          rv += '(' + fbiList[indexNum - 1] + ')';
          index = '';
        }

        rv += c;
      }
    }

    return rv;
  }

  static String getOrderByClause(List<ListOrderedByInfo> orderedByInfo) {
    List<String> obiList = new List<String>();

    if (orderedByInfo != null) {
      for (ListOrderedByInfo obi : orderedByInfo) {
        obiList.add(obi.getSOQL());
      }
    }

    return ((obiList.size() > 0)
      ? ' ORDER BY ' + String.join(obiList, ',')
      : '');
  }

  static String getLimitOffsetClause(List<String> dcList) {
    return ((dcList.size() > 0) ? ' LIMIT :pageSize OFFSET :offset' : '');
  }
}
