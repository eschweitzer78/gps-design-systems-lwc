# CheckboxImageGroup Lightning Web Component

The _CheckboxImageGroup Lightning Web Component_ extends the _CheckboxGroup Lightning Web Component_ adding additional features. The _CheckboxImageGroup Lightning Web Component_ enables users to select from single or multiple options by clicking images instead of checkboxes.

## Available _c-sf-gps-ds-osrt-checkbox-image-group_ Attributes

| Attribute                 | Value                                                                 | Type            | Required                                   | Description                                                                                      |
| ------------------------- | --------------------------------------------------------------------- | --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| checked                   | true, false (Default: false)                                          | boolean         |                                            | Sets the default value of checkbox input. Applies only when _is-display-checkbox_ is true.       |
| enabled-caption           | true, false (Default: false)                                          | boolean         |                                            | To show a caption, set to true.                                                                  |
| control-width             | Width in pixels. (Default: auto)                                      | string          |                                            | Sets the width of checkbox image.                                                                |
| control-height            | Height in pixels. (Default: auto)                                     | string          |                                            | Sets the height of checkbox image.                                                               |
| image-count-in-row        |                                                                       | integer, string |                                            | To set the number of checkbox images to display in a row, set this attribute.                    |
| is-display-checkbox       | true, false (Default: false)                                          | boolean         | yes (if _is-image_ is set to false)        | To display checkbox as a checkbox input, set to true. If set to true, _is-image_ cannot be true. |
| is-image                  | true, false (Default: false)                                          | boolean         | (if _is-display-checkbox_ is set to false) | To display checkbox as image, set to true. If set to true, _is-display-checkbox_ cannot be true. |
| is-image-display          | true, false (Default: false)                                          | boolean         |                                            | To display images, set to true.                                                                  |
| field-level-help          |                                                                       | string          |                                            | Adds help text.                                                                                  |
| field-level-help-position | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string          |                                            | Specifies the direction of the arrow for the help text.                                          |

### Example _c-sf-gps-ds-osrt-checkbox-image-group_ Component

```html
<c-sf-gps-ds-osrt-checkbox-image-group
  class="slds-p-top_small"
  name="check"
  required
  image-count-in-row="6"
  type="checkbox"
  label="Don't Accept"
  is-display-checkbox="true"
>
</c-sf-gps-ds-osrt-checkbox-image-group>
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

Example ---

```html
<c-sf-gps-ds-osrt-checkbox-image-group
  class="slds-p-top_small"
  name="check"
  required
  image-count-in-row="6"
  type="checkbox"
  label="Don't Accept"
  is-display-checkbox="true"
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-checkbox-image-group>
```

## Available Methods

#### checkValidity()

Returns the valid attribute value (boolean) on the ValidityState object.

#### reportValidity()\*\*

Displays the error messages and returns false if the input is invalid. If the input is valid, _reportValidity()_ clears the error message and returns true.

#### setCustomValidity(message)\*\*

Sets a custom error message to display when the input value is submitted. Takes the _message_ argument. If _message_ is an empty string, the error message is reset.

**showHelpMessageIfInvalid()**

Displays error messages on invalid fields. An invalid field fails at least one constraint validation and returns false when checkValidit() is called.

**focus()**

Sets the focus on the textarea field.
