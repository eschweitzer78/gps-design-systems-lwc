# OmniScript Step (omniscriptStep)

This is the LWC for OmniScript Step element.

### Properties

| Name                          | Scope           | Description                                                           |
| ----------------------------- | --------------- | --------------------------------------------------------------------- |
| \_savedKnowledgeOptions       | private         | Knowledge Options.                                                    |
| \_kbInitializedObj            | private         | Object with callback method(handleKnowledgeInitialized) for pubsub.   |
| \_kbArticleBodyInitializedObj | private         | Object with callback method(handleArticleBodyInitialized) for pubsub. |
| \_toggleArticleLabel          | private         | ARIA label for button to toggle inline article.                       |
| articleBodyResults            | track (private) | Article detailed info object.                                         |
| visible                       | track (private) | Whether article will display or not.                                  |

### Methods

| Signature                          | Scope   | Return Value | Description                                                                                                        |
| ---------------------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------------------------------ |
| renderedCallback()                 | private | Void         | Overwrite of native LWC renderedCallBack to show/hide of the Step                                                  |
| render()                           | private | Template     | Overwrite of native LWC render to support lightning or newport player                                              |
| stateRefresh()                     | private | Void         | Overwrites inherited stateRefresh. Gets called in combinedWatch.                                                   |
| handleKnowledgeInitialized()       | private | Void         | callback method for initializing Knowledge component with kbOptions and fire pubsub event to trigger changes in KB |
| knowledgeOptions()                 | private | Object       | Setting up knowledge otions from persistentComponent object.                                                       |
| knowledgeArticleOptions(article)   | private | Object       | Setting up knowledge article otions of an article.                                                                 |
| handleArticleBodyInitialized(data) | private | Void         | callback method for firing pubsub event to get article option.                                                     |
| closeArticle()                     | private | Void         | Hide article container from template and nullify articleBodyResults object.                                        |
| toggleArticle()                    | private | Void         | Toggle article container to expand/collapse.                                                                       |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-step
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  json-data-str="{jsonDataStr}"
  run-mode="{runMode}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-step>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

```json
Example ---

{
  "type": "Step",
  "propSetMap": {
    "disOnTplt": false,
    "errorMessage": { "default": null, "custom": [] },
    "allowSaveForLater": true,
    "label": "Step1",
    "chartLabel": null,
    "instructionKey": "",
    "HTMLTemplateId": "",
    "conditionType": "Hide if False",
    "show": null,
    "knowledgeOptions": {
      "typeFilter": "",
      "remoteTimeout": 30000,
      "dataCategoryCriteria": "",
      "keyword": "",
      "publishStatus": "Online",
      "language": "English"
    },
    "remoteOptions": {},
    "remoteTimeout": 30000,
    "remoteMethod": "",
    "remoteClass": "",
    "showPersistentComponent": [null, null],
    "instruction": "",
    "completeMessage": "Are you sure you want to complete the script?",
    "completeLabel": "Complete",
    "saveMessage": "Are you sure you want to save it for later?",
    "saveLabel": "Save for later",
    "cancelMessage": "Are you sure?",
    "cancelLabel": "Cancel",
    "nextWidth": 3,
    "nextLabel": "Next",
    "previousWidth": 3,
    "previousLabel": "Previous",
    "validationRequired": true,
    "uiElements": { "Step1": "", "Text1": "" }
  },
  "offSet": 0,
  "name": "Step1",
  "level": 0,
  "indexInParent": 0,
  "bHasAttachment": false,
  "bEmbed": false,
  "response": null,
  "inheritShowProp": null,
  "children": [
    {
      "response": null,
      "level": 1,
      "indexInParent": 0,
      "eleArray": [
        {
          "type": "Text",
          "rootIndex": 0,
          "response": null,
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
          "lwcId": "lwc000"
        }
      ],
      "bHasAttachment": false
    }
  ],
  "bAccordionOpen": true,
  "bAccordionActive": true,
  "bStep": true,
  "JSONPath": "Step1",
  "lwcId": "lwc0"
}

```

**dataOmniKey** --- element unique identifier = name value in element's JSON definition

**jsonData** --- the data JSON of the OmniScript

**jsonDataStr** --- stringified data JSON of the OmniScript

**runMode** --- flag to determine the location of where the OmniScript is run

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
  "labelMap": {
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
    "Step1": ""
  }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + url parameters + cached API responses
