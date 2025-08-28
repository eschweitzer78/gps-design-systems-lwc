# Button Lightning Web Component

The _Button Lightning Web Component_ renders a button element to perform an action.

## Available _c-sf-gps-ds-osrt-button_ Attributes

| Attribute     | Value                                                                | Type    | Required | Description                                                                                                                   |
| ------------- | -------------------------------------------------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| label         |                                                                      | string  |          | Adds a visible label for the button element.                                                                                  |
| aria-label    |                                                                      | string  |          | Adds an aria label for the button element.                                                                                    |
| type          | reset, button, submit (Default: button)                              |         |          | Sets the type of button element.                                                                                              |
| extraclass    |                                                                      | string  |          | Adds a class to the button element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| disable-tab   | true, false (Default: false)                                         | boolean |          | To remove the button element from tab focus.                                                                                  |
| bg-color      | Accepts name, rgb and hex                                            | string  |          | Adds a background color to the button element.                                                                                |
| disabled      | true, false (Default: false)                                         | boolean |          | To disable button, set to false.                                                                                              |
| theme         | slds, nds (Default: slds)                                            | string  |          | Sets the theme for the button.                                                                                                |
| variant       |                                                                      | string  |          | Sets the style of the button based on the _type_ supported by the chosen theme. For example, success, brand, and so on.       |
| icon-name     | (Format: utility:close)                                              | string  |          | Adds an icon to the button. See [SLDS icons](https://lightningdesignsystem.com/icons/).                                       |
| icon-position | left, right (Default: left if label is specified)                    | string  |          | Sets the position of the button icon.                                                                                         |
| icon-size     | xx-small, x-small, small, medium, large (Default: xx-small)          | string  |          | Sets the icon size for the button element.                                                                                    |
| icon-url      | URL                                                                  | string  |          | Overrides the defined url for the icon svg resource.                                                                          |
| icon-fill     | Accepts name, rgb and hex values.                                    | string  |          | Adds color inside the icon.                                                                                                   |
| icon-bg-color | Accepts name, rgb and hex values.                                    | string  |          | Adds a background color to the icon.                                                                                          |
| icon-variant  | inverse, warning, error , success, light, default (Default: default) | string  |          | Changes the appearance of the icon. The inverse variant adds a white fill on a dark background.                               |
| styles        |                                                                      | string  |          | To set inline styles of label. it should be in this formt `style = { "label": ""}`                                            |

### Example _c-sf-gps-ds-osrt-button_ Component

```html
<c-sf-gps-ds-osrt-button
  icon-url="/slds"
  variant="brand"
  disabled=""
  label="disabled"
  icon-name="utility:close"
  icon-position="right"
></c-sf-gps-ds-osrt-button>
```
