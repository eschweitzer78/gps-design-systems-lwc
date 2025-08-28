# Layout Lightning Web Component

The _Layout Lightning Web Component_ is a flexible grid system for arranging containers on a page or inside other containers.

## Available _c-sf-gps-ds-osrt-layout_ Attributes

| Attribute        | Value                       | Type    | Required | Description                                                                                                                                                                   |
| ---------------- | --------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| theme            | slds, nds (Default: slds)   | string  |          | Sets the theme to use for the layout.                                                                                                                                         |
| extraclass       |                             | string  |          | Adds an additional class. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.                                                           |
| horizontal-align | center, space, spread, end  | string  |          | Determines how to spread the layout items horizontally in the container.                                                                                                      |
| vertical-align   | start, center, end, stretch | string  |          | Determines how to align the layout items vertically in the container.                                                                                                         |
| pull-to-boundary | small, medium, large        | string  |          | Pulls layout items to the layout boundaries and corresponds to the padding size on the layout item component. See **LayoutItem Lightning Web Component** _padding_ attribute. |
| multiple-rows    |                             | boolean |          | If set, layout items wrap to the following line when they exceed the layout width.                                                                                            |

### Example _c-sf-gps-ds-osrt-layout_ Component

```html
<c-sf-gps-ds-osrt-layout
  class="custom-slds-grid"
  theme="nds"
  horizontal-align="center"
  vertical-align="stretch"
  pull-to-boundary="medium"
>
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
