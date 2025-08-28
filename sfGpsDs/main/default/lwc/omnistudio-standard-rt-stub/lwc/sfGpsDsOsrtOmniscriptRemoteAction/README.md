# Omniscript Remote Action (omniscriptRemoteAction)

The Omniscript Remote Action component provides functionality for invoking Apex classes. This README will provide high-level information regarding the different properties and methods utilized by the Omniscript Remote Action LWC component.

### Methods

The following are a list of methods that are declared inside of the Omniscript Remote Action. Remote Action is inherited from Omniscript Base Action for additional support regarding action invocation and processing. Reference the Omniscript Base Action README for additional information regarding the inherited class.

| Signature         | Scope   | Return Value | Description                                                                                                 |
| ----------------- | ------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| connectedCallback | private | Void         | Overwrites inherited connectedCallback. Instantiates Remote Action Utility Class from the Action Framework. |

### HTML Markup

HTML markup is inherited from the Omniscript Base Action. The templates support both lightning and newport themes.

### Usage

```html
<c-omniscript-remote-action
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  json-data-str="{jsonDataStr}"
  layout="{layout}"
  run-mode="{runMode}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
>
</c-omniscript-remote-action>
```

### Attributes

**jsonDef** --- JSON definition of the OmniScript Element

```json
Example ---

{
  "type": "Remote Action",
  "rootIndex": 0,
  "response": null,
  "propSetMap": {
    "disOnTplt": false,
    "enableDefaultAbort": false,
    "errorMessage": { "default": null, "custom": [] },
    "label": "RemoteAction1",
    "svgIcon": "",
    "svgSprite": "",
    "pubsub": false,
    "message": {},
    "ssm": false,
    "wpm": false,
    "HTMLTemplateId": "",
    "show": null,
    "showPersistentComponent": [null, null],
    "redirectPreviousWidth": 3,
    "redirectPreviousLabel": "Previous",
    "redirectNextWidth": 3,
    "redirectNextLabel": "Next",
    "redirectTemplateUrl": "vlcAcknowledge.html",
    "redirectPageName": "",
    "validationRequired": "Step",
    "failureAbortMessage": "Are you sure?",
    "failureGoBackLabel": "Go Back",
    "failureAbortLabel": "Abort",
    "failureNextLabel": "Continue",
    "postMessage": "Done",
    "inProgressMessage": "In Progress",
    "extraPayload": {},
    "responseJSONNode": "",
    "responseJSONPath": "",
    "sendJSONNode": "",
    "sendJSONPath": "",
    "postTransformBundle": "",
    "preTransformBundle": "",
    "remoteTimeout": 30000,
    "remoteOptions": {
      "postTransformBundle": "",
      "preTransformBundle": ""
    },
    "remoteMethod": "SampleMethod",
    "remoteClass": "SampleClass",
    "controlWidth": 12
  },
  "name": "RemoteAction1",
  "level": 1,
  "JSONPath": "Step1:RemoteAction1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bRemoteAction": true,
  "lwcId": "lwc000"
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
    "RemoteAction1": "Step1:RemoteAction1",
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
    "RemoteAction1": ""
  }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`
