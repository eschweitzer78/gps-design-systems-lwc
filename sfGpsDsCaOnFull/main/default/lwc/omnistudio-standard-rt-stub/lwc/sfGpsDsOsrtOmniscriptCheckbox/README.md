# OmniScript Checkbox (omniscriptCheckbox)

This component is used to render a checkbox element, This is extends from `OmniscriptAtomicElement`.

### Properties

| Name                 | Scope   | Description                           |
| -------------------- | ------- | ------------------------------------- |
| \_needMoreValidation | private | Bypass second validation for checkbox |

### Methods

| Signature           | Scope   | Return Value | Description                             |
| ------------------- | ------- | ------------ | --------------------------------------- |
| handleChange(evt)   | private | void         | Change handle                           |
| connectedCallback() | private | void         | Overwrites native LWC connectedCallback |
| validateData(data)  | private | Object       | validate checkbox value                 |
| render()            | private | template     | Overwrites native LWC render            |
| initCompVariables() | private | Void         | Overwrites inherited initCompVariables  |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-checkbox
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-checkbox>
```

### Attributes

**jsonDef** -- json definition of the OmniScript Element

```json
Example ---
{
  "type": "Checkbox",
  "rootIndex": 0,
  "response": false,
  "propSetMap": {
    "label": "Checkbox1",
    "disOnTplt": false,
    "hide": false,
    "HTMLTemplateId": "",
    "accessibleInFutureSteps": false,
    "conditionType": "Hide if False",
    "show": null,
    "checkLabel": "Checkbox1",
    "helpText": "",
    "help": false,
    "defaultValue": false,
    "readOnly": false,
    "repeatLimit": null,
    "repeatClone": false,
    "repeat": false,
    "controlWidth": 12
  },
  "name": "Checkbox1",
  "level": 1,
  "JSONPath": "Step1:Checkbox1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bCheckbox": true,
  "lwcId": "lwc000",
  "bInit": true
}
```

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---
{
  "labelMap": { "Checkbox1": "Step1:Checkbox1", "Step1": "Step1" },
  "propSetMap": {
    "stepChartPlacement": "right",
    "disableUnloadWarn": true,
    "errorMessage": { "custom": [] },
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
    "persistentComponent": [
      {
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
      },
      {
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
      }
    ]
  },
  "hasInvalidElements": false,
  "acUiElements": { "Step1": "", "Checkbox1": "" }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + checkbox parameters + cached API responses
