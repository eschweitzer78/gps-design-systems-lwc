# DatePicker Lightning Web Component

The _DatePicker Lightning Web Component_ is a date input element with a graphical user interface (GUI) widget that enables the user to select a date from a calendar. The _DatePicker LWC_ supports custom labels.

## Available _c-sf-gps-ds-osrt-date-picker_ Attributes

| Attribute                   | Value                                                                 | Type    | Required | Description                                                                                                                              |     |
| --------------------------- | --------------------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --- | --- |
| label                       |                                                                       | string  |          | Adds a visible name for the rendered date picker.                                                                                        |     |
| placeholder                 |                                                                       | string  |          | Adds placeholder text in the input field.                                                                                                |     |
| error                       |                                                                       | string  |          | Adds text for an error message.                                                                                                          |     |
| name                        |                                                                       | string  |          | Adds a name for the date picker.                                                                                                         |     |
| mask                        |                                                                       |         |          | To define how a user must write an input value, set this attribute. (For example, "$###,###.000" , "##’##")                              |     |
| format                      |                                                                       | string  |          | Sets the input format for the selected date. View format options [here](https://date-fns.org/v2.0.0-alpha.37/docs/format).               |     |
| locale-format               |                                                                       | string  |          | Sets the locale. See Dayjs locales [here](https://day.js.org/docs/en/i18n/i18n). Refer to the custom label **cmpDayJsLocaleFormats**     |     |
| output-format               | (Default: YYYY-MM-DD)                                                 | string  |          | Sets the format of the output, when output-type is string. View format options [here](https://date-fns.org/v2.0.0-alpha.37/docs/format). |     |
| min                         |                                                                       | string  |          | Sets a minimum date. User defined value.                                                                                                 |     |
| max                         |                                                                       | string  |          | Sets a maximum date. User defined value                                                                                                  |     |
| position                    | left, right (Default: left)                                           | string  |          | Specifies where the component displays in relation to the input field.                                                                   |     |
| required                    | true, false (Default: false)                                          | boolean |          | To make this component required, set to true. Adds an asterisk next to the label.                                                        |     |
| tab-index                   | "0", "-1" (Default: "0")                                              | string  |          | Pass-through tabindex attribute to underlying input.                                                                                     |     |
| disabled                    | true, false (Default: false)                                          | boolean |          | To disable this component, set to true.                                                                                                  |     |
| readonly                    | true, false (Default: false)                                          | boolean |          | To make this component read only, set to true.                                                                                           |     |
| theme                       | slds, nds (Default: slds)                                             | string  |          | Specifies which theme to use.                                                                                                            |     |
| output-type                 | string, date (Default: string)                                        | string  |          | Sets the type of output.                                                                                                                 |     |     |
| value                       |                                                                       | string  |          | Specifies the value of the datePicker element.                                                                                           |
| display-value               |                                                                       | string  |          | Read-only property that displays the formatted property value.                                                                           |
| locale-format-invalid-error |                                                                       | string  |          | Specifies the error message displayed when locale format is invalid.                                                                     |
| select-date-label           |                                                                       | string  |          | Adds a title describing the instructions for the date picker.                                                                            |
| prev-month-label            |                                                                       | string  |          | Adds a title for the prev month icon.                                                                                                    |
| next-month-label            |                                                                       | string  |          | Adds a title for the next month icon.                                                                                                    |
| required-label              |                                                                       | string  |          | Adds a title for the asterisk when required is true.                                                                                     |
| pick-year-label             |                                                                       | string  |          | Adds a title for the year dropdown selector.                                                                                             |
| today-label                 |                                                                       | string  |          | Adds a visible name for today.                                                                                                           |
| field-level-help            |                                                                       | string  |          | Adds help text.                                                                                                                          |
| field-level-help-position   | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string  |          | Specifies the direction of the arrow for the help text.                                                                                  |
| \_focusDayOfMonth           |                                                                       | number  |          | Tracks the focused day of the month.                                                                                                     |

### Example _c-sf-gps-ds-osrt-date-picker_ Component

```html
<c-sf-gps-ds-osrt-date-picker
  theme=""
  disabled="true"
  label="Disabled"
  name="date picker"
  value="date picker"
  hide-icon="false"
></c-sf-gps-ds-osrt-date-picker>
```

### Example Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

```html
<c-sf-gps-ds-osrt-date-picker
  theme=""
  disabled="true"
  label="Disabled"
  name="date picker"
  value="date picker"
  hide-icon="false"
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-date-picker>
```

## Available Custom Labels

| Label                                                                                                                                                                                                                                                                                                                                   | ApiName                  | Description                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| Select Date                                                                                                                                                                                                                                                                                                                             | cmpSelectDate            | Text visible on mouse over of the calendar icon.                                                |
| This field value is missing.                                                                                                                                                                                                                                                                                                            | cmpFieldValueMissing     | Message to display when user leaves the date picker when the value is missing.                  |
| Unable to render ${1} due to invalid localeFormat [${2}]. Please provide a valid localeFormat in the form of {"name":"en","weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"months":["January","February","March","April","May","June","July","August","September","October","November","December"]} | localeFormatInvalidError | Text visible when a user enters an invalid locale format.                                       |
| Previous Month                                                                                                                                                                                                                                                                                                                          | prevMonthLabel           | Text visible on mouse over of the calendar's previous month icon. Default icon is a left arrow. |
| Next Month                                                                                                                                                                                                                                                                                                                              | nextMonthLabel           | Text visible on mouse over of the calender's next month icon. Default icon is right arrow.      |
| required                                                                                                                                                                                                                                                                                                                                | requiredLabel            | Text visible on mouse over of `*` next to the Date label.                                       |
| Pick a year                                                                                                                                                                                                                                                                                                                             | cmpPickYr                | Assistive text for the year dropdown on the calendar's header.                                  |
| Today                                                                                                                                                                                                                                                                                                                                   | todayLabel               | Text for the link to select today's date.                                                       |
| Invalid Value.                                                                                                                                                                                                                                                                                                                          | cmpInvalidValue          | Text visible on input of an invalid value.                                                      |
| Date is before the allowed range.                                                                                                                                                                                                                                                                                                       | cmpRangeUnderflow        | Text visible when a user selects a date below the allowed range.                                |
| Date is after the allowed range.                                                                                                                                                                                                                                                                                                        | cmpRangeOverflow         | Text visible when a user selects a date date after the allowed range.                           |
