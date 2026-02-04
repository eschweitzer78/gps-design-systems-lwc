# Omniscript Line Break Component (omniscriptLineBreak)

This component is used to render a Line Break,
OmniscriptLineBreak is extended from OmniscriptAtomicElement hence contain all method from OmniscriptAtomicElement

### Properties

| Name                  | Scope   | Description                                                         |
| --------------------- | ------- | ------------------------------------------------------------------- |
| \_themeClass          | private | Returns the valid classes according to theme.                       |
| \_ctrlPropertyPadding | private | Returns style tag with padding property defined in control property |

### Methods

| Signature                                              | Scope        | Return Value | Description                             |
| ------------------------------------------------------ | ------------ | ------------ | --------------------------------------- |
| render()                                               | private      | template     | Overwrites native LWC render.           |
| initCompVariables()                                    | private      | void         | Overwrites inherited initCompVariables. |
| applyCtrlWidth()                                       | private      | void         | Overwrites inherited applyCtrlWidth.    |
| applyCallResp(json, bApi = false, bValidation = false) | api (public) | void         | Overwrites inherited applyCallResp.     |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-line-break
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
>
</c-omniscript-line-break>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

```json
Example ---

{
  "type": "Line Break",
  "rootIndex": 0,
  "response": null,
  "propSetMap": {
    "disOnTplt": false,
    "label": "LineBreak1",
    "HTMLTemplateId": "",
    "show": null,
    "padding": 0
  },
  "name": "LineBreak1",
  "level": 1,
  "JSONPath": "Step1:LineBreak1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bLineBreak": true,
  "lwcId": "lwc000"
}

```

**dataOmniKey** --- element unique identifier = name value in element's JSON definition

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
  "labelMap": {
    "LineBreak1": "Step1:LineBreak1",
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
    "LineBreak1": ""
  }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`
