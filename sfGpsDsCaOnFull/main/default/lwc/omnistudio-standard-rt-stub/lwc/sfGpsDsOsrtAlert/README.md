# Alert Lightning Web Component

The _Alert Lightning Web Component_ displays an SLDS or Newport alert.

## Available _c-alert_ Attributes

| Attribute   | Value                                         | Type    | Required | Description                                                                                                                                                              |
| ----------- | --------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| theme       | slds, nds (Default: slds)                     | string  |          | Specifies the theme to use.                                                                                                                                              |
| message     |                                               | string  |          | Pass simple message into the component. For messages containing markup, use the default slot. If slotted content is passed, `Alert#message` is ignored.                  |
| variation   | info, warning, error, offline (Default: info) | string  |          | An enum value representing the components style variation.                                                                                                               |
| dismissible | true, false (Default: false)                  | boolean |          | If true, the alert can be dismissed by user.                                                                                                                             |
| icon        |                                               | string  |          | The icon name in `spriteName:iconName` format. For example `utility:info`. Pass an empty string to hide. See [SLDS icons](https://www.lightningdesignsystem.com/icons/). |

### Example \*c-alert\*\* Component

```html
<c-alert
  theme="slds"
  variation="info|warning|error|offline"
  icon="utility:trail"
  message="This is a simple message."
>
  <span
    >For more <em>complex</em> messaging, use the default slot.
    <a
      href="https://lwc.dev/guide/composition#pass-markup-into-slots"
      target="_blank"
      >Using slots.</a
    >
  </span>
</c-alert>
```

## Available Custom Labels

| Label | ApiName  | Description                                                |
| ----- | -------- | ---------------------------------------------------------- |
| Close | cmpClose | Assistive text for the icon to close or dismiss the alert. |

## Available Methods

**dismiss()**

Dismisses the alert.

### Available Classes

**Alert**

Static class of `c-alert` component.

### Available Events

**dismissed**

Fires when alert is dismissed.

### Available Variations

**enum**

Enum for style variations. Is read-only.
