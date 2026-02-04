# Omniscript Text Block (omniscriptTextBlock)

This component is used to render a Text Block element. Text Block supports Merge fields (e.g. %Text1%).
OmniscriptTextBlock is extended from omniscriptBaseElement.

### Properties

| Name         | Scope           | Description                                                                             |
| ------------ | --------------- | --------------------------------------------------------------------------------------- |
| mergeVal     | track (private) | Reactive private property. Realtime refresh of text displayed for a Text Block element. |
| \_themeClass | private         | Use to set the class name                                                               |
| \_tbText     | private         | Get the value from the omniscript                                                       |

### Methods

| Signature                                              | Scope        | Return Value | Description                                                                                 |
| ------------------------------------------------------ | ------------ | ------------ | ------------------------------------------------------------------------------------------- |
| initCompVariables()                                    | private      | void         | Overwrites inherited initCompVariables                                                      |
| stateRefresh()                                         | private      | void         | Overwrite, watch to refresh the text displayed for a Text Block element (with merge fields) |
| applyCallResp(json, bApi = false, bValidation = false) | api (public) | void         | Overwrite, Text Block elements do not accept API responses                                  |
| render()                                               | private      | template     | Overwrites the native LWC render                                                            |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-text-block
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
>
</c-omniscript-text-block>
```

### Attributes

**jsonDef** --- json definition of the OmniScript Element

```json
Example ---

{
  "type": "Text Block",
  "rootIndex": 0,
  "response": null,
  "propSetMap": {
    "disOnTplt": false,
    "label": "TextBlock1",
    "textKey": "",
    "HTMLTemplateId": "",
    "dataJSON": false,
    "show": null,
    "text": "",
    "controlWidth": 12
  },
  "name": "TextBlock1",
  "level": 1,
  "JSONPath": "Step1:TextBlock1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bTextBlock": true,
  "lwcId": "lwc000",
}
```

**jsonData** --- the data JSON of the OmniScript

**dataOmniKey** --- element unique identifier = name value in element's JSON definition

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
  "labelMap": {
    "TextBlock1": "Step1:TextBlock1",
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
    "TextBlock1": ""
  }
}
```

**layout** --- `newport` or `lightning`

**resume** --- true or false
