# Property-Section Lightning Web Component

The _propertySection Lightning Web Component_ is a child component of property panle which is used to house the other LWC components(ex. list, form etc.) inside it. It can be made collapsible to allowing simpler interaction with the different components implemented inside the property panel component.

## Available _c-`property-section`_ Attributes

| Attribute     | Value                      | Type    | Required | Description                                                                              |
| ------------- | -------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| title         |                            | string  |          | Adds the header title to the Section component.                                          |
| isCollapsible | true,false (Default: true) | boolean |          | To determine whether the section is collapsible or not                                   |
| isExpanded    | true,false(Default: false) | boolean |          | To determine whether the section is collapsed or expanded when opened for the first time |

### Example _c-property-section_ Component

```html
<c-property-section
  title="collapsible section 2"
  is-collapsible="true"
  is-expanded="true"
  section-id="sectionId1"
>
  <div slot="title-actions">
    <button
      title="additem"
      class="slds-button slds-button_icon"
      onclick="{addItem}"
    ></button>
  </div>
  <div slot="content">
    <c-list
      theme="{theme}"
      field-name="Contact"
      is-search-available="true"
      records="{record}"
      height="300"
      enable-load-more="true"
    >
    </c-list>
  </div>
</c-property-section>
```
