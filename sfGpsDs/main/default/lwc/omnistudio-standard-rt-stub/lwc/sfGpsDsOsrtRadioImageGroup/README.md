# RadioImageGroup Lightning Web Component

The _RadioImageGroup Lightning Web Component_ extends the _RadioGroup Lightning Web Component_ adding additional features. The _RadioImageGroup Lightning Web Component_ enables users to choose from single or multiple options by selecting an image instead of a radio button.

## Available _c-sf-gps-ds-osrt-radio-image-group_ Attributes

| Attribute                 | Value                                                                 | Type           | Required                                                       | Description                                                                   |
| ------------------------- | --------------------------------------------------------------------- | -------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- | --- |
| enabled-caption           | true, false (Default: false)                                          | boolean        |                                                                | To show a caption, set to true.                                               |
| control-width             | Width in pixels (Default: auto)                                       | string         |                                                                | Sets the width of radio button image.                                         |
| control-height            | Height in pixels (Default: auto)                                      | string         |                                                                | Sets the height of radio button image.                                        |
| image-count-in-row        |                                                                       | Integer/String |                                                                | To set the number of checkbox images to display in a row, set this attribute. |
| horizontal-mode           | true, false (Default: false)                                          | boolean        |                                                                | To display the radio buttons horizontally, set to true.                       |
| is-image-display          | true, false (Default: false)                                          | boolean        |                                                                | To show image, set to true. Only valid when _is-image_ is set to true.        |
| is-display-radio          | true, false (Default: false)                                          | boolean        | yes (if is-image and is-display-wide are set to false)         | Displays radio buttons as radio input.                                        |
| is-display-wide           | true, false (Default: false)                                          | boolean        | yes (if is-image and is-display-radio are set to false)        | Displays radio buttons as tabs.                                               |
| is-image                  | true, false (Default: false)                                          | boolean        | yes (if is-display-radio and is-display-wide are set to false) | Displays radio buttons as image.                                              |     |
| tab-index                 | "0", "-1" (Default: "0")                                              | string         |                                                                | Pass-through tabindex attribute to underlying input.                          |     |
| field-level-help          |                                                                       | string         |                                                                | Adds help text.                                                               |
| field-level-help-position | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string         |                                                                | Specifies the direction of the arrow for the help text.                       |

### Available Methods

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

### Example _c-sf-gps-ds-osrt-radio-image-group_ Component

```html
<c-sf-gps-ds-osrt-radio-image-group
  class="slds-p-top_small"
  name="rad"
  type="radio"
  options='[{"name": "male", "value": "male", imgId: "https://image.shutterstock.com/image-photo/summer-beach-holiday-online-shopping-450w-461355724.jpg", "selected": false},
  {"name": "female", "value": "female", imgId: "https://cdn.pixabay.com/photo/2015/11/06/15/13/internet-1028794__340.jpg", "selected": true}]'
  is-image="true"
></c-sf-gps-ds-osrt-radio-image-group>
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

Example ---

```html
<c-sf-gps-ds-osrt-radio-image-group
  class="slds-p-top_small"
  name="rad"
  type="radio"
  options='[{"name": "male", "value": "male", imgId: "https://image.shutterstock.com/image-photo/summer-beach-holiday-online-shopping-450w-461355724.jpg", "selected": false},
  {"name": "female", "value": "female", imgId: "https://cdn.pixabay.com/photo/2015/11/06/15/13/internet-1028794__340.jpg", "selected": true}]'
  is-image="true"
>
  <span slot="label">Additional markup is inserted here</span>
</c-sf-gps-ds-osrt-radio-image-group>
```
