# Combobox Lightning Web Component

The _Combobox Lightning Web Component_ is a read-only input element in which the user can select an option from a list of options.

## Available _c-sf-gps-ds-osrt-combobox_ Attributes

| Attribute                 | Value                                                                 | Type    | Required | Description                                                                                                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label                     |                                                                       | string  |          | Adds a title for the combobox component.                                                                                                                                                                                                           |
| name                      |                                                                       | string  |          | Adds a name to the combobox component.                                                                                                                                                                                                             |
| placeholder               |                                                                       | string  |          | Adds text to the input element to prompt user to select from the dropdown (list of _options_ to render labels). For example, "Select an option".                                                                                                   |
| variant                   | standard, label-hidden (Default: standard)                            | string  |          | Changes the appearance of the input element.                                                                                                                                                                                                       |
| value                     |                                                                       | string  |          | Adds a pre-populatd value to the combobox input.                                                                                                                                                                                                   |
| options                   |                                                                       | array   | yes      | Sets the list of options available for selection. Each option has "label" and "value" attributes, such as `{"label":"Apple","value":"apple"}`. It also supports grouping if option is set as `{"label":"Apple","value":"apple", "group":"group1"}` |
| required                  | true, false (Default: false)                                          | boolean |          | If the user must enter a value before submitting the form, set to true.                                                                                                                                                                            |
| multiple                  | true, false (Default: false)                                          | boolean |          | To enable the ability to select multiple options, set to true.                                                                                                                                                                                     |
| searchable                | true, false (Default: false)                                          | boolean |          | To enable user search, set to true.                                                                                                                                                                                                                |
| read-only                 | true, false (Default: false)                                          | boolean |          | To prevent the user from editing the field, set to true.                                                                                                                                                                                           |
| theme                     | slds, nds (Default: slds)                                             | string  |          | Sets the theme for the combobox component.                                                                                                                                                                                                         |
| errormessage              | warning, success, error, info                                         | string  |          | Sets the style of the error message.                                                                                                                                                                                                               |
| disabled                  | true, false (Default: false)                                          | boolean |          | To disable the combobox, set to true.                                                                                                                                                                                                              |
| max-count                 |                                                                       | number  |          | Sets the number of options to display before user must scroll.                                                                                                                                                                                     |
| sorted                    | true, false (Default: false)                                          | boolean |          | If set to true the options are sorted in alphabetic order of value or the sortField.                                                                                                                                                               |
| sortField                 | string                                                                | number  |          | To set the sortField used to sort the options. Works only if sorted is true                                                                                                                                                                        |
| deleteMultiple            | true, false (Default: false)                                          | boolean |          | To have delete on multiple select pill                                                                                                                                                                                                             |
| isDisplayFlex             | true, false (Default: false)                                          | boolean |          | To set display:flex style for pill wrapper div and it also set overflow:hidden and text-overflow:ellipsis style to each pill. Selected values will be displayed as pills only if the multiple attribute is true.                                   |
| data-show-lookup          | true, false (Default: false)                                          | string  |          | Applicable only when `read-only` is set to true. Set to true to display the lookup fields.                                                                                                                                                         |
| field-level-help          |                                                                       | string  |          | Adds help text.                                                                                                                                                                                                                                    |
| field-level-help-position | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string  |          | Specifies the direction of the arrow for the help text.                                                                                                                                                                                            |

### Example _c-sf-gps-ds-osrt-combobox_ Component

```html
<c-sf-gps-ds-osrt-combobox
  theme="slds"
  read-only="true"
  options='[{"label":"Apple","value":"apple"},{"label":"Orange","value":"orange"},{"label":"Mango","value":"mango"}]'
  label="Single Select"
  placeholder="Normal Input"
></c-sf-gps-ds-osrt-combobox>

<!-- Combobox with grouping -->
<c-sf-gps-ds-osrt-combobox
  theme="slds"
  read-only="true"
  options='[{"label":"Apple","value":"apple","group":"group1"},{"label":"Orange","value":"orange","group":"group1"},{"label":"Potato","value":"Potato",,"group":"group2"}]'
  label="Single Select"
  placeholder="Normal Input"
></c-sf-gps-ds-osrt-combobox>

<!-- Combobox with footer -->
<c-sf-gps-ds-osrt-combobox
  theme="slds"
  read-only="true"
  options='[{"label":"Apple","value":"apple"},{"label":"Orange","value":"orange"},{"label":"Mango","value":"mango"}]'
  label="Single Select"
  placeholder="Normal Input"
>
  <div slot="footer">
    <span>Footer</span>
  </div>
</c-sf-gps-ds-osrt-combobox>
```

### Example Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

```html
<c-sf-gps-ds-osrt-combobox
  theme="slds"
  read-only="true"
  options='[{"label":"Apple","value":"apple"},{"label":"Orange","value":"orange"},{"label":"Mango","value":"mango"}]'
  label="Single Select"
  placeholder="Normal Input"
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-combobox>
```
