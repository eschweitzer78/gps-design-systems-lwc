# DataTableCell Lightning Web Component

The _DataTableCell Lightning Web Component_ is the base element inside a _DataTable Lightning Web Component_ forming individual cells.

## Available _dataTableCell_ Attributes

| Attribute  | Value                       | Type    | Required | Description                                                                                                                                |
| ---------- | --------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| columnData |                             | JSON    |          | Contains metadata of what you pass inside columns json.                                                                                    |
| cellData   |                             | JSON    |          | Specifiies column cell data. For example, if this column field name is "email", this variable will contain related data to that field name |
| iconUrl    |                             | string  |          | Defines the base url used for the edit field for a custom icon.                                                                            |
| theme      | slds, nds (Default: slds)   | string  |          | Specifes the theme of the component.                                                                                                       |
| isCustomUi | true, false (Default:false) | boolean |          | Set to true to implement a custom UI.                                                                                                      |
| rowData    |                             | JSON    |          | Contains complete row data from one single record. Can show more data.                                                                     |

### Example of baseState

```html
<c-data-table
  extraclass="slds-table_bordered"
  theme="{theme}"
  icon-url="{iconUrl}"
  draggable="true"
  pagesize="5"
  row-level-edit="true"
  row-delete="true"
  columns="{columns}"
  records="{tableData}"
  onupdate="{tableUpdateHandler}"
  ondelete="{tableDeleteHandler}"
  onrowclick="{tableOnRowClickHandler}"
>
  <c-sf-gps-ds-osrt-data-table-cell
    data-field-name="age"
    class="dataTableCell"
  ></c-sf-gps-ds-osrt-data-table-cell>
  <c-sf-gps-ds-osrt-data-table-cell
    data-field-name="balance"
    class="dataTableCell"
  ></c-sf-gps-ds-osrt-data-table-cell>
</c-data-table>
```
