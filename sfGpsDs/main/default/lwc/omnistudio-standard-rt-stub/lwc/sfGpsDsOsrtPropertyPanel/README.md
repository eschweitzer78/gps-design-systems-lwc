# Property Panel Lightning Web Component

The _Property Panel Lightning Web Component_ displays content in the panel aligned to the right end of the screen. Common use cases for Property Panel include: housing different web components depending upon the user requirements, creation or editing of a record.
|

### Example _c-property-panel_ Component

```html
    <c-property-panel
        class="propertyPanelComp"
        width="30%"
    >
        <div slot="header">
            <span>PROPERTY PANEL</span>
        </div>
        <div slot="content">
            <div>
                <c-section
                title="collapsible section"
                is-collapsible="true"
                is-expanded="false"
                plus-button-enabled="true"
                section-id="sectionId2"
                >
                </c-section>
            </div>
        </div>

        <div class="slds-border_top" slot="footer">
            <c-sf-gps-ds-osrt-button variant="brand" label="Done"></c-sf-gps-ds-osrt-button>
            <c-sf-gps-ds-osrt-button
                variant="neutral"
                extraclass="slds-m-left_x-small"
                onclick={closePropertyPanel}
                label="Cancel"
            ></c-sf-gps-ds-osrt-button>
        </div>
    </c-property-panel
    <button onclick={openPropertyPanel} class="test">Open Property Panel</button>
```

### Available Methods

**openPropertyPanel()**

If hidden, shows the Property Panel.

**closePropertyPanel()**

If visible, hides the Property Panel.
