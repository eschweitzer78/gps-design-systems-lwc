# Tab Lightning Web Component

The _Tab Lightning Web Component_ keeps related content in a single container. The tab content displays when a user clicks the tab. This component is a base element of the `c-tabset` component.

## Available _c-tab_ Attributes

| Attribute           | Value                       | Type    | Required | Description                                                                                                                        |
| ------------------- | --------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| label               |                             | string  | yes      | Sets the visible text for the tab header.                                                                                          |
| title               |                             | string  |          | Specifies text that displays in a tooltip over the tab content.                                                                    |
| icon-name           | (Format: utility:down)      | string  |          | Sets icon for the tab. Must use utility icons only. See [Lightning Design System Icons](https://lightningdesignsystem.com/icons/). |
| icon-assistive-text |                             | string  |          | Sets the alternative text for the icon specified by _icon-name_.                                                                   |
| display-tab         | true, false (Default: true) | boolean |          | To hide the tab title, set to false.                                                                                               |
| tabId               | unique id                   |         |          | Sets unique id to the tab, if provided this will be returned with the tabchange event result.                                      |

### Example _c-tab_ Component

The c-tab is defined as an element inside c-tabset and has its own id so user can update and modify the content directly.

```Html
<c-tabset id="tabTest" class="via-slds" active-tab-value="1">
    <c-tab title="Item 1">
        <div slot="content">Item Content 1</div>
    </c-tab>
    <c-tab title="Item 2">
        <div slot="content">Item Content 2</div>
    </c-tab>
</c-tabs>
```
