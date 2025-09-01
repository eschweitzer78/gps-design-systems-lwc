# OmniScript Select (omniscriptSelect)

This component is used to render a Select element, This is extends from mixins class `OmniscriptOptionsMixin`, `OmniscriptAtomicElement`.

`OmniscriptOptionsMixin` mixin class is used for validating prefill data for select.

### Properties

| Name             | Scope   | Description                  |
| ---------------- | ------- | ---------------------------- |
| \_initialOptions | private | overwritten private variable |

###

### Methods

| Signature         | Scope   | Return Value | Description                                                                |
| ----------------- | ------- | ------------ | -------------------------------------------------------------------------- |
| handleChange(evt) | private | void         | OnChange Event Handler. Applies the changed value directly to the response |
| render()          | private | template     | Overwrites native LWC render                                               |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-select
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-select>
```

### Attributes

**jsonDef** -- json definition of the OmniScript Element

```json
Example ---

{
  "type": "Select",
  "rootIndex": 0,
  "response": "Omniscript",
  "propSetMap": {
    "label": "Select1",
    "disOnTplt": false,
    "hide": false,
    "HTMLTemplateId": "",
    "accessibleInFutureSteps": false,
    "conditionType": "Hide if False",
    "show": null,
    "controllingField": { "source": "", "type": "", "element": "" },
    "optionSource": { "source": "", "type": "" },
    "options": [
      { "value": "Omniscript Team", "name": "Omniscript" },
      { "value": "Cards Team", "name": "Cards" },
      { "value": "Cpq Team", "name": "Cpq" }
    ],
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
  "name": "Select1",
  "level": 1,
  "JSONPath": "Step1:Select1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bSelect": true,
  "lwcId": "lwc000"
}

```

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
  "labelMap": { "Select1": "Step1:Select1", "Step1": "Step1" },
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
  "acUiElements": { "Step1": "", "Select1": "" }
}
```

**layout** --- `newport` or `lightning`

**resume**--- `true` or `false`

**seedJson** --- designer seed JSON + select parameters + cached API responses
