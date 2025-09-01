# Icon Lightning Web Component

The _Icon Lightning Web Component_ renders an svg icon.

## Available _c-sf-gps-ds-osrt-icon_ Attributes

| Attribute        | Value                                                                | Type   | Required | Description                                                                                                                                                                                                          |
| ---------------- | -------------------------------------------------------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon-name        | (For example, utility:info)                                          | string | yes      | Sets which icon to use.                                                                                                                                                                                              |
| theme            | slds, nds (Default: slds)                                            | string |          | Sets the theme for the icon.                                                                                                                                                                                         |
| baseurl          | URL                                                                  | string |          | Overrides the defined url for the svg resource.                                                                                                                                                                      |
| extraclass       |                                                                      | string |          | Adds a class to the parent of the input element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.                                                                           |
| size             | xx-small, x-small, small, medium, large (Default: small)             | string |          | Sets the size of the icon.                                                                                                                                                                                           |
| color            | Accepts name, rgb and hex values                                     | string |          | Sets the color of the icon.                                                                                                                                                                                          |
| bg-color         | Accepts name, rgb and hex values                                     | string |          | Adds a background color to the icon.                                                                                                                                                                                 |
| iconposition     | left, right (Default: left)                                          | string |          | Sets the position of the icon.                                                                                                                                                                                       |
| variant          | inverse, warning, error , success, light, default (Default: default) | string |          | Changes the appearance of action,custom, standard and utility icons. The inverse variant adds a white fill on a dark background.                                                                                     |
| alternative-text |                                                                      | string |          | Adds alternative text for the icon. For best practice, if icon is part of a button or is clickable, text should describe what action is taken, such as 'Upload File', and not what the icon is, such as "Paperclip". |
| imgsrc           |                                                                      | string |          | Sets the icon image of the path given                                                                                                                                                                                |

### Example _c-sf-gps-ds-osrt-icon_ Component

```html
<c-sf-gps-ds-osrt-icon
  theme="slds"
  icon-name="utility:add"
  size="small"
  extraclass="slds-icon-text-default"
></c-sf-gps-ds-osrt-icon>
```
