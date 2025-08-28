# OmniScript Date/Time (omniscriptDateTime)

This component is used to render a Date/Time element. It extends from `OmniscriptAtomicElement`.

When the Time input is blank and a user enters a Date input, the default time populated in the Time input will be 12:00 PM.

Once a Time input is entered, the previously stored Time input value will persist even when the Date input is modified.

Selecting the Today button will populate the current date and time.

### Methods

| Signature                  | Scope   | Return Value | Description                                                                                                         |
| -------------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| handleBlur()               | private | void         | Overwrites inherited handleBlur blur handler from OmniscriptAtomicElement.                                          |
| handleChange()             | private | void         | Handles changes made within the Date/Time component.                                                                |
| validateData(data)         | private | Object       | Evaluates if date/time data is valid.                                                                               |
| initCompVariables()        | private | void         | Overwrites inherited initCompVariables. This method is executed once during connectedCallback.                      |
| setElementFormattedValue() | private | void         | Overwrites inherited setElementFormattedValue. This method is executed during renderedCallback and setElementValue. |
| render()                   | private | template     | Overwrites native LWC render                                                                                        |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-date-time
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-date-time>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

```json
Example ---

{
    "type": "Date/Time (Local)",
    "rootIndex": 0,
    "response": null,
    "propSetMap": {
        "label": "Date/Time1",
        "maxDate": "",
        "minDate": "",
        "timezone": "Local",
        "disOnTplt": false,
        "hide": false,
        "HTMLTemplateId": "",
        "accessibleInFutureSteps": false,
        "conditionType": "Hide if False",
        "show": null,
        "timeFormat": "hh:mm a",
        "dateFormat": "MM-dd-yyyy",
        "helpText": "",
        "help": false,
        "defaultValue": null,
        "readOnly": false,
        "repeatLimit": null,
        "repeatClone": false,
        "repeat": false,
        "required": false,
        "inputWidth": 12,
        "showInputWidth": false,
        "controlWidth": 12
    },
    "name": "Date/Time1",
    "level": 1,
    "JSONPath": "Step1:Date/Time1",
    "indexInParent": 0,
    "index": 0,
    "children": [],
    "bHasAttachment": false,
    "bDateTime": true,
    "lwcId": "lwc000"
}
```

**dataOmniKey** --- element unique identifier = name value in element's JSON definition

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
  "labelMap": {
    "Date/Time1": "Step1:Date/Time1",
    "Step1": "Step1"
  },
  "propSetMap": {
    "stepChartPlacement": "right",
    "disableUnloadWarn": true,
    "errorMessage": {
      "custom": []
    },
    "consoleTabIcon": "custom:custom18",
    "consoleTabTitle": null,
    "rtpSeed": false,
    "showInputWidth": false,
    "currencyCode": "",
    "autoFocus": false,
    "pubsub": false,
    "message": {},
    "ssm": false,
    "wpm": false,
    "consoleTabLabel": "New",
    "cancelRedirectTemplateUrl": "vlcCancelled.html",
    "cancelRedirectPageName": "OmniScriptCancelled",
    "cancelSource": "%ContextId%",
    "allowCancel": true,
    "cancelType": "SObject",
    "visualforcePagesAvailableInPreview": {},
    "hideStepChart": false,
    "timeTracking": false,
    "knowledgeArticleTypeQueryFieldsMap": {},
    "lkObjName": null,
    "bLK": false,
    "enableKnowledge": false,
    "trackingCustomData": {},
    "seedDataJSON": {},
    "elementTypeToHTMLTemplateMapping": {},
    "autoSaveOnStepNext": false,
    "saveURLPatterns": {},
    "saveObjectId": "%ContextId%",
    "saveContentEncoded": false,
    "saveForLaterRedirectTemplateUrl": "vlcSaveForLaterAcknowledge.html",
    "saveForLaterRedirectPageName": "sflRedirect",
    "saveExpireInDays": null,
    "saveNameTemplate": null,
    "allowSaveForLater": true,
    "persistentComponent": [{
      "modalConfigurationSetting": {
        "modalSize": "lg",
        "modalController": "ModalProductCtrl",
        "modalHTMLTemplateId": "vlcProductConfig.html"
      },
      "itemsKey": "cartItems",
      "id": "vlcCart",
      "responseJSONNode": "",
      "responseJSONPath": "",
      "sendJSONNode": "",
      "sendJSONPath": "",
      "postTransformBundle": "",
      "preTransformBundle": "",
      "remoteOptions": {
        "postTransformBundle": "",
        "preTransformBundle": ""
      },
      "remoteTimeout": 30000,
      "remoteMethod": "",
      "remoteClass": "",
      "label": "",
      "render": false
    }, {
      "modalConfigurationSetting": {
        "modalSize": "lg",
        "modalController": "",
        "modalHTMLTemplateId": ""
      },
      "itemsKey": "knowledgeItems",
      "id": "vlcKnowledge",
      "postTransformBundle": "",
      "preTransformBundle": "",
      "remoteOptions": {
        "postTransformBundle": "",
        "preTransformBundle": ""
      },
      "remoteTimeout": 30000,
      "remoteMethod": "",
      "remoteClass": "",
      "label": "",
      "render": false
    }]
  },
  "hasInvalidElements": true,
  "acUiElements": {
    "Step1": "",
    "Date/Time1": ""
  }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + url parameters + cached API responses
