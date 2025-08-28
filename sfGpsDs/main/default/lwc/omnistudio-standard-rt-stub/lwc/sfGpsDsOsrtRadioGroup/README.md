# RadioGroup Lightning Web Component

The _RadioGroup Lightning Web Component_ enables users to select from single or multiple options by selecting one radio button.

## Available _c-sf-gps-ds-osrt-radio-group_ Attributes

| Attribute                  | Value                                                                 | Type   | Required | Description                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| type                       | radio, button (Default: radio)                                        | string |          | Sets the style of the radio group.                                                                                                             |
| label                      |                                                                       | string | yes      | Adds a visible title to the radio group.                                                                                                       |
| options                    |                                                                       | array  | yes      | Contains the list of label-value pairs for each radio button.                                                                                  |
| field-level-help           |                                                                       | string |          | Adds help text.                                                                                                                                |
| field-level-help-position  | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string |          | Specifies the direction of the arrow for the help text.                                                                                        |
| message-when-value-missing |                                                                       | string |          | Displays a message when no radio button is selected and the _required_ attribute is set to true.                                               |
| name                       |                                                                       | string |          | Specifies the name of the radio button group. User can select only one button if a name is specified for the group.                            |
| value                      |                                                                       | string |          | Sets the default value of the radio group.                                                                                                     |
| disabled                   |                                                                       |        |          | If present, the radio group is disabled and users cannot interact with it.                                                                     |
| required                   |                                                                       |        |          | If present, user must select the radio button in order to submit the form.                                                                     |
| validity                   | JSON                                                                  | Object |          | Defines the validity states for an element, with respect to constraint validation.                                                             |
| extraclass                 |                                                                       | string |          | Adds a class to the main container of the component. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| theme                      | slds, nds (Default: slds)                                             | string |          | Sets the theme for the radio group component.                                                                                                  |

### Example _c-sf-gps-ds-osrt-radio-group_ Component

```html
<c-sf-gps-ds-osrt-radio-group
  name="vehicle"
  value="bike"
  options='[{"label":"car","value":"car"},{"label":"bike","value":"bike"},{"label":"ship","value":"ship"}]'
></c-sf-gps-ds-osrt-radio-group>
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

Example ---

```html
<c-sf-gps-ds-osrt-radio-group
  name="vehicle"
  value="bike"
  options='[{"label":"car","value":"car"},{"label":"bike","value":"bike"},{"label":"ship","value":"ship"}]'
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-radio-group>
```

## Available Methods

**checkValidity()**

Returns the valid attribute value (boolean) on the ValidityState object.

**reportValidity()**

Displays the error messages and returns false if the input is invalid. If the input is valid, reportValidity() clears displayed error messages and returns true.

**setCustomValidity(message)**

Displays a custom error message when the textarea value is submitted. Takes the _message_ argument. If _message_ is an empty string, the error message is reset.

**showHelpMessageIfInvalid()**

Displays error messages on invalid fields. An invalid field fails at least one constraint validation and returns false when checkValidity() is called.

**focus()**

Sets focus on the textarea field.
