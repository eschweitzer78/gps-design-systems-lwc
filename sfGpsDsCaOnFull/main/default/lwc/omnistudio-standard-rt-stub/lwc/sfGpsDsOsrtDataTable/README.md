# DataTable Lightning Web Component

The _DataTable Lightning Web Component_ creates a tabular structure of the data provided. The _DataTable LWC_ supports grouping, search, pagination, and sorting capabilities.

## Available _c-data-table_ Attributes

**IMPORTANT: The table reflects the order by which attributes must be set for _c-data-table_.**

| Attribute                 | Value                                      | Type    | Required | Description                                                                                                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| extraclass                |                                            | string  |          | Adds a class to the table element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.                                                                                                                                                                                 |
| headerclass               |                                            | string  |          | Adds a class to the table header element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.                                                                                                                                                                          |
| issearchavailable         | true, false (Default: false)               | boolean |          | To make table searchable, set to true. Displays the search input field and filter dropdown.                                                                                                                                                                                                                  |
| issortavailable           | true, false (Default: false)               | boolean |          | To make table sortable, set to true. This feature is not available on phones and smaller screens.                                                                                                                                                                                                            |
| theme                     | slds, nds (Default: slds)                  | string  |          | Specifies which theme to use.                                                                                                                                                                                                                                                                                |
| icon-url                  | url                                        | string  |          | Overrides the default URL of the svg resource. Used with Newport Design System (NDS) theme only.                                                                                                                                                                                                             |
| group-by                  | JSON                                       | object  |          | To group table based on a record field, set this attribute. To make field name the group header, set the field name as the value for this attribute. To add a group description with the group header, pass an object as a value for this attribute (see **Available _group-by_ Attributes**).               |
| pagesize                  |                                            | number  |          | If set, enables pagination.                                                                                                                                                                                                                                                                                  |
| row-level-edit            | true, false (Default: false)               | boolean |          | To enable row-level editing, set to true. The _columns_ JSON must have editable fields. See **Available _columns_ Attributes**.                                                                                                                                                                              |
| user-selectable-column    | true, false (Default: true)                | boolean |          | Enables users to choose which columns are visible. If set to true, in the _columns_ JSON, only those fields with _userSelectable_ set to true will be visible. See **Available _columns_ Attributes**.                                                                                                       |
| columns                   | JSON                                       | array   | yes      | Contains heading names and specifies settings for each column. See **Available _columns_ Attributes**.                                                                                                                                                                                                       |
| records                   | JSON                                       | array   | yes      | Contains the data to populate the table.                                                                                                                                                                                                                                                                     |
| cell-level-edit           | true, false (Default: false)               | boolean |          | To enable cell-level editing, set to true. To make specific cells editable, see **Available _columns_ Attributes**.                                                                                                                                                                                          |
| group-order               | asc, dsc                                   | string  |          | Orders group in ascending or descending order.                                                                                                                                                                                                                                                               |
| hide-table-header         | true, false (Default: false)               | boolean |          | To hide table header, set to true.                                                                                                                                                                                                                                                                           |
| pagelimit                 | (Default: 3)                               | number  |          | Specifies how many page navigation links to add to pagination. The _pagesize_ must be set.                                                                                                                                                                                                                   |
| draggable                 | true, false (Default: false)               | boolean |          | Specifies whether rows are draggable. The `onupdate` event is fired when a row is dragged and the order is updated. Inside the event handler get the updated data from `event.detail.result`.                                                                                                                |
| row-delete                | true, false (Default: false)               | boolean |          | Specifies whether each row includes a delete option. Once the row is deleted, it is removed from the table. The `ondelete` event is fired. Inside the event handler get the deleted data from `event.detail.result`.                                                                                         | row-delete-dependent-column | String | String | Specifies depending on which column, delete option is enabled/disabled. row-delete option should be set to true for this option to work. |
| user-selectable-row       | true, false (Default: false)               | boolean |          | Specifies whether each row includes select option. Once the row is selected, `selectrow` event is fired. Inside the event handler get the deleted data from `event.detail.result`. If all rows are selected `event.detail.result` will have "all" as value.                                                  |
| active-groups             | true, false (Default: true)                | boolean |          | Specifies whether groups are expanded or collapsed. Valid only for datatables with group-by                                                                                                                                                                                                                  |
| groupNameWrapperClass     | JSON                                       | object  |          | additional styles for group header in group-by table.                                                                                                                                                                                                                                                        |
| hideExtraColumn           | true, false (Default: false)               | boolean |          | Valid only for datatable with group by. Enable to prevent the space below and above the grouped name. Hides group by on the first column and draggable.                                                                                                                                                      |
| confirmdeleterow          | true, false (Default: false)               | boolean |          | Enables the user to show the delete confirmation prompt when deleting a row from the table.                                                                                                                                                                                                                  |
| sortAcrossGroups          | true, false (Default: false)               | boolean |          | Valid only for grouped datatable. Enables user to sort based on the group name.                                                                                                                                                                                                                              |
| fireeventOnDeleteconfirm  | true, false (Default: false)               | boolean |          | Valid when `confirmdeleterow` is true . When true, the row will not be deleted from the datatable. It will only fire the event with the data to be deleted. Once the delete is confirmed, the `deleteconfirm` event is fired. Inside the event handler get the row to be deleted from `event.detail.result`. |
| styles                    |                                            | Object  |          | A style object to use for element specific styling.                                                                                                                                                                                                                                                          |
| tablename                 | (Default: Datatable)                       | string  |          | Assigns aria-label to the pagination section for accessibility users.                                                                                                                                                                                                                                        |
| has-accessibility-support | true, false (Default: false)               | boolean |          | Enable accessibility support. Enabling may lead to performance degradation.                                                                                                                                                                                                                                  |
| highlight-selection       | true,"true",false,"false" (Default: false) | boolean |          | highlight a row on click, provide row index to highlight                                                                                                                                                                                                                                                     |
| highlight-row             | 0,1,2... (Default: 0) or "0","1"...        | number  |          | provide row index to highlight row, works with highlight-selection true                                                                                                                                                                                                                                      |

