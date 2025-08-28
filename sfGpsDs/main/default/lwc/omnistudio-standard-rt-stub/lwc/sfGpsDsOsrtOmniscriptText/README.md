# Omniscript Text (omniscriptText)

This component is used to render a Text Element, OmniscriptText is extended from `OmniscriptAtomicElement`.

Text element support masking, Supported masking formats are "(999) 999-9999" and "(AAA) AAA-AAAA". "9" stands Number and "A" stands for Character.

Text element also support regex pattern.

### Properties

| Name             | Scope   | Description                             |
| ---------------- | ------- | --------------------------------------- |
| \_placeholder    | private | Use to show placeholder in Text element |
| \_inputType      | private | Use to set type of the input            |
| \_commitOnChange | private |                                         |

### Methods

| Signature                | Scope   | Return Value | Description                                                                                         |
| ------------------------ | ------- | ------------ | --------------------------------------------------------------------------------------------------- |
| initCompVariables()      | private | void         | Overwrites inherited initCompVariables                                                              |
| getImaskTextAttributes() | private | Object       | This function will determine if we need to set masking on element that comes from Omniscript script |
| handleBlur(evt)          | private | void         | Sets the element value and triggers aggregation                                                     |
| render()                 | private | template     | Overwrites the native LWC render                                                                    |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-text
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-text>
```

### Attributes

**jsonDef** -- json definition of the OmniScript Element

```json
Example ---

{
  "type": "Text",
  "rootIndex": 0,
  "response": "Hello There!",
  "propSetMap": {
    "label": "Text1",
    "disOnTplt": false,
    "hide": false,
    "HTMLTemplateId": "",
    "debounceValue": 0,
    "accessibleInFutureSteps": false,
    "conditionType": "Hide if False",
    "show": null,
    "maxLength": 255,
    "minLength": 0,
    "ptrnErrText": "",
    "pattern": "",
    "mask": "",
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
  "name": "Text1",
  "level": 1,
  "JSONPath": "Step1:Text1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bText": true,
  "lwcId": "lwc000",
  "bInit": true
}
```

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
  "labelMap": { "Text1": "Step1:Text1", "Step1": "Step1" },
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
  "acUiElements": { "Step1": "", "Text1": "" }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + text parameters + cached API responses
