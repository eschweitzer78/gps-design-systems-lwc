# Img Lightning Web Component

The _Img Lightning Web Component_ is an img element that displays an available image.

## Available _c-img_ Attributes

| Attribute | Value | Type | Required | Description |
| ----------- | ------------------------- | - | - | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | theme | slds, nds, (Default: slds) | string | | Sets the theme for the component. |
| imgsrc | | string | yes | Sets the source path for the image. An NDS or SLDS image icon displays when an image source is not available. |
| alternative-text | | string | yes | Specifies the text that describes the image. When the 'imgsrc' is available, 'alternative-text' displays as a tooltip on image hover. When the 'imgsrc' is not available, 'alternative-text' displays next to the default NDS or SLDS image icon. |
| extraclass | | string | | Adds a class to the root parent of the img element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| title | | string | | Specifies the title that displayed at the bottom of the image. |
| titleclass | | string | | Adds a class to the title element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |
| size | small, medium, large, x-large, xx-large | string | | Sets the size of the image. |
| cropsize | 1x1, 4x3, 16x9 | string | | Specifies the cropping ratio for the image contrained to the parents width. |
| img-height | | string | | Specifies the height of the image. Used only when size is not specified. |
| img-width | | string | | Specifies the width of the image. Used only when size is not specified. |

### Example _c-img_ Component

```html
<c-img
  theme="slds"
  imgsrc="https://www.domain.com/image.jpg"
  alternative-text="Image Description"
  size="small"
  extraclass="slds-image slds-image--card"
></c-img>
```