### Example _c-data-table_ Component

```html
<c-data-table
  extraclass="slds-table_bordered"
  headerclass="slds-text-title_caps"
  issearchavailable="true"
  issortavailable="true"
  theme="{theme}"
  icon-url="{iconUrl}"
  group-by="company"
  pagesize="4"
  onupdate="{tableDataUpdated}"
  row-level-edit="true"
  user-selectable-column="true"
  columns="{columns}"
  records="{tableData}"
  styles="{styles}"
  highlight-selection="true"
  highlight-row="0"
>
</c-data-table>
```

### Example of styles object

```javascript
styles = {
  showGroupedHeaderAsAnchor: true, // used to show the group table header as anchor tag
  columnHeaderCaps: true // used to capitalize the table columns header fields
};
```

### Example _data_ JSON

```JSON
[{
    "email": "jsolitas@motorsrus.com",
    "company": "Motors R Us",
    "age": "44",
    "balance": "$11,500",
    "address": "846 Livonia Avenue, Siglerville, Maryland, 5503",
    "isActive": true
  },
  {
    "email": "robasanjo@treeline.org",
    "company": "TreeLine Group",
    "age": "32",
    "balance": "$9,678",
    "address": "902 Myrtle Avenue, Rockhill, Delaware, 3863",
    "isActive": true
  },
  {
    "email": "n-daily@dailys.com",
    "company": "Daily Corp",
    "age": "57",
    "balance": "$22,888",
    "address": "408 Aster Court, Riceville, Indiana, 9646",
    "isActive": false
  },
  {
    "email": "g-gomez@dailys.com",
    "company": "Daily Corp",
    "age": "44",
    "balance": "$6,983",
    "address": "856 Benson Avenue, Ballico, North Carolina, 4930",
    "isActive": true
  }
];
```

