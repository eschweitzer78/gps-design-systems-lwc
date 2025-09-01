# OmniScript RadioGroup (omniscriptRadioGroup)

This component is used to render a RadioGroup element, it extends from `OmniscriptAtomicElement`.

### Properties

| Name             | Scope           | Description                                 |
| ---------------- | --------------- | ------------------------------------------- |
| \_selectedValues | track (private) | Internal object for radioGroup-option pairs |
| hasError         | track (private) | Controls displaying error message           |

### Methods

| Signature                                | Scope        | Return Value | Description                                                                                             |
| ---------------------------------------- | ------------ | ------------ | ------------------------------------------------------------------------------------------------------- |
| setAll(evt)                              | private      | void         | Selects all radio inputs in corresponding column                                                        |
| setWidths()                              | private      | void         | Applies styling to the width of options after first render                                              |
| selectRadio(labelIndex, optionIndex)     | private      | Boolean      | Updates internal state with specified option for a specific radioGroup value                            |
| jsonDef(json)                            | private      | void         | Override BaseElement's set jsonDef, also calls generateUniqueIds                                        |
| jsonDef()                                | private      | void         | Override BaseElement's get jsonDef, LWC requirement                                                     |
| handleChange(evt)                        | private      | void         | Updates json data when radio gets selected or set all is clicked                                        |
| setElementValue(json, bApi, bValidation) | private      | void         | Overriding Base Element's setElementValue                                                               |
| prefill(json)                            | private      | void         | Prefill RadioGroup                                                                                      |
| removeInvalid(json)                      | private      | Object       | Removes invalid options from prefill or input sources                                                   |
| validateRadioGroup(showError)            | private      | Boolean      | Validates radiogroup and controls the flag to display errors                                            |
| validateData(data)                       | private      | Object       | Checks if prefill data is valid                                                                         |
| checkValidity()                          | api (public) | Boolean      | Checks validity of the radiogroup                                                                       |
| reportValidity()                         | api (public) | Boolean      | Checks validity of the radiogroup, if there are errors, allow errors to be displayed                    |
| setChildInputValue(input)                | private      | void         | Override hasValidation's setChildInputValue to directly set displayValue to properly trigger validation |
| initCompVariables()                      | private      | void         | Overrides hasValidation's initCompVariables                                                             |
| generateUniqueIds(labels)                | private      | void         | Add unique ids to the rlabels for the input radio buttons.                                              |
| connectedCallback()                      | private      | void         | Overwrites native LWC lifecycle method.                                                                 |
| renderedCallback()                       | private      | void         | Overwrites native LWC lifecycle method.                                                                 |
| render()                                 | private      | template     | Overwrites native LWC lifecycle method.                                                                 |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-radio-group
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-radio-group>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

```json
Example ---
{
  "type": "Radio Group",
  "rootIndex": 0,
  "response": null,
  "propSetMap": {
    "label": "RadioGroup1",
    "disOnTplt": false,
    "hide": false,
    "HTMLTemplateId": "",
    "accessibleInFutureSteps": false,
    "conditionType": "Hide if False",
    "show": null,
    "controllingField": {
      "source": "",
      "type": "",
      "element": ""
    },
    "optionSource": {
      "source": "",
      "type": ""
    },
    "options": [
      {
        "setAll": true,
        "value": "rlabl1",
        "name": "rval1"
      },
      {
        "value": "rlabl2",
        "name": "rval2"
      },
      {
        "setAll": true,
        "value": "rlabl3",
        "name": "rval3"
      }
    ],
    "radioLabels": [
      {
        "value": "rdisplaylabel1",
        "name": "rdisplay1",
        "id": "RadioGroup1-0"
      },
      {
        "value": "rdisplaylabel2",
        "name": "rdisplay2",
        "id": "RadioGroup1-1"
      }
    ],
    "radioLabelsWidth": 6,
    "helpText": "",
    "help": false,
    "readOnly": false,
    "required": true,
    "controlWidth": 12
  },
  "name": "RadioGroup1",
  "level": 1,
  "JSONPath": "Step2:RadioGroup1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bRadioGroup": true,
  "lwcId": "lwc000"
}
```

**dataOmniKey** --- element unique identifier = name value in element's JSON definition

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + url parameters + cached API responses
