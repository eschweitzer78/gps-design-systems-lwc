# Navigate Action Lightning Web Component

The _NavigateAction Lightning Web Component_ enables navigation to any of Salesforce's [PageReference](https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.reference_page_reference_type) types, by leveraging Salesforce's [navigation service](https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.use_navigate).

## Available _c-sf-gps-ds-osrt-navigate-action_ Attributes

| Attribute          | Value                                                                                                                                                    | Type    | Required | Description                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| targetType         | App, Component, Knowledge Article, Login, Object, Record, Record Relationship, Named Page, Community Named Page, Navigation Item, Web Page, Current Page | string  | yes      | Specifies the name of the target PageReference type. Pass `undefined` for the current PageReference.                                               |
| targetId           |                                                                                                                                                          | string  |          | Specifies the 18 character record ID.                                                                                                              |
| targetName         |                                                                                                                                                          | string  |          | Specifies the API name of the component, object, tab, app or record.                                                                               |
| targetParams       |                                                                                                                                                          | string  |          | Adds state params sent to the target page reference.                                                                                               |
| targetAction       |                                                                                                                                                          | string  |          | Specifies action passed to object, login and record `targetType`.                                                                                  |
| targetArticleType  |                                                                                                                                                          | string  |          | If the targetType is knowledgeArticle, specifies the articleType API name of the Knowledge Article record. In Communities, articleType is ignored. |
| targetRelationship |                                                                                                                                                          | string  |          | Specifies the API name of the object’s relationship field.                                                                                         |
| replace            | true or false (Default: false)                                                                                                                           | boolean |          | To call the navigate() function to replace the current entry in window.history, set to true.                                                       |
| useHref            | true or false (Default: false)                                                                                                                           | boolean |          | To wrap with an anchor tag, set to true.                                                                                                           |
| openTargetIn       | newTab, currentTab                                                                                                                                       | string  |          | Specifies whether to open the target in a new tab or the current tab.                                                                              |
| url                |                                                                                                                                                          | string  |          | Read-only property that displays the value of the generated url when `useHref` is set to true.                                                     |
| pageReference      |                                                                                                                                                          | string  |          | Read-only property that gets the generated page reference object for the given properties.                                                         |

### Example _c-sf-gps-ds-osrt-navigate-action_ Component

The `navigate-action` component renders a single template, and is designed to attach functionality onto the slotted markup.

```html
<c-sf-gps-ds-osrt-navigate-action
  target-type="{string}"
  target-name="{string}"
  target-id="{string}"
  target-params="{string}"
  target-action="{string}"
  replace
  use-href
>
  <!-- content -->
</c-sf-gps-ds-osrt-navigate-action>
```

#### Configure _c-sf-gps-ds-osrt-navigate-action_ to Navigate to a Salesforce Tab

Navigate to any app tab or Lightning page by setting _target-type_ to 'navigation item', and target-name (found in the url when viewing the app tab or page, such as _/n/namespace\_\_Target_Name_).

**Note** `namespace` must be replaced with actual the namespace in your org.

```html
<c-navigation-action target-type="Navigation Item"
    target-name="namespace__LWC_Designer">
    <!-- pass in desired content -->
</c-sf-gps-ds-osrt-navigate-action>
```

#### Configure _c-sf-gps-ds-osrt-navigate-action_ to Navigate to a Component

Navigate to an aura component by specifying the _target-type="Component"_ and _target-name_ attributes where the aura components name is the value of _target-name_.

Currently Lightning web components must be wrapped in an aura component that implements the lightning:isUrlAddressable interface.

```html
<c-sf-gps-ds-osrt-navigate-action
  target-type="Component"
  target-name="c__example_aura_wrapper"
>
  <!-- pass in desired content -->
</c-sf-gps-ds-osrt-navigate-action>
```

#### Configuring _c-sf-gps-ds-osrt-navigate-action_ to navigate to update the current page reference

To update the `CurrentPageReference.state`, use a navigation action that excludes the _target-type_ attribute. Values passed in _target-params_ are added to the current state.

```html
<c-sf-gps-ds-osrt-navigate-action
  target-params="c__paramone=value one&c__layout=newport"
>
  <!-- pass in desired content -->
</c-sf-gps-ds-osrt-navigate-action>
```

To remove parameters from the `CurrentPageReference.state`, set the param to an empty value. In the following example, executing the navigation removes the view parameter from the PageReference.state.

```html
<c-sf-gps-ds-osrt-navigate-action target-params="c__paramone=">
  <!-- pass in desired content -->
</c-sf-gps-ds-osrt-navigate-action>
```

#### Configuring _c-sf-gps-ds-osrt-navigate-action_ to Navigate to a Record

Navigate to an action by setting _target-type_ to 'record', a _target-id_, and a _target-action_ (clone, edit, or view). By default the _target-action_ value is 'view'.

```html
<c-sf-gps-ds-osrt-navigate-action
  target-type="Record"
  target-name="Account"
  target-id="001B000000vYIINIA4"
>
  <!-- pass in desired content -->
</c-sf-gps-ds-osrt-navigate-action>
```

#### Open the Default Salesforce Edit Dialogue

```html
<c-sf-gps-ds-osrt-navigate-action
  target-type="Record"
  target-name="Account"
  target-action="edit"
  target-id="001B000000vYIINIA4"
>
  <!-- pass in desired content -->
</c-sf-gps-ds-osrt-navigate-action>
```

### Available Methods

**NavigationAction.navigate()**

Performs navigation to the PageReference that is constructed via the passed attributes. Calls `NavigationMixin.Navigate()`. The generated pageReference is returned.

**NavigateAction.generateUrl()**

Returns a promise that resolves the value of the configured PageReference URL and updates the tracked property `url`. This method is called on `connectedCallback`. Note, if `useHref` is set to true and properties are updated after component initialization, **generateUrl** must be called manually.