## Available _columns_ Attributes

| Attribute         | Value                                                                                               | Type    | Required | Description                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| editable          | true, false (Default: false)                                                                        | boolean |          | Specifies whether column is editable.                                                                                                                  |
| fieldName         |                                                                                                     | string  | yes      | Gets the key for the column from the _data_ JSON.                                                                                                      |
| label             |                                                                                                     | string  | yes      | Sets the visible name of the column heading.                                                                                                           |
| searchable        | true, false (Default: false)                                                                        | boolean |          | To enable the ability to search column values, set to true.                                                                                            |
| sortable          | true, false (Default: false)                                                                        | boolean |          | To enable column sorting, set to true. On hover of column heading, a sorting icon displays next to the column name.                                    |
| type              | currency, date, datetime percent, number, text, email, textarea, url, checkbox,icon (Default: text) | string  |          | Specifies the type of value column holds. checkbox and icon both used for boolean values. Whereas icon type is used to show the value as a check icon. |
| userSelectable    | true, false (Default: false)                                                                        | boolean |          | If set to true, enables user to choose if column is visible.                                                                                           |
| visible           | true, false (Default: true)                                                                         | boolean |          | To hide the column, set to false. If set to false and _userSelectable_ is set to true, user can make column visible.                                   |
| format            | date formats (Default: YYYY-MM-DD)                                                                  | string  |          | Sets the date format. Required only if field `type` is "date" or "datetime".                                                                           |
| preventNavigation | true, false (Default: false)                                                                        | boolean |          | Prevents default navigation. Required only if field `type` is "url".                                                                                   |

### Example _columns_ JSON

```JSON
 [{
    "fieldName": "company",
    "label": "Company",
    "sortable": true,
    "searchable": true
  },
  {
    "fieldName": "email",
    "label": "Email",
    "sortable": true,
    "searchable": true,
    "type": "email",
    "editable": true,
    "userSelectable": true
  },
  {
    "fieldName": "age",
    "label": "Age",
    "sortable": true,
    "type": "number",
    "editable": true,
    "userSelectable": true
  },
  {
    "fieldName": "balance",
    "label": "Balance",
    "sortable": true,
    "userSelectable": true
  },
  {
    "fieldName": "address",
    "label": "Address",
    "sortable": false,
    "type": "textarea",
    "editable": true,
    "userSelectable": true
  },
  {
    "fieldName": "isActive",
    "label": "Active",
    "sortable": false,
    "type": "checkbox",
    "editable": true
  }
  ];
```

## Available _group-by_ Attributes

| Attribute     | Value | Type   | Required | Description                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------- | ----- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --------- | -------- | ------ | --- | ---------------------------- | --- |
| fields        | list  | array  |          | Sets group header description for every visible row after grouping. Each object takes a field name that has its own group desciption, which by default is the sum of all selected field from all the records. To get group description using a custom function, pass function to _methodToCalculateSummary_, which takes 'groupItems' as an argument. For example, `nameOfFunction(groupItems){}`. |
| sortFieldName |       | string | no       | Field Name Inside grouped items to be sorted                                                                                                                                                                                                                                                                                                                                                       |     | sortOrder | asc,desc | string | no  | Sort order for grouped items |     |

### Example _group-by_ JSON

```JSON
  {
    "groupFieldName": "company",
    "fields": [
      {
        "name": "balance",
        "methodToCalculateSummary": ""
      }
    ]
  };
```

## Available Event Listeners

**onupdate**

Triggers when table data changes.

**ondelete**

Triggers when a table row is deleted.

**onrowclick**

Triggers when a row is clicked and includes the record on which the click happens. Is inside `event.detail.result`.
`event.detail.fieldName` will give the name of the field from where event was triggered.

