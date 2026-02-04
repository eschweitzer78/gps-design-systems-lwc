# Tooltip Lightning Web Component

The _Tooltip Lightning Web Component_ displays a small amount of contextual information about an element on the screen when a user hovers or focuses on an icon next to the element. Information can either be plain text or custom markup (HTML).

## Available _c-sf-gps-ds-osrt-tooltip_ Attributes

| Attribute     | Value                                                                               | Type    | Required | Description                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon-name     | (Format: standard:arrow) (Default: utility:info)                                    | string  |          | Sets the icon for the tooltip. See [SLDS icons](https://lightningdesignsystem.com/icons/).                                                                                                        |
| content       |                                                                                     | string  | yes      | Adds the text to display in the tooltip. If custom markup exists, `content` text is ignored. See **Example Custom Markup** on this page.                                                          |
| icon-url      |                                                                                     | string  |          | Overrides the default URL of the svg resource.                                                                                                                                                    |
| extraclass    |                                                                                     | string  |          | Adds a class to the table element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. This attribute can also override classes specified by arrowposition. |
| theme         | slds, nds (Default: slds)                                                           |         |          | Sets the theme for the tooltip component.                                                                                                                                                         |
| arrowposition | top, bottom, left, right (See description for more options). (Default: bottom-left) | string  |          | Sets the arrow (nubbin) position. There are three ways to provide arrow position: top, top-left, or top-left-corner.                                                                              |
| icon-size     | xx-small, x-small, small, medium, large. (Default: xx-small)                        | string  |          | Sets the size of the icon.                                                                                                                                                                        |
| icon-variant  | inverse, warning, error, default (Default: default)                                 | string  |          | To change the appearance of a utility icon, set this attribute. Use the 'inverse' variant to implement a white fill on dark backgrounds for utility icons.                                        |
| button-icon   | true/false (Default: true)                                                          | string  |          | It is used to create a button Icon type tooltip.                                                                                                                                                  |
| disable-tab   | true, false (Default: false)                                                        | boolean |          | To remove the tooltip element from tab focus.                                                                                                                                                     |

### Example _c-sf-gps-ds-osrt-tooltip_ Component

```html
<c-sf-gps-ds-osrt-tooltip
  content="This is a test message"
  arrowposition="top-right"
  icon-name="utility:add"
></c-sf-gps-ds-osrt-tooltip>
```

### Example Custom Markup

```html
<c-sf-gps-ds-osrt-tooltip
  theme="{theme}"
  icon-url="{iconUrl}"
  content="This is a demo help text"
  arrowposition="top-right"
>
  <div>
    <h1>This is Custom markup</h1>
    <span>You can put HTML inside the tooltip</span>
    <c-sf-gps-ds-osrt-button
      variant="brand"
      label="This is a Button"
    ></c-sf-gps-ds-osrt-button>
  </div>
</c-sf-gps-ds-osrt-tooltip>
```
