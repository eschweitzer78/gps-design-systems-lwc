# OmniScript Navigate Action (omniscriptNavigateAction)

The OmniScript Navigate Action exposes the functionality found in via_component's `navigate-action` and can be used to navigate to various Salesforce experiences including: components, knowledge articles, records, record-relationships, objects, named pages, navigation items (tabs, flexipages) as well as opening links external to Salesforce. OmniScript Navigate Action extends `OmniscriptBaseAction`

[User Guide](https://vlocity.atlassian.net/wiki/spaces/OMNI/pages/558759952/OmniScript+Navigate+Action)

### Properties

| Name             | Scope       | Description                                                                                                                                                                                                                                                               |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| targetType       | private get | The PageReference type to be navigated to. One of One of 'App', 'Current Page', 'Component', 'Knowledge Article', 'Login', 'Object', 'Record', 'Record Relationship', 'Named Page', 'Community Named Page' , 'Navigation Item', or 'Web Page'. **Supports merge fields.** |
| targetId         | private get | The 16 character salesforce record id. Used by Record, and Record Relationship type PageReferences. **Supports merge fields.**                                                                                                                                            |
| targetName       | private get | The name of the 'App', 'Component', 'Object', 'Record', 'Page' or 'Tab'. In the case of a 'Web Page' type PageReference, this would be the URL. **Supports merge fields.**                                                                                                |
| targetParams     | private get | Additional parameters to be sent to the view in the format of URL search params: 'ns**key=value&ns**key2=value'. 💡Note: as of Summer '19, all parameter names must have a namespace prefix. **Supports merge fields.**                                                   |
| \_isLink         | private     | Boolean that determines weather or not the component will render as an `<a></a>` tag.                                                                                                                                                                                     |
| \_navigateAction | private     | A cached reference to the embedded `c-sf-gps-ds-osrt-navigate-action` component.                                                                                                                                                                                          |
| \_nsPrefix       | private     | A stored reference to the return value of `omniscriptInternalUtils.getNameSpacePrefix`.                                                                                                                                                                                   |
| \_targetAction   | private     | Action property to be set on the embedded `c-sf-gps-ds-osrt-navigate-action`. Used by Object and Record PageReference types.                                                                                                                                              |

### Methods

The following are a list of methods that are declared inside of the Omniscript Navigate Action. Navigate Action is inherited from Omniscript Base Action for additional support regarding action invocation and processing. Reference the Omniscript Base Action README for additional information regarding the inherited class.

| Signature           | Scope   | Return Value | Description                                                                                                                                       |
| ------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| execute()           | public  | Promise      | Called by the omniscript header when the navigate action is placed outside of a step. Otherwise the click event is handled by the base component. |
| handleResponse()    | public  | Object       | A no-op override, to prevent errors when called by the omniScript header.                                                                         |
| getTargetAction()   | private | String       | Gets the corresponding value for the class property `_targetAction` from `propSetMap`.                                                            |
| initCompVariables() | private | void         | Overrides inherited initCompVariables. Sets the static class properties `_isLink` and `_targetAction`.                                            |
| renderedCallback()  | private | void         | Overwrites native LWC renderedCallback lifecycle method. Queries for the `navigate-action` element and stores a reference in `_navigateAction`.   |
| render()            | private | template     | Overwrites native LWC render lifecycle method.                                                                                                    |

### Markup

The OmniScript Navigate Action contains a single template that supports both lightning and newport players.

### Usage

```HTML
    <c-omniscript-navigate-action json-def={jsonDef}
                                  data-omni-key={jsonDef.name}
                                  json-data={jsonData}
                                  layout={layout}
                                  resume={resume}
                                  script-header-def={scriptHeaderDef}>
    </c-omniscript-navigate-action>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

**dataOmniKey** --- element unique identifier = name value in element's JSON definition

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`
