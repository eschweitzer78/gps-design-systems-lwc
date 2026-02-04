# CheckboxGroup Lightning Web Component

The _CheckboxGroup Lightning Web Component_ enables users to select from single or multiple options.

## Available _c-sf-gps-ds-osrt-checkbox-group_ Attributes

| Attribute                  | Value                                                                                                   | Type    | Required                                                        | Description                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| type                       | checkbox, button (Default: checkbox)                                                                    | string  |                                                                 | Sets the type of input elements to render.                                                                                            |
| label                      |                                                                                                         | string  | yes                                                             | Sets visible label for the checkbox group.                                                                                            |
| options                    |                                                                                                         | string  | yes                                                             | Defines the array of label-value pairs for each checkbox.                                                                             |
| message-when-value-missing |                                                                                                         | string  |                                                                 | To display a message when no checkbox is selected and _required_ is set to true, set this attribute.                                  |
| name                       |                                                                                                         | string  |                                                                 | Specifies the name of the checkbox group. Only only one button can be selected if a name is specified for the group.                  |
| value                      |                                                                                                         | string  |                                                                 | Sets the default value of checkbox group.                                                                                             |
| disabled                   |                                                                                                         |         |                                                                 | If set, the checkbox group is disabled and users cannot interact with it.                                                             |
| required                   |                                                                                                         |         |                                                                 | If set, a checkbox must be selected before the form can be submitted.                                                                 |
| validity                   | JSON                                                                                                    | Object  |                                                                 | Sets the validity state for an element, with respect to constraint validation.                                                        |
| extraclass                 |                                                                                                         |         |                                                                 | Adds a class to the main container element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| theme                      | slds, nds (Default: slds)                                                                               |         |                                                                 | Sets the theme for the component.                                                                                                     |
| checked-icon-name          | (Default: utility:add)                                                                                  | string  |                                                                 | When _type_ is set to 'icon', sets icon to use when checkbox is checked.                                                              |
| unchecked-icon-name        | (Default: utility:check)                                                                                | string  |                                                                 | When _type_ is set to 'icon', sets icon to use when checkbox is not checked.                                                          |
| checked-icon-color         | Accepts name, rgb and hex values. (Default: slds brand blue)                                            | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox icon color when checkbox is checked.                                                  |
| unchecked-icon-color       | Accepts name, rgb and hex values. (Default: white)                                                      | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox icon color when checkbox is not checked.                                              |
| checked-background-color   | Accepts name, rgb and hex values. (Default: slds brand blue)                                            | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox button background color when checkbox is checked.                                     |
| unchecked-background-color | Accepts name, rgb and hex values. (Default: slds brand blue)                                            | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox button background color when checkbox is not checked.                                 |
| checked-label-color        | Accepts name, rgb and hex values. (Default: slds brand blue)                                            | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox label color when checkbox is checked.                                                 |
| unchecked-label-color      | Accepts name, rgb and hex values. (Default: white)                                                      | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox label color when checkbox is not checked.                                             |
| checked-border-color       | Accepts name, rgb and hex values. (Default: slds brand blue)                                            | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox button border color when checkbox is checked.                                         |
| unchecked-border-color     | Accepts name, rgb and hex values. (Default: slds brand gray )                                           | string  |                                                                 | When _type_ is set to 'icon', sets the checkbox button border color when checkbox is not checked.                                     |
| icon-url                   | URL                                                                                                     | string  |                                                                 | Sets the icon URL, overriding the defined url for the svg resource.                                                                   |
| alignment                  | vertical, horizontal (Default for 'slds' _theme_ is vertical) (Default for 'nds' _theme_ is horizontal) | string  |                                                                 | Sets the orientation of the checkbox group.                                                                                           |
| required-label             |                                                                                                         | string  |                                                                 | Adds a title for the asterisk when _required_ is set to true.                                                                         |
| field-level-help           |                                                                                                         | string  |                                                                 | Adds help text.                                                                                                                       |
| field-level-help-position  | top-left, top-right, bottom-left, bottom-right (Default: bottom-left)                                   | string  |                                                                 | Specifies the direction of the arrow for the help text.                                                                               |
| fire-change-on-set-value   | true, false (Default: true)                                                                             | boolean | setting to prevent custom change event on load of checkboxgroup |

### Example _c-sf-gps-ds-osrt-checkbox-group_ Component

```html
<c-sf-gps-ds-osrt-checkbox-group
  name="vehicle"
  value="bike"
  options='[{"label":"car","value":"car"},{"label":"bike","value":"bike"},{"label":"ship","value":"ship"}]'
></c-sf-gps-ds-osrt-checkbox-group>
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

Example ---

```html
<c-sf-gps-ds-osrt-checkbox-group
  name="vehicle"
  value="bike"
  options='[{"label":"car","value":"car"},{"label":"bike","value":"bike"},{"label":"ship","value":"ship"}]'
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-checkbox-group>
```

## Available Methods

**checkValidity()**

Returns the valid attribute value (boolean) on the ValidityState object.

**reportValidity()**

Displays the error messages and returns false if the input is invalid. If the input is valid, _reportValidity()_ clears the error message and returns true.

**setCustomValidity(message)**

Sets a custom error message to display when the input value is submitted. Takes the _message_ argument. If _message_ is an empty string, the error message is reset.

**showHelpMessageIfInvalid()**

Displays error messages on invalid fields. An invalid field fails at least one constraint validation and returns false when checkValidit() is called.

**focus()**

Sets the focus on the textarea field.
