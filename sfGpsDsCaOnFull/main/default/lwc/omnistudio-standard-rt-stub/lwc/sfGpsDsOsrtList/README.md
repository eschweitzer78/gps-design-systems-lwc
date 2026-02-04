# List Lightning Web Component

The _List Lightning Web Component_ creates a searchable and sortable list from provided data.

## Available _c-list_ Attributes

| Attribute                 | Value                                                             | Type    | Required | Description                                                                                                |
| ------------------------- | ----------------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| name                      |                                                                   | string  |          | Specifies the name of the element. Used by the _Form Lightning Web Component_.                             |
| theme                     | slds, nds (Default: slds)                                         | string  |          | Specfies which theme to use.                                                                               |
| issearchavailable         | true, false (Default: false)                                      | boolean |          | To display the search input field and filter dropdown list, set to true.                                   |
| issortavailable           | true, false (Default: false)                                      | boolean |          | To enable sorting by ascending and descending order, set to true.                                          |
| records                   |                                                                   | array   | yes      | Contains the data for the list.                                                                            |
| sortattribute             | (Default: name)                                                   | string  |          | Specifies which field to sort.                                                                             |
| searchattribute           | (Default: name)                                                   | string  |          | Specifies comma separated field names used to search.                                                      |
| enable-load-more          | true, false (Default: false)                                      | boolean |          | To enable a button to load more list items.                                                                |
| load-more-btn-label       | (Default: "Load More Items")                                      | string  |          | Specifies the label of the load more button.                                                               |
| load-more-number-of-items | (Default: Default value depends upon the parent container height) | string  |          | Limits the content to load when load more button is clicked.                                               |
| channel                   |                                                                   | string  |          | If set, the list component acts as observer and listens to the channel for data from the _Datasource LWC_. |

| field-name | (Default: Name) | string | | Specifies which key from the records to display.|

| mix-height | CSS (_height_ takes priority if set) | string | | Specifies which key from the records to display.|

### Example _c-list_ Component with Defined _c-list-item_

To create your own template for the list items, add a `c-list-items` component inside the `c-list` component and write an iteration template.

```Html
    <c-list records={data} issearchavailable="true" issortavilable="true">
        <c-list-items>
        </c-list-items>
    </c-list>

    <!-- iteration template required -->
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

### Example _c-list_ Component

If a `c-list-items` component is not specified, the default layout for the list items is used. Only the _item.name_ is visible as the label for each list item. However, the user can still change the sort field and search field.

```Html
    <c-list records={data}>
    </c-list>
```

### Available Methods

**sortListBy(reverse, field)**

Sorts the list by field. The second parameter is optional. If no field is provided then it takes _name_.

**searchListBy(searchKey, fields)**

Filters the list. The second parameter is optional. If no fields are provided, then it takes only _name_. Fields can also be a comma separated attribute string.
