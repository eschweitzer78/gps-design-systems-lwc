## trackedCommonTypeToJsonDefMap ⇒ Object

JSON Definition mergefield mappings in accordance with the element's type that are common amongst all
OmniScript elements.

**Kind**: global constant

## trackedTypeToJsonDefMap ⇒ Object

JSON Definition mergefield mappings in accordance with the element's type. Each map should start from
the trackedCommonTypeToJsonDefMap unless there is a specific reason why the common mergefield map values
are not needed.

**Kind**: global constant  
**Returns**: Object - Returns an object with a nested value that contains the mergefield syntax

## trackedScriptHeaderMap : Object

Script Header mergefield mappings.

**Kind**: global constant

## trackedDataJsonMap : Object

Data JSON mergefield mappings.

**Kind**: global constant

## trackedStaticMap : Object

Static Property mergefield mappings.

**Kind**: global constant

## getCommonTrackingData(comp, element, scriptHeaderDef, jsonData, additionalData) ⇒ Object

Gets common tracking data for the Messaging Framework and Time Tracking Services.

**Kind**: global function

| Param           | Type   |
| --------------- | ------ |
| comp            | \*     |
| element         | Object |
| scriptHeaderDef | Object |
| jsonData        | Object |
| additionalData  | Object |

### getCommonTrackingData~targetJsonDef

This method is used for all events whether the event is fired from the OmniScript Header or from an OmniScript
element.

- When fired from an OmniScript element, the element argument will be populated and will be used as the
  targetJsonDef.
- When fired from the OmniScript Header, the element will be null/undefined and the targetJsonDef will be the
  component's jsonDef (root jsonDef).

**Kind**: inner constant of getCommonTrackingData

## evaluateMessaging(propSetMap, [oaEnabled]) ⇒ Boolean

Evaluates if messaging is permitted.

**Kind**: global function

| Param       | Type   |
| ----------- | ------ |
| propSetMap  | Object |
| [oaEnabled] | Object |
