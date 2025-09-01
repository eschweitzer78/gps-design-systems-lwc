# Menu Lightning Web Component

The _Menu Lightning Web Component_ creates a menu from the list of menu items provided.

## Available _c-sf-gps-ds-osrt-menu_ Attributes

| Attribute     | Value                                               | Type         | Required | Description                                                                                                                  |
| ------------- | --------------------------------------------------- | ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| theme         | slds, nds (Default: slds)                           |              |          | Sets the theme for the menu.                                                                                                 |
| icon-name     | (Format: standard:arrow) (Default: utility:down)    | string       |          | Sets the icon for the menu. See [SLDS icons](https://lightningdesignsystem.com/icons/).                                      |
| icon-position | right, left (Default: left)                         | string       |          | Sets icon position for the menu.                                                                                             |
| overflow      | true, false (Default: false)                        | boolean      |          |                                                                                                                              |
| type          | action                                              | string       |          | To create a menu where each item is a link that performs an action, set attribute to action.                                 |
| position      | left, right, bottom (Default: left)                 | string       |          | Sets the position of the dropdown menu.                                                                                      |
| size          | xx-small, x-small, small, medium, large             | string       |          | Sets the size of dropdown menu.                                                                                              |
| checked       | single, multiple, true, false (Default: false)      | string       |          | To create a menu with multi selectable or single selectable items, set this value.                                           |
| icon-size     | xx-small, x-small, small, large (Default: xx-small) | string       |          | Sets the icon size for the button element inside menu.                                                                       |
| extra-class   |                                                     | value:string |          | sets the class for menu                                                                                                      |
| variant       |                                                     | string       |          | Sets the style of the menu button based on the _type_ supported by the chosen theme. For example, success, brand, and so on. |
| record        |                                                     | Object       |          | Provides the record from which to interpolate the field values.                                                              |
| menuItems     |                                                     | Array        |          | To create menuItem lwc inside menu lwc.                                                                                      |
| disabled      | true, false (Default: false)                        | boolean      |          | To disable menu, set to false.                                                                                               |

### Example menuItems Array

```Html
      [{ name: name,
      label: "Action",
      iconName: "standard-default",
      actionData: {} }]
```

### Example _c-sf-gps-ds-osrt-menu_ Component

```Html
     <c-sf-gps-ds-osrt-menu theme="slds" scroll="5" checked="multiple" type="action" size="large" position="right" icon-name="utility:down">
     </c-sf-gps-ds-osrt-menu>
```

```Html
  <c-sf-gps-ds-osrt-menu theme="slds" icon-name="utility:down">
      <c-sf-gps-ds-osrt-menu-item record={data1} icon-name="action:info"></c-sf-gps-ds-osrt-menu-item>
      <c-sf-gps-ds-osrt-menu-item record={data2} icon-position="Right" icon-name="action:info"></c-sf-gps-ds-osrt-menu-item>
  </c-sf-gps-ds-osrt-menu>
```
