# Toggle Lightning Web Component

The _Toggle Lightning Web Component_ enables a user to pick between two states, enable or disable an option, or select multiple options. The Toggle LWC supports attributes available in the _CheckboxGroup Lightning Web Component_.

## Available _c-toggle_ Attributes

| Attribute             | Value                                      | Type   | Required | Description                                                                                                                              |
| --------------------- | ------------------------------------------ | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| type                  | button, checkbox, icon (Default: checkbox) | string | yes      | Sets the type of toggle element to display.                                                                                              |
| icon-name             | (Default: utility:check)                   | string |          | Sets the icon of the toggle. Applies when _type_ is set to 'statefulIcon'.                                                               |
| icon-on-focus         | (Default: utility:check)                   | string |          | Sets the toggle icon to display on hover of the element. Applies when _type_ is set to 'statefulButton'.                                 |
| checked-label         |                                            | string |          | Sets the label to display when the toggle is checked. Applies when _type_ is set to 'icon', 'statefulButton', or 'dualStatefulButton'.   |
| unchecked-label       |                                            | string |          | Sets the label to display when the toggle is unchecked. Applies When _type_ is set to 'icon', 'statefulButton', or 'dualStatefulButton'. |
| label-on-focus        |                                            | string |          | Sets the toggle label to use on hover of element. Applies when _type_ is set to 'statefulButton'.                                        |
| toggle-enabled-label  | (Default: Enabled)                         | string |          | Sets the toggle label to display when the toggle is checked. Applies when _type_ is set to 'toggle'.                                     |
| toggle-disabled-label | (Default: Enabled)                         | string |          | Sets the toggle label to display when the toggle is unchecked. Applies when _type_ is set to 'toggle'.                                   |
| variant               |                                            | string |          | Sets the style of the toggle button based on the _type_ supported by the chosen theme. For example, 'success', 'brand', and so on.       |
| styles                |                                            | string |          | To set inline styles of label and text-align property. it should be in this format `style = { "label": "", "textAlign" : ""}`            |

### Example _c-toggle_ Component

```html
<c-toggle
  name="vehicle"
  value="bike"
  options='[{"label":"car","value":"car"},{"label":"bike","value":"bike"},{"label":"ship","value":"ship"}]'
></c-toggle>
```

## Label Slot Usage

To dynamically insert markup next to the input's label, add a named slot (name = label).

### Example Label Slot Usage

```html
<c-toggle
  name="vehicle"
  value="bike"
  options='[{"label":"car","value":"car"},{"label":"bike","value":"bike"},{"label":"ship","value":"ship"}]'
>
  <span slot="label">Additional markup is inserted here</span>
</c-toggle>
```

## Available Methods

Supports all methods available in the _CheckboxGroup Lightning Web Component_.
