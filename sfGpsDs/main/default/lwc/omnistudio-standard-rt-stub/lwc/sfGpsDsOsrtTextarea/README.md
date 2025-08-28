# Textarea Lightning Web Component

The _Textarea Lightning Web Component_ creates an HTML textarea element for entering multi-line text input. A text area holds an unlimited number of characters.

## Available _c-sf-gps-ds-osrt-textarea_ Attributes

| Attrubute                  | Value                                                                 | Type   | Required | Description                                                                                                                           |
| -------------------------- | --------------------------------------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| label                      |                                                                       | string | yes      | Adds a title for the textarea element.                                                                                                |
| placeholder                |                                                                       | string |          | Adds text to inside the textarea that displayed when the field is empty, prompting the user for a valid entry.                        |
| name                       |                                                                       | string |          | Specifies the name of the textarea element.                                                                                           |
| message-when-bad-input     |                                                                       | string |          | Displays an error message when a bad input is detected.                                                                               |
| message-when-too-short     |                                                                       | string |          | Displays an error message when the value is too short.                                                                                |
| message-when-too-long      |                                                                       | string |          | Displays an error message when the value is too long.                                                                                 |
| message-when-value-missing |                                                                       | string |          | Displays an error message when the value is missing.                                                                                  |
| access-key                 |                                                                       | string |          | The keyboard shortcut for input field.                                                                                                |
| max-length                 |                                                                       | number |          | The maximum number of characters allowed in the textarea.                                                                             |
| min-length                 |                                                                       |        |          | Sets the minimum number of characters allowed in the textarea.                                                                        |
| value                      |                                                                       | string |          | Sets the value of the textarea input.                                                                                                 |
| disabled                   |                                                                       |        |          | If present, the textarea field is disabled and users cannot interact with it.                                                         |
| read-only                  |                                                                       |        |          | If present, the textarea field is read-only and user cannot edit it.                                                                  |
| required                   |                                                                       |        |          | If present, user must fill out textarea in order to submit the form.                                                                  |
| variant                    | standard, label-hidden (Default: standard)                            | string |          | Changes the appearance of the input field.                                                                                            |
| validity                   |                                                                       |        |          | Sets the validity states for the textarea element, with respect to constraint validation.                                             |
| field-level-help           |                                                                       | string |          | To provide an informational tooltip on the textarea input field, set this attribute.                                                  |
| field-level-help-position  | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string |          | Specifies the direction of the arrow for the help text.                                                                               |
| theme                      | slds, nds, (Default: slds)                                            | string | string   | Sets the theme for the textarea component.                                                                                            |
| extraclass                 |                                                                       |        |          | Adds a class to the textarea input element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| height                     |                                                                       |        |          | Sets the height of the textarea.                                                                                                      |
| required-label             |                                                                       | string |          | Adds a title for the asterisk when _required_ is set to true.                                                                         |
| autocomplete               |                                                                       | string |          | Sets a hint to the browser on what values can autocomplete the textarea.                                                              |

### Example _c-sf-gps-ds-osrt-textarea_ Component

```html
<c-sf-gps-ds-osrt-textarea
  label="Message When Value Long(30 char)"
  max-length="30"
  message-when-too-long="Value is too long."
  placeholder="Enter Description..."
></c-sf-gps-ds-osrt-textarea>
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

Example ---

```html
<c-sf-gps-ds-osrt-textarea
  label="Message When Value Long(30 char)"
  max-length="30"
  message-when-too-long="Value is too long."
  placeholder="Enter Description..."
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-textarea>
```

### Available Methods

**checkValidity()**

Returns the valid attribute value (Boolean) on the ValidityState object.

**reportValidity()**

Displays the error messages and returns false if the input is invalid. If the input is valid, reportValidity() clears displayed error messages and returns true.

**setCustomValidity()**

Displays a custom error message when the textarea value is submitted. Takes the _message_ argument. If _message_ is an empty string, the error message is reset.

**showHelpMessageIfInvalid()**

Displays error messages on invalid fields. An invalid field fails at least one constraint validation and returns false when checkValidity() is called.

**focus()**

Sets focus on the textarea field.

**blur()**

Removes focus from the textarea field.
