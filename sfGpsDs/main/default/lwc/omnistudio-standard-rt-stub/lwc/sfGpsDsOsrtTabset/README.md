# Tabset Lightning Web Component

The _Tabset Lightning Web Component_ displays a tabbed container with multiple content areas, only one of which is visible at a time. A tabset can hold multiple `c-tab` components. The first tab is activated by default.

## Available _c-tabset_ Attributes

| Attribute        | Value                                                  | Type    | Required | Description                                                                                                                      |     |
| ---------------- | ------------------------------------------------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- | --- |
| active-tab-value | tab index                                              | string  |          | Specifies which tab is active by default. use the position (index) of a `c-tab` component. By default, the first tab is active.  |
| variant          | standard, scoped, vertical, default (Default: default) |         |          | Sets the appearance of the tabset.                                                                                               |
| theme            | slds, nds (Default: slds)                              |         |          | Sets the theme for the tabset component.                                                                                         |
| hideTabNav       | true/false                                             | boolean |          | To hide the tab navigation bar, set to true.                                                                                     |
| headerclass      |                                                        | string  |          | Adds a class to the tab label element. To add multiple classes, use a space to separate each class, such as 'classone classtwo'. |

## Available Event Listeners

**ontabchange**

Triggers when the tab is changed, it returns the tabIndex and tab-id, if tab-id is passed on `c-tab`, if tab-id is not specified only tabIndex will be returned as result.

### Example _c-styles_ Component

```Html

<!-- When using the index positon as the active-tab-value -->
<c-tabset id="tabTest" class="via-slds" active-tab-value="1">
    <c-tab title="Item 1">
        <slot name="content">Item Content 1</slot>
    </c-tab>
    <c-tab title="Item 2">
        <slot name="content">Item Content 2</slot>
    </c-tab>
</c-tabset>

<!-- When using the id as the active-tab-value -->
<c-tabset id="tabTest" class="via-slds" active-tab-value="tabOne" headerclass="slds-text-title_caps">
    <c-tab id="tabOne" title="Item 1">
        <slot name="content">Item Content 1</slot>
    </c-tab>
    <c-tab id="tabTwo" title="Item 2">
        <slot name="content">Item Content 2</slot>
    </c-tab>
</c-tabset>
```
