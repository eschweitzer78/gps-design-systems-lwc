# OutputField Lightning Web Component

The _OutputField Lightning Web Component_ returns the label, help text and value for the field name of a record. The returned data is read-only.

## Available _c-sf-gps-ds-osrt-output-field_ Attributes

| Attribute          | Value                                                                            | Type                  | Required                                           | Description                                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label              |                                                                                  | string                |                                                    | Sets a label for the output field.                                                                                                                                                                                   |
| record             |                                                                                  | string                | yes                                                | Provides the record from which to fetch the field value.                                                                                                                                                             |
| field-name         |                                                                                  | string                | yes                                                | Sets the field value to fetch.                                                                                                                                                                                       |
| type               | string, date, datetime, currency, phone, address, and so forth (Default: string) | string                |                                                    | Formats the field based on the type provided.                                                                                                                                                                        |
| mask               |                                                                                  | string                |                                                    | Adds a mask for the input value. It is applicable only for type: date/number. For type date the mask is different date formats. For type number it supports the same mask which is supported in input lwc component. |
| prevent-navigation |                                                                                  | string                |                                                    | Prevents default navigation of url. It is applicable only for type: url.                                                                                                                                             |
| valueclass         |                                                                                  | string                |                                                    | Adds class to the value field.                                                                                                                                                                                       |
| labelclass         |                                                                                  | string                |                                                    | Adds class to the label field.                                                                                                                                                                                       |
| extraclass         |                                                                                  | string                |                                                    | Adds class to the parent div.                                                                                                                                                                                        |
| locale             |                                                                                  | string default: en-US | Sets Locale. valid only for currency fields        |
| currency           |                                                                                  | string default: USD   | Sets Currency type. valid only for currency fields |
| field-label        |                                                                                  | string                | no                                                 | Sets the title of the field if field-title is not provided.                                                                                                                                                          |
| field-title        |                                                                                  | string                | no                                                 | Sets the title of the field.                                                                                                                                                                                         |
| use-absolute-date  |                                                                                  | boolean               | no                                                 | This attribute is only valid for the date type. An option to cast the date as an absolute date, so it would never include any timezone conversion.                                                                   |

### Example _c-sf-gps-ds-osrt-output-field_ Component

```html
<c-sf-gps-ds-osrt-output-field
  record="{record}"
  field-name="Name"
  type="{field.type}"
></c-sf-gps-ds-osrt-output-field>
```
