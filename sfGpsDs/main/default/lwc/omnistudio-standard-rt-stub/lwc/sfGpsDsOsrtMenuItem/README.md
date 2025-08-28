# MenuItem Lightning Web Component

The _MenuItem Lightning Web Component_ is the basic element inside the _Menu Lightning Web Component_. Each `c-sf-gps-ds-osrt-menu-item` component adds an item to the menu.

## Available _c-sf-gps-ds-osrt-menu-item_ Attributes

| Attribute     | Value                                | Type    | Required | Description                                                                                                                                       |
| ------------- | ------------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | unique                               | string  |          | Sets the visible menu item name.                                                                                                                  |
| record        |                                      | string  |          | Contains the menu item data.                                                                                                                      |
| theme         | slds, nds (Default: slds)            | string  |          | Sets which theme menu uses.                                                                                                                       |
| icon-name     | (Format: standard:arrow)             | string  |          | Sets the icon for the menu item. See [SLDS icons](https://lightningdesignsystem.com/icons/).                                                      |
| icon-position | right, left (Default: left)          | string  |          | Sets icon position for the menu item data.                                                                                                        |
| type          | header, action                       | string  |          | To the make menu item a sub-header of the menu, set to header. To create a menu where each item is a link that performs an action, set to action. |
| action-url    |                                      | string  |          | Sets the action URL for the menu item. Must set `type` to _action_.                                                                               |
| open-url-in   | newTab, currentTab (Default: newTab) | string  |          | Sets the mode in which the action URL should be opened.                                                                                           |
| status        | error, warning, success              | string  |          | Sets the status for the menu item and updates the menu item style.                                                                                |
| checked       | true, false (Default: false)         | boolean |          | To set a default selected menu item, set to true.                                                                                                 |
| label         |                                      | string  |          | Contains the menu item label.                                                                                                                     |
| obj           |                                      | Object  |          | Provides the record to set the stateObject property of action lwc.                                                                                |
| actionData    |                                      | Object  |          | To set the details of action menu item lwc.                                                                                                       |

### Example actionData Object

```Html
      actionData: {
        stateObj: "{record}",
        card: "{card}",
        stateAction: {
          id: "test-action",
          type: "Custom",
          displayName: "Action",
          vlocityIcon: "standard-default",
          targetType: "Web Page",
          openUrlIn: "Current Window",
          "Web Page": { targetName: "/apex" }
        }
      }
```

### Example _c-sf-gps-ds-osrt-menu-item_ Component

```Html
     <c-sf-gps-ds-osrt-menu-item
     name="home"
     record={menuItem1}
     icon-position="right"
     icon-name="action:info"
     status="error"
     checked
     >
```

```Html
  <c-sf-gps-ds-osrt-menu theme="slds" icon-name="utility:down">
      <c-sf-gps-ds-osrt-menu-item
        record={data1}
        icon-name="action:info"
      ></c-sf-gps-ds-osrt-menu-item>
      <c-sf-gps-ds-osrt-menu-item
        record={data2}
        icon-position="right"
        icon-name="action:info"
      ></c-sf-gps-ds-osrt-menu-item>
  </c-sf-gps-ds-osrt-menu>
```
