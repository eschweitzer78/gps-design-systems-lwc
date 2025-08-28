# Toast Lightning Web Component

The _Toast Lightning Web Component_ is a feedback and confirmation tool run after the user takes an action.

## Available _c-toast_ Attributes

| Attribute   | Value                                          | Type   | Required | Description                                                                                                                      |
| ----------- | ---------------------------------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| title       |                                                | string |          | Adds a title to the toast component.                                                                                             |
| message     |                                                | string | yes      | Sets the message to display.                                                                                                     |
| theme       | slds, nds (Default: slds)                      | string |          | Sets the theme for the toat component.                                                                                           |
| fixed-width |                                                | string |          | Adds a fixed width to the toast container element.                                                                               |
| styletype   | info, warning, succeess, error (Default: info) | string |          | Sets the styling based on the type supported by the selected slds or nds _theme_.                                                |
| duration    | time in milliseconds                           | number |          | To automatically remove toast after specified time, set this attribute.                                                          |
| extraclass  |                                                | string |          | Adds a class to the container element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |

### Example _c-toast_ Component

```html
<c-toast
  title="Information"
  theme="nds"
  styletype="error"
  message="This is an info toast"
  duration="3000"
></c-toast>
```
