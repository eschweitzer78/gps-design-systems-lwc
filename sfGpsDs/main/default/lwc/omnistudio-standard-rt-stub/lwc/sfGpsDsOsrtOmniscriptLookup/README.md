# OmniScript Lookup (omniscriptLookup)

This component is used to render a Lookup element, it extends from `OmniscriptAtomicElement`.

### Properties

| Name          | Scope           | Description                           |
| ------------- | --------------- | ------------------------------------- |
| options       | track (private) | Internal list of options to display   |
| lookupDisplay | track (private) | Currently selected and displayed text |
| hasError      | track (private) | Controls displaying error message     |
| isPageLoading | track (private) | Controls displaying the spinner       |

### Methods

| Signature                                | Scope          | Return Value | Description                                                                                                 |
| ---------------------------------------- | -------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| showLookup()                             | private        | void         | Shows dropdown list                                                                                         |
| getOptions()                             | private        | void         | Remote call to retrieve the list of options to display                                                      |
| setSelected(selectedIndex)               | private        | Promise      | Sets internal value and display text, then updates data json                                                |
| showOptions()                            | private        | void         | Add css class to unhide the list of options                                                                 |
| hideOptions()                            | private        | void         | Remove css class to hide the list of options                                                                |
| saveOptions(options)                     | private        | void         | Store options in OmniScript Header for persistent storage                                                   |
| getRecordTypeId(recordType)              | private        | Object       | Returns the Id of a specified record type                                                                   |
| selectOption(event)                      | private        | void         | Calls setSelected and then hides list of options                                                            |
| mouseOverFocus(event)                    | private        | void         | Adds focus and highlights the moused-over option                                                            |
| ariaFocus(newIndex)                      | private        | void         | Adds focus to new option when mouse-over or keyboard usage                                                  |
| handleKeyUp(evt)                         | private        | void         | Detects keyboard events that will interact with lookup and its dropdown                                     |
| handleKeyDown(evt)                       | private        | void         | Detects keyboard events that will interact with lookup and its dropdown                                     |
| setElementValue(json, bApi, bValidation) | private        | void         | Overriding Base Element's setElementValue                                                                   |
| generateUniqueKeys()                     | private        | void         | Generates unique keys for each option for LWC for:each                                                      |
| ndsUpdateLabel()                         | private        | void         | In newport, adds a css class to input element when there is an input to shrink the label to prevent overlap |
| prefill(lookupValue)                     | private        | void         | Prefills lookup                                                                                             |
| validateLookup(showError)                | private        | Boolean      | Validates lookup and controls the flag to display errors                                                    |
| checkValidity()                          | public (api)   | Boolean      | Checks validity of the lookup                                                                               |
| reportValidity()                         | public (api)   | Boolean      | Checks validity of the lookup, if there are errors, allow errors to be displayed                            |
| setChildInputValue(input)                | private        | void         | Override hasValidation's setChildInputValue to directly set displayValue to properly trigger validation     |
| validateData(data)                       | private        | Object       | Checks if prefill data is valid                                                                             |
| initCompVariables()                      | private        | void         | Overrides hasValidation's initCompVariables                                                                 |
| updateOptions({error, ...data})          | private (wire) | void         | Callback function for an executed wire call which populates the list of options with picklist values.       |
| connectedCallback()                      | private        | void         | Overwrites native LWC lifecycle method.                                                                     |
| render()                                 | private        | template     | Overwrites native LWC lifecycle method.                                                                     |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-lookup
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-lookup>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

**dataOmniKey** --- element unique identifier = name value in element's JSON definition

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + url parameters + cached API responses
