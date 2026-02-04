# OmniScript Radio (omniscriptRadio)

This component is used to render a Radio element, This is extends from mixins class `OmniscriptOptionsMixin` and `OmniscriptAtomicElement`.

`OmniscriptOptionsMixin` mixin class is used for validating prefill data for radio.

We support the following format of Radio:

- horizontal view of radio
- vertical view of radio
- image view of radio with image count in a row
- image view of radio with fix width(without image count in a row)
- image view of radio with caption
- image view of radio without caption

### Properties

| Name             | Scope   | Description                                         |
| ---------------- | ------- | --------------------------------------------------- |
| \_isImageMode    | private | Hold an object from Helper method for mask handling |
| \_isVerticalMode | private | Checks whether value is committed or not            |
| \_isDisplayWide  | private | Checks whether mode is Display Wide or not          |
| \_horizontalMode | private | holds mode as 'horizontal'/'vertical'               |
| \_isImageDisplay | private | Checks whether image will display or not            |

### Methods

| Signature           | Scope   | Return Value | Description                  |
| ------------------- | ------- | ------------ | ---------------------------- |
| initCompVariables() | private | void         | Overwrite                    |
| handleChange(evt)   | private | void         | Change handler               |
| render()            | private | template     | Overwrites native LWC render |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-radio
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-radio>
```

### Usage

jsonDef\*\* -- json definition of the OmniScript Element

```json
Example ---

{
  "type": "Radio",
  "rootIndex": 0,
  "response": "Omniscript",
  "propSetMap": {
    "controlWidth": 12,
    "required": false,
    "repeat": false,
    "repeatClone": false,
    "repeatLimit": null,
    "readOnly": false,
    "horizontalMode": "image",
    "defaultValue": null,
    "help": false,
    "helpText": "",
    "options": [
      {
        "name": "Omniscript",
        "value": "Omniscript Team",
        "imgId": "../servlet/servlet.ImageServer?id=0151H000006K9XJQA0&&docName=VlocityCommunicationsLogo&&oid=00D1H000000Mk0NUAS"
      },
      {
        "name": "Cards",
        "value": "Cards Team",
        "imgId": "../servlet/servlet.ImageServer?id=0151H000006K9XRQA0&&docName=VlocityPublicSectorLogo&&oid=00D1H000000Mk0NUAS"
      },
      {
        "name": "Cpq",
        "value": "Cpq Team",
        "imgId": "../servlet/servlet.ImageServer?id=0151H000006K9XNQA0&&docName=VlocityLogo&&oid=00D1H000000Mk0NUAS"
      }
    ],
    "optionSource": { "type": "image", "source": "" },
    "controllingField": { "element": "", "type": "", "source": "" },
    "show": null,
    "conditionType": "Hide if False",
    "accessibleInFutureSteps": false,
    "HTMLTemplateId": "",
    "hide": false,
    "optionWidth": 100,
    "optionHeight": 100,
    "imageCountInRow": 3,
    "enableCaption": true,
    "disOnTplt": false,
    "label": "Radio1",
    "documentNames": [
      "VlocityCommunicationsLogo",
      "VlocityPublicSectorLogo",
      "VlocityLogo"
    ]
  },
  "name": "Radio1",
  "level": 1,
  "JSONPath": "Step1:Radio1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bRadio": true,
  "lwcId": "lwc000",
}
```

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---

{
  "labelMap": { "Radio1": "Step1:Radio1", "Step1": "Step1" },
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
  "acUiElements": { "Step1": "", "Radio1": "" }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + radio parameters + cached API responses
