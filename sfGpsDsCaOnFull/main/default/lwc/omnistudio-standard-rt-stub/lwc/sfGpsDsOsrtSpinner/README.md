# Spinner Lightning Web Component

The _Spinner Lightning Web Component_ displays an animated image that indicates a feature is loading. You can display this component when retrieving data or when an operation takes time to complete.

## Available _c-sf-gps-ds-osrt-spinner_ Attributes

| Attribute        | Value                                 | Type   | Required | Description                                                                                                                                                                                                                         |
| ---------------- | ------------------------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| alternative-text |                                       | string |          | Adds alternative text that describes the purpose for the wait.                                                                                                                                                                      |
| size             | small, medium, large (Default: small) | string |          | Sets the size of the spinner.                                                                                                                                                                                                       |
| variant          | base, brand, inverse                  | string |          | Changes the appearance of the spinner.                                                                                                                                                                                              |
| extraclass       |                                       | string |          | Adds a class to the parent of the input element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.                                                                                          |
| extraouterclass  |                                       | string |          | Adds a class to the outer container of the spinner element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. You can add a class with this attribute to increase background color opacity. |
| theme            | slds, nds (Default: slds)             | string |          | Defines the styles that is used on the element. slds or nds.                                                                                                                                                                        |
| message          |                                       | string |          | Messages displayed underneath the spinner.                                                                                                                                                                                          |
| messageclass     |                                       | string |          | Adds class to the messages displayed underneath the spinner.                                                                                                                                                                        |

### Example _c-sf-gps-ds-osrt-spinner_ Component

```html
<c-sf-gps-ds-osrt-spinner
  variant="inverse"
  alternative-text="Loading content..."
  size="medium"
></c-sf-gps-ds-osrt-spinner>
```
