# Omniscript Custom LWC (omniscriptCustomLwc)

This component is used to wrap a Custom LWC, It derives from omniscriptBaseComponent and implements hasValidation mixin.

### Methods

| Signature                                              | Scope        | Return Value | Description                                                                           |
| ------------------------------------------------------ | ------------ | ------------ | ------------------------------------------------------------------------------------- |
| applyCallResp(json, bApi = false, bValidation = false) | api (public) | void         | Overwrite to prevent default behavior                                                 |
| validityHook(newShow)                                  | private      | void         | Set masking attributes                                                                |
| handleValidation(evt)                                  | private      | void         | Event handler for validation events from custom LWC                                   |
| constructor()                                          | private      | void         | Initializes event handler listener                                                    |
| handleOmniAggregate                                    | private      | void         | Overwrite to handle data JSON aggregation when there is show/hide rule on Custom LWCs |

### HTML Markup

This component has a single template that supports both lightning and newport themes depending on the `layout`.

### Usage

```html
<c-omniscript-custom-lwc
  json-def="{jsonDef}"
  data-omni-key="{jsonDef.name}"
  json-data="{jsonData}"
  layout="{layout}"
  resume="{resume}"
  script-header-def="{scriptHeaderDef}"
  seed-json="{seedDataJSON}"
>
</c-omniscript-custom-lwc>
```

### Attributes

**jsonDef** -- json definition of the OmniScript Element

**jsonData** --- the data JSON of the OmniScript

**scriptHeaderDef** --- OmniScript header configuration

**layout** --- `newport` or `lightning`

**resume** --- `true` or `false`

**seedJson** --- designer seed JSON + text parameters + cached API responses
