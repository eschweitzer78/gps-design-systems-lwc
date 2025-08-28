# RadioColorPickGroup Lightning Web Component

The _RadioColorPickGroup Lightning Web Component_ extends the _RadioImageGroup Lightning Web Component_ adding additional features. The _RadioColorPickGroup Lightning Web Component_ enables users to choose from single option by selecting an color item instead of a radio button.

## Available _radio-color-pick-group_ Attributes

| Attribute        | Value                            | Type    | Required | Description                            |
| ---------------- | -------------------------------- | ------- | -------- | -------------------------------------- |
| control-width    | Width in pixels (Default: auto)  | string  |          | Sets the width of radio button image.  |
| control-height   | Height in pixels (Default: auto) | string  |          | Sets the height of radio button image. |
| is-color-display | true, false (Default: false)     | boolean |          | To show color pick, set to true.       |

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

### Example _radio-color-pick-group_ Component

```html
<c-radio-color-pick-group
  class="slds-p-top_small"
  name="radio"
  type="radio"
  options='[ { "label": "White", "value": "#f6f3f0", "selected": false, "name": "White", }, { "label": "Black", "value": "#2f2d36", "selected": false }, { "label": "Blue", "value": "#12476d", "selected": false }, { "label": "Green", "value": "#dbf1d9", "selected": false }, { "label": "(Product) Reb", "value": "#db3c3b", "selected": false } ]'
  control-width="200"
  control-height="100"
  is-color-display="true"
></c-radio-color-pick-group>
```

### Label Slot Usage

A named slot (name = label) is available in the event a user would like to dynamically insert markup next to the input's label.

Example ---

```html
<c-radio-color-pick-group
  class="slds-p-top_small"
  name="radio"
  type="radio"
  options='[ { "label": "White", "value": "#f6f3f0", "selected": false, "name": "White", }, { "label": "Black", "value": "#2f2d36", "selected": false }, { "label": "Blue", "value": "#12476d", "selected": false }, { "label": "Green", "value": "#dbf1d9", "selected": false }, { "label": "(Product) Reb", "value": "#db3c3b", "selected": false } ]'
  control-width="200"
  control-height="100"
  is-color-display="true"
>
  <span slot="label">Additional markup is inserted here</span>
</c-radio-color-pick-group>
```
