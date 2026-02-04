# OmniScript Multiselect (omniscriptMultiselect)

This component is used to render a multiselect element, This is extends from mixins class `OmniscriptOptionsMixin`, `OmniscriptAtomicElement`.

`OmniscriptOptionsMixin` mixin class is used for validating prefil data for multiselect options.

We support the following format of Multiselect:

- horizontal view of multiselect
- vertical view of multiselect
- image view of multiselect with image count in a row
- image view of multiselect with fix width(without image count in a row)
- image view of multiselect with caption
- image view of multiselect without caption

### Properties

| Name             | Scope   | Description                                   |
| ---------------- | ------- | --------------------------------------------- |
| \_isImage        | private | Checks whether horizontalMode is image or not |
| \_isImageDisplay | private | checks whether image needs to display or not  |

### Methods

| Signature                     | Scope   | Return Value | Description                                |
| ----------------------------- | ------- | ------------ | ------------------------------------------ |
| initCompVariables()           | private | void         | Overwrite                                  |
| handleChange(evt)             | private | void         | Change handle                              |
| checkOptions(options, data)   | private | Object       | Overwrite                                  |
| updatePropOptions(newOptions) | private | void         | Update options                             |
| seedOptions()                 | private | Boolean      | Determines if seed data is to be returned. |
| render()                      | private | template     | Overwrites native LWC render               |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-multiselect
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-multiselect>
```

### Attributes

**jsonDef** -- json definition of the OmniScript Element

```json
Example ---
{
  "type": "Multi-select",
  "rootIndex": 0,
  "response": "omniscript",
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
        "imgId": "../servlet/servlet.ImageServer?id=0151U000001dB1GQAU&&docName=VlocityLogo&&oid=00D1U0000010hNLUAY",
        "value": "Omniscript Team",
        "name": "omniscript"
      },
      {
        "imgId": "../servlet/servlet.ImageServer?id=0151U000001dB1IQAU&&docName=VlocityLogoIns&&oid=00D1U0000010hNLUAY",
        "value": "Oards Team",
        "name": "cards"
      },
      {
        "imgId": "../servlet/servlet.ImageServer?id=0151U000001dB1JQAU&&docName=VlocityLogoTagline&&oid=00D1U0000010hNLUAY",
        "value": "Cpq Team",
        "name": "cpq"
      }
    ],
    "optionSource": { "source": "", "type": "image" },
    "controllingField": { "source": "", "type": "", "element": "" },
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
    "label": "Multi-select1",
    "documentNames": ["VlocityLogo", "VlocityLogoIns", "VlocityLogoTagline"]
  },
  "name": "Multi-select1",
  "level": 1,
  "JSONPath": "Step1:Multi-select1",
  "indexInParent": 0,
  "index": 0,
  "children": [],
  "bHasAttachment": false,
  "bMultiselect": true,
  "lwcId": "lwc000",
  "bInit": true
}
```

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

```json
Example ---
{
  "labelMap": { "Multi-select1": "Step1:Multi-select1", "Step1": "Step1" },
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
  "acUiElements": { "Step1": "", "Multi-select1": "" }
}
```

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + multiselect parameters + cached API responses
