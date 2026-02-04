# Popover Lightning Web Component

The _Popover Lightning Web Component_ is a non-modal dialog. The component must be paired with a clickable trigger element and contain at least one focusable element.

## Available _c-sf-gps-ds-osrt-popover_ Attributes

| Attribute       | Value                                                                           | Type    | Required                                                 | Description                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------- | ------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| extraclass      |                                                                                 | string  |                                                          | Adds a class to the table element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'.                           |
| theme           | slds, nds (Default: slds)                                                       | string  |                                                          | Sets the theme to use for this component.                                                                                                              |
| variant         | error, feature, panel, walkthrough, warning                                     | string  |                                                          | Sets what type of popover to use. If a value is not set, a basic popover displays.                                                                     |
| nubbinposition  | top, left, bottom, right (See description for more options) (Default: top-left) | string  |                                                          | Sets the position of the triangle (nubbin) pointing to the content. There are three ways to provide nubbin position: top, top-left or top-left-corner. |
| size            | small, medium, large, full-width (Default: medium)                              | string  |                                                          | Sets the size of popover.                                                                                                                              |
| show            | true, false (Default: false)                                                    | boolean |                                                          | To display popover by default, set to true.                                                                                                            |
| showclosebutton | true, false (Default: false)                                                    | boolean |                                                          | To show the close button by default, set to true.                                                                                                      |
| icon-url        | (Default: slds icon url)                                                        | string  |                                                          | Defines the base url for the icon.                                                                                                                     |
| channelName     |                                                                                 | string  | the channel name for closing the popover on pubsub event |

To display its content, the Popover component supports three slots: `header`, `content`, `footer` (see example below). You must specific `content`. This component does not support base templates.

### Example _c-sf-gps-ds-osrt-popover_ Component

```html
<c-sf-gps-ds-osrt-popover
  title="Test"
  theme="{theme}"
  icon-url="{iconUrl}"
  showclosebutton="true"
  onmouseover="{showPopover}"
  onmouseout="{hidePopover}"
>
  <div slot="header">
    <h1>Header description</h1>
  </div>
  <div slot="content">This is a sample text</div>
  <div slot="footer">
    <button>test</button>
  </div>
</c-sf-gps-ds-osrt-popover>
```
