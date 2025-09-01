# OmniScript Email (omniscriptEmail)

This component is used to render a Email element, This is extends from `OmniscriptAtomicElement`.

### Properties

| Name                         | Scope   | Description                              |
| ---------------------------- | ------- | ---------------------------------------- |
| \_emailPattern               | private | regex pattern for email                  |
| \_messageWhenPatternMismatch | private | Custom pattern missmatch error text      |
| \_commitOnChange             | private | Checks whether value is committed or not |

### Methods

| Signature           | Scope   | Return Value | Description                                     |
| ------------------- | ------- | ------------ | ----------------------------------------------- |
| initCompVariables() | private | void         | Overwrite                                       |
| handleBlur(evt)     | private | void         | Sets the element value and triggers aggregation |
| render()            | private | template     | Overwrites native LWC render                    |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-email
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-email>
```

### Attributes

**jsonDef** --- json definition of the OmniScript Element

```json
Example ---

{
    "type": "Email",
    "rootIndex": 0,
    "response": null,
    "propSetMap": {
        "label": "Email1",
        "disOnTplt": false,
        "hide": false,
        "HTMLTemplateId": "",
        "debounceValue": 0,
        "accessibleInFutureSteps": false,
        "conditionType": "Hide if False",
        "show": null,
        "ptrnErrText": "",
        "pattern": "",
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
    "name": "Email1",
    "level": 1,
    "JSONPath": "Step1:Email1",
    "indexInParent": 0,
    "index": 0,
    "children": [],
    "bHasAttachment": false,
    "bEmail": true,
    "lwcId": "lwc000"
}
```

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
    "labelMap": {
        "Email1": "Step1:Email1",
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
    "hasInvalidElements": false,
    "acUiElements": {
        "Step1": "",
        "Email1": ""
    }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + email parameters + cached API responses
