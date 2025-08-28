# LayoutItem Lightning Web Component

The _LayoutItem Lightning Web Component_ is the basic element inside the parent _Layout Lightning Web Component_ container, grouping content together to create sections inside the parent container. You can add one or more `c-sf-gps-ds-osrt-layout-item` components inside the `c-sf-gps-ds-osrt-layout` component.

## Available _c-sf-gps-ds-osrt-layout-item_ Attributes

| Attribute        | Value                                                                                                                                                                                                                                                                                                                  | Type   | Required | Description                                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| size             | 1 through 12                                                                                                                                                                                                                                                                                                           | number |          | Sets the relative space the layout item occupies. Applies to all device-types.                                                                                                                                            |
| smallDeviceSize  | 1 through 12                                                                                                                                                                                                                                                                                                           | number |          | Sets the relative space the layout item occupies on device-types larger than mobile. Defaults to same as _size_ attribute if no value provided.                                                                           |
| mediumDeviceSize | 1 through 12                                                                                                                                                                                                                                                                                                           | number |          | Sets the relative space the layout item occupies on device-types larger than tablet. Defaults to same as _size_ attribute if no value provided.                                                                           |
| largeDeviceSize  | 1 through 12                                                                                                                                                                                                                                                                                                           | number |          | Sets the relative space the layout item occupies on device-types larger than desktop. Defaults to same as _size_ attribute if no value provided.                                                                          |
| flexibility      | auto (columns grow or shrink equally as space allows), shrink (columns shrink equally as space decreases), no-shrink (columns don't shrink as space reduces), grow (columns grow equally as space increases), no-grow (columns don't grow as space increases), no-flex (columns don't grow or shrink as space changes) | string |          | Determines if the grid item is fluid so that it absorbs any extra space in its container or if it shrinks when there is less space. For multiple options, use a comma to separate each option, such as 'auto, no-shrink'. |
| alignment-bump   | left, top, right, bottom                                                                                                                                                                                                                                                                                               | string |          | Specifies a direction to bump the alignment of adjacent layout items.                                                                                                                                                     |
| padding          | horizontal-small, horizontal-medium, horizontal-large, around-small, around-medium, around-large                                                                                                                                                                                                                       | string |          | Adds padding to either the right or left side of the layout item, or to all sides of the layout item.                                                                                                                     |

### Example _c-sf-gps-ds-osrt-layout-item_ Component

```html
<c-sf-gps-ds-osrt-layout class="custom-slds-grid">
  <c-sf-gps-ds-osrt-layout-item size="3">
    {item.name}
  </c-sf-gps-ds-osrt-layout-item>
  <c-sf-gps-ds-osrt-layout-item size="1">
    {item.name}
  </c-sf-gps-ds-osrt-layout-item>
  <c-sf-gps-ds-osrt-layout-item
    size="1"
    alignment-bump="left"
    padding="around-medium"
    flexibility="auto,no-grow,no-shrink"
  >
    {item.name}
  </c-sf-gps-ds-osrt-layout-item>
  <c-sf-gps-ds-osrt-layout-item size="1">
    {item.name}
  </c-sf-gps-ds-osrt-layout-item>
</c-sf-gps-ds-osrt-layout>
```
