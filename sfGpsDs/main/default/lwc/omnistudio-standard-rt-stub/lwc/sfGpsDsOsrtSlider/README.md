# Slider Lightning Web Component

The _Slider Lightning Web Component_ is a graphical control element for a user to set a value by moving an indicator horizontally or vertically.

## Available _c-sf-gps-ds-osrt-slider_ Attributes

| Attribute                 | Value                                                                 | Type   | Required | Description                                                                                                                                                 |
| ------------------------- | --------------------------------------------------------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label                     |                                                                       | string |          | Adds a visible label to the slider component.                                                                                                               |
| theme                     | slds, nds (Default: slds)                                             |        |          | Sets the theme for the slider component.                                                                                                                    |
| disabled                  | true, false (Default: false)                                          |        |          | To disable the slider, set to true.                                                                                                                         |
| min                       | (Default : 0)                                                         | string |          | Sets the min value of the range. (For example -1000, 0, and so on)                                                                                          |
| max                       | (Default : 100)                                                       | string |          | Sets the maximum value of the range. (For example, 100, 1000, and so on)                                                                                    |
| value                     |                                                                       | string |          | Sets the initial value for the slider.                                                                                                                      |
| step                      | (Default: 0)                                                          | number |          | Specifies the size of each movement (an increment or jump between values) of the slider control.                                                            |
| size                      | xx-small, small, medium                                               | string |          | Sets the size of the slider.                                                                                                                                |
| type                      | horizontal, vertical (Default: horizontal )                           | string |          | Sets the orientation of the slider.                                                                                                                         |
| imask                     | object                                                                | string |          | Supports masking to range and input value. For display, not manuplation. For more information on imask, see [imask.js](https://unmanner.github.io/imaskjs/) |
| field-level-help          |                                                                       | string |          | Adds help text.                                                                                                                                             |
| field-level-help-position | top-left, top-right, bottom-left, bottom-right (Default: bottom-left) | string |          | Specifies the direction of the arrow for the help text.                                                                                                     |

### Example _c-sf-gps-ds-osrt-slider_ Component

```html
<c-sf-gps-ds-osrt-slider
  type="vertical"
  step="20"
  label="Slider Component"
  size="medium"
  min="-1000"
  max="1000"
  value="0"
>
</c-sf-gps-ds-osrt-slider>
```
