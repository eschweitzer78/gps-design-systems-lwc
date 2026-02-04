# OmniScript Currency (omniscriptCurrency)

This component is used to render a Currency Element. `OmniscriptCurrency` is extended from `OmniscriptAtomicElement`. This component supports all salesforce supported currency formats.

### Properties

| Name                      | Scope   | Description                                         |
| ------------------------- | ------- | --------------------------------------------------- |
| \_imaskCurrencyAttributes | private | Hold an object from Helper method for mask handling |
| \_commitOnChange          | private | Checks whether value is committed or not            |

### Methods

| Signature           | Scope   | Return Value | Description                                     |
| ------------------- | ------- | ------------ | ----------------------------------------------- |
| initCompVariables() | private | void         | Overwrites inherited initCompVariables.         |
| handleBlur(evt)     | private | void         | Sets the element value and triggers aggregation |
| validateData(data)  | private | Object       | Evaluates if currency is valid.                 |
| render()            | private | template     | Overwrites native LWC render                    |

### Usage

```html
<c-omniscript-currency
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-currency>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

```json
Example ---

{
  "type": "Currency",
  "rootIndex": 0,
  "response": null,
  "propSetMap": {
    "label": "Currency1",
    "disOnTplt": false,
    "hide": false,
    "HTMLTemplateId": "",
    "debounceValue": 0,
    "accessibleInFutureSteps": false,
    "conditionType": "Hide if False",
    "show": null,
    "hideGroupSep": false,
    "allowNegative": false,
    "max": null,
    "min": null,
    "mask": null,
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
  "name": "Currency1",
  "level": 1,
  "JSONPath": "Step1:Currency1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bCurrency": true,
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
    "Currency1": "Step1:Currency1",
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
    "Currency1": ""
  }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + url parameters + cached API responses
