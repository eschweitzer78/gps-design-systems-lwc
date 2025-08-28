## determineMaxGranularity(format) ⇒ number

Determines highest granularity for dayJS formatting string.

**Kind**: global function  
**Returns**: number - - granularity, corresponds with index on units, if fornat is not a string
the highest granularity value of 8 will be returned;  
**Access**: public

| Param  | Type   | Description                             |
| ------ | ------ | --------------------------------------- |
| format | string | dayJS formatting string to be processed |

## resolveUnitGranularity(key) ⇒ number

Determines highest granularity for unit substring of dayJS formatting string.

**Kind**: global function  
**Returns**: number - - granularity, corresponds with index on units  
**Access**: public

| Param | Type   | Description                            |
| ----- | ------ | -------------------------------------- |
| key   | string | dayJS format substring to be processed |

## unitName(granularity) ⇒ string

Determines highest granularity for unit substring of dayJS formatting string.

**Kind**: global function  
**Returns**: string - - pretty name of unit for granularity index provided  
**Access**: public

| Param       | Type | Description                                                                               |
| ----------- | ---- | ----------------------------------------------------------------------------------------- |
| granularity | int  | granularity as an index as returned by determineMaxGranularity and resolveUnitGranularity |