## Adding Custom Column UI

To add a custom column specify each column inside a dataTable and add the relevant column inside the data table element.

**Note:** The element inside the dataTable is either a dataTableCell or an extended LWC of the dataTableCell. The display order is the same as the order of the dataTableCell HTML in the slot.

### Required Column Attributes

| Attribute       | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| data-field-name | This is the same field name specified inside columns array.         |
| class           | To define the column as a column UI, add a **dataTableCell** class. |

### Column Data

| Data       | Description                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cellData   | Contains the column cell data. For example, if this column field name is "email", this variable will contain related data to that field name. You can read it with `cellData.value`. |
| rowData    | Contains complete row data from one single record, which can be used to show more data as well.                                                                                      |
| columnData | Contains the metadata from columns json.                                                                                                                                             |

**NOTE:** To customize one column you must specify all the columns inside the dataTable. If you do not want to customize any column then leave dataTable empty.

**NOTE:** GROUP BY tables does not support custom column UI.

### Example customDataTableCell

```html
<c-data-table
  extraclass="slds-table_bordered"
  issearchavailable="true"
  issortavailable="true"
  theme="{theme}"
  icon-url="{iconUrl}"
  draggable="true"
  columns="{columns}"
  records="{tableData}"
  onupdate="{tableUpdateHandler}"
  ondelete="{tableUpdateHandler}"
  row-delete="true"
>
  <c-customDataTableCell data-field-name="email" class="dataTableCell">
  </c-customDataTableCell>
  <c-sf-gps-ds-osrt-data-table-cell data-field-name="age" class="dataTableCell">
  </c-sf-gps-ds-osrt-data-table-cell>
  <c-sf-gps-ds-osrt-data-table-cell
    data-field-name="balance"
    class="dataTableCell"
  >
  </c-sf-gps-ds-osrt-data-table-cell>
  <c-sf-gps-ds-osrt-data-table-cell
    data-field-name="address"
    class="dataTableCell"
  >
  </c-sf-gps-ds-osrt-data-table-cell>
  <c-sf-gps-ds-osrt-data-table-cell
    data-field-name="isActive"
    class="dataTableCell"
  >
  </c-sf-gps-ds-osrt-data-table-cell>
  <c-sf-gps-ds-osrt-data-table-cell
    data-field-name="phone"
    class="dataTableCell"
  >
  </c-sf-gps-ds-osrt-data-table-cell>
</c-data-table>
```

DataTableCell or an extend LWC of a DataTableCell are supported inside the data table.

### Column Required Attributes

a) **data-field-name** : This is the same field name specified inside columns array.

b) **class** : Add a **dataTableCell** class to treated it as a column UI.

### Data Inside the Extended Component

a) **cellData** : The column cell data. For example, if this column field name is "email", this variable comtains related data for that field name. Read it by "cellData.value".

b) **rowData**: Contains complete row data as one single record and can also be used to show more data.

c) **columnData**: Contains metadata for what you pass inside `columns` JSON.

**NOTE: To customize one column, you must specify all the columns inside the data table. If you don't want to customize any column, leave the data table empty.**

**NOTE: Custom column UI support is not available in GROUP BY tables.**

#### Example _customDataTableCell_

```html
<template>
  <div if:true="{cellData}" class="tableRowCell">
    <!--Start your custom content from here-->
    {cellData.value} : <br />{rowData.phone}
    <button onclick="{toggleText}">Toggle</button>
    <div if:true="{hiddenText}">{cellData.value}</div>
  </div>
</template>
```

```js
import { track } from "lwc";
import dataTableCell from "c/dataTableCell";
export default class DataTableCellExtended extends dataTableCell {
  @track hiddenText = false;

  toggleText() {
    this.hiddenText = !this.hiddenText;
  }
}
```

```css
.tableRowCell {
  display: table-cell;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  position: relative;
}

.tableRowCell:first {
  border: 0;
}
```
