# ListItems Lightning Web Component

The _ListItems Lightning Web Component_ creates the template for each list item inside the _List Lightning Web Component_.

## Available _c-list-items_ Attributes

| Attribute | Value                     | Type   | Required | Description                     |
| --------- | ------------------------- | ------ | -------- | ------------------------------- |
| theme     | slds, nds (Default: slds) | string |          | Specfies which theme to use.    |
| records   |                           | array  |          | Contains the data for the list. |

### Example _c-list-items_ Component

```Html
    <c-list records={data} issearchavailable="true" issortavilable="true">
        <c-list-items>
        </c-list-items>
    </c-list>

    <!-- required iteration template-->
    <template>
        <ul class="slds-has-dividers_around slds-has-block-links_space">
            <template for:each={data} for:item="item" for:index="index">
                <li key={item.id} class="slds-item">
                    <a href="javascript:void(0);">{item.name}</a>
                </li>
            </template>
        </ul>
    </template>
```
