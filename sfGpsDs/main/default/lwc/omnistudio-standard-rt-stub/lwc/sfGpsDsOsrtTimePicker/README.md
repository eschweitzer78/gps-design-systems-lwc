# TimePicker Lightning Web Component

The _TimePicker Lightning Web Component_ is a graphical user interface widget that allows the user to select a time from a list of options.

## Available _c-sf-gps-ds-osrt-time-picker_ Attributes

| Attribute                  | Value                                                                 | Type    | Required | Description                                                                                                                            |
| -------------------------- | --------------------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- | --- |
| theme                      | slds, nds (Default: slds)                                             |         |          | Sets the theme for this component.                                                                                                     |
| label                      |                                                                       | string  |          | Adds the text label for the input field.                                                                                               |
| disabled                   | no value                                                              | string  |          | To disable the input field so users cannot interact with it, set this attribute.                                                       |
| required                   | no value (See example code)                                           | string  |          | If the input field must be filled out before the form is submitted, set this attribute.                                                |
| tab-index                  | "0", "-1" (Default: "0")                                              | string  |          | Pass-through tabindex attribute to underlying input.                                                                                   |     |
| read-only                  | no value                                                              | string  |          | To prevent users from editing input field, set this attribute.                                                                         |
| placeholder                |                                                                       | string  |          | Displays text when the input field is empty to prompt the user for a valid entry.                                                      |
| min                        |                                                                       | string  |          | Sets the minimum acceptable value for the input field.                                                                                 |
| max                        |                                                                       | string  |          | Sets the maximum acceptable value for the input field.                                                                                 |
| message-when-value-missing |                                                                       | string  |          | Adds an error message to be displayed when the value is missing. Default: This field is required.                                      |
| message-when-bad-input     |                                                                       | string  |          | Adds an error message to be displayed when a bad input is detected. Default : This field is not valid.                                 |
| name                       |                                                                       | string  |          | Specifies the name of an input element.                                                                                                |
| icon-url                   |                                                                       | string  |          | Defines the URL to get the icon. Default points to the relevant slds icon URL.                                                         |
| field-level-help           |                                                                       | string  |          | Adds a help-text.                                                                                                                      |
| field-level-help-position  | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string  |          | Specifies the direction of the arrow for the help text.                                                                                |
| format                     | (Default: HH:mm)                                                      | string  |          | Sets the format for the time. View format options [here](https://date-fns.org/v2.0.0-alpha.31/docs/format)                             |
| locale-format              |                                                                       | string  |          | Sets the locale. See Day.js locales [here](https://day.js.org/docs/en/i18n/i18n). Refer to the custom label **cmpDayJsLocaleFormats**  |
| interval                   |                                                                       | number  |          | Sets the interval between the options in the time dropdown.                                                                            |
| output-format              | (Default: HH:mm)                                                      | string  |          | Sets the format of the output when output-type is string. View format options [here](https://date-fns.org/v2.0.0-alpha.31/docs/format) |
| output-type                | string, date (Default: string)                                        | string  |          | Sets the time output type. If set to date, returns time as date object.                                                                |
| hide-icon                  | true, false (Default: false)                                          | boolean |          | Specifies if the time picker icon should be hidden.                                                                                    |
| display-value              |                                                                       | string  |          | Read-only property that displays the formatted property value.                                                                         |
| required-label             |                                                                       | string  |          | Adds a title for the asterisk when required is true.                                                                                   |

### Example _c-sf-gps-ds-osrt-time-picker_ Component

```html
<c-sf-gps-ds-osrt-time-picker
  label="Time (max : 2:00 pm, min : 10:00 pm)"
  min="14:00"
  max="10:00"
  placeholder="Select Time"
  required
  output-type="date"
  hide-icon="false"
>
</c-sf-gps-ds-osrt-time-picker>
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

Example ---

```html
<c-sf-gps-ds-osrt-time-picker
  label="Time (max : 2:00 pm, min : 10:00 pm)"
  min="14:00"
  max="10:00"
  placeholder="Select Time"
  required
  output-type="date"
  hide-icon="false"
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-time-picker>
```
