# DateTimePicker Lightning Web Component

The _DateTimePicker Lightning Web Component_ is a set of input fields with graphical user interface (GUI) widgets that enable the user to select a date from a calendar and a time from a list.

## Available _c-datetime-picker_ Attributes

| Attribute                    | Value                                                                 | Type          | Required | Description                                                                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| theme                        | slds, nds (Default: slds)                                             |               |          | Specifies which theme to use.                                                                                                                                                  |
| label                        |                                                                       | string        |          | Sets the visible name for the component.                                                                                                                                       |
| disabled                     | no value (See example code.)                                          | string        |          | To prevent users from interacting with the field, set this attribute. Sets both date and time elements.                                                                        |
| required                     | no value (See example code.)                                          |               |          | To require input field, set this attribute. Sets both date and time elements.                                                                                                  |
| tab-index                    | "0", "-1" (Default: "0")                                              | string        |          | Pass-through tabindex attribute to underlying input.                                                                                                                           |     |
| read-only                    | no value (See example code.)                                          | string        |          | If field is read-only and cannot be edited by user, set this attrubute.                                                                                                        |
| min                          |                                                                       | string        |          | The minimum acceptable value for the date. Must be in _output-format_.                                                                                                         |
| max                          |                                                                       | string        |          | The maximum acceptable value for the date. Must be in _output-format_.                                                                                                         |
| message-when-value-missing   | (Default: This field is required)                                     | string        |          | Error message to display when the value is missing.                                                                                                                            |
| message-when-bad-input       | (Default : This field is not valid)                                   | string        |          | Error message to display when a bad input is detected.                                                                                                                         |
| message-when-range-overflow  |                                                                       | string        |          | Displays an error message when _min_ and _max_ are set and a user sets a value that goes above the max value.                                                                  |
| message-when-range-underflow |                                                                       | string        |          | Displays an error message when _min_ and _max_ are set and a user sets a value that goes below the min value.                                                                  |
| icon-url                     | (Default: slds icon url)                                              | string        |          | Defines the url for the icon. Set for both date and time elements.                                                                                                             |
| field-level-help             |                                                                       | string        |          | Adds help text.                                                                                                                                                                |
| field-level-help-position    | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string        |          | Specifies the direction of the arrow for the help text.                                                                                                                        |
| interval                     |                                                                       | string/number |          | Defines the time range in the dropdown options of the time input field. User can set value as "15" or 15.                                                                      |
| output-format                | (Default: DD/MM/YYYY hh:mm a)                                         | string        |          | Sets the format of the output when output-type is string. View format options [here](https://date-fns.org/v2.0.0-alpha.37/docs/format).                                        |
| output-type                  | string, date (Default: string)                                        | string        |          | Sets the output type. If date is set, returns date object.                                                                                                                     |
| date-name                    |                                                                       | string        |          | Specifies the name of the date input element.                                                                                                                                  |
| time-name                    |                                                                       | string        |          | Specifies the name of the time input element.                                                                                                                                  |
| date-label                   |                                                                       | string        |          | Sets the visible name for the date field.                                                                                                                                      |
| time-label                   |                                                                       | string        |          | Sets the visible name for the time field.                                                                                                                                      |
| date-placeholder             |                                                                       | string        |          | Adds placeholder text inside the date input field.                                                                                                                             |
| time-placeholder             |                                                                       | string        |          | Adds placeholder text inside the time input field.                                                                                                                             |
| value                        |                                                                       | string        |          | Specifies the value of the datetimePicker element. When the date value is set, the default time value is 12:00pm. When the time value is set, the default date value is today. |
| display-value                |                                                                       | string        |          | Read-only property that displays as the formatted property value.                                                                                                              |
| hide-icon                    | true, false (Default: false)                                          | boolean       |          | Specifies if date time picker icon should be hidden                                                                                                                            |
| locale-format-invalid-error  |                                                                       | string        |          | Specifies the error message displayed when locale format is invalid.                                                                                                           |
| select-date-label            |                                                                       | string        |          | Adds a title describing the instructions for the date picker.                                                                                                                  |
| prev-month-label             |                                                                       | string        |          | Adds a title for the previous month icon.                                                                                                                                      |
| next-month-label             |                                                                       | string        |          | Adds a title for the next month icon.                                                                                                                                          |
| required-label               |                                                                       | string        |          | Adds a title for the asterisk when required is true.                                                                                                                           |
| pick-year-label              |                                                                       | string        |          | Adds a title for the year dropdown selector.                                                                                                                                   |
| today-label                  |                                                                       | string        |          | Adds a visible name for today.                                                                                                                                                 |

### Example _c-datetime-picker_ Component

```html
<c-datetime-picker
  value="2019-03-30T10:15:00"
  read-only
  disabled
  required
  date-name="date"
  time-name="time"
  date-label="Date"
  time-label="Time"
  label="Select Datetime (empty date/time label)"
  hide-icon="false"
></c-datetime-picker>
```

### Example Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

```html
<c-datetime-picker
  value="2019-03-30T10:15:00"
  read-only
  disabled
  required
  date-name="date"
  time-name="time"
  date-label="Date"
  time-label="Time"
  label="Select Datetime (empty date/time label)"
  hide-icon="false"
>
  <span slot="label">Additional markup is inserted here</span>
</c-datetime-picker>
```
