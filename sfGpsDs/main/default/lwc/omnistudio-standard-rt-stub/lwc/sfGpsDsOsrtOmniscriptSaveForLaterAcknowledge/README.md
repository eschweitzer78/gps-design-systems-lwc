## ns/omniscriptSaveForLaterAcknowledge

This component is used to render Save For Later's acknowledge modal

- [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)
  - _instance_
    - [.\_result](#markdown-header-nsomniscriptsaveforlateracknowledge_result-object) : Object
    - [.\_bSflLabels](#markdown-header-nsomniscriptsaveforlateracknowledge_bsfllabels-object) : Object
    - [.result](#markdown-header-nsomniscriptsaveforlateracknowledgeresult)
    - [.layout](#markdown-header-nsomniscriptsaveforlateracknowledgelayout-string) : String
    - [.resumeLink](#markdown-header-nsomniscriptsaveforlateracknowledgeresumelink-string) : String
    - [.emailLink](#markdown-header-nsomniscriptsaveforlateracknowledgeemaillink-string) : String
    - [.hasResult](#markdown-header-nsomniscriptsaveforlateracknowledgehasresult-boolean) : Boolean
    - [.copyLinkToClipboard()](#markdown-header-nsomniscriptsaveforlateracknowledgecopylinktoclipboard)
  - _inner_
    - [~OmniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledgeomniscriptsaveforlateracknowledge-lightningelement) ⇐ LightningElement

### ns/omniscriptSaveForLaterAcknowledge.\_result : Object

Contains the results for the save for later acknowledge

**Kind**: instance property of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Scope**: private

### ns/omniscriptSaveForLaterAcknowledge.\_bSflLabels : Object

Contains all of the custom labels

**Kind**: instance property of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Scope**: private

### ns/omniscriptSaveForLaterAcknowledge.result

Sets the result for the save for later acknowledge

**Kind**: instance property of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Scope**: public (api)

### ns/omniscriptSaveForLaterAcknowledge.layout : String

Stores theme layout.

**Kind**: instance property of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Scope**: public (api)

### ns/omniscriptSaveForLaterAcknowledge.resumeLink : String

Stores resume link.

**Kind**: instance property of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Scope**: public (track)

### ns/omniscriptSaveForLaterAcknowledge.emailLink : String

Stores email link.

**Kind**: instance property of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Scope**: public (track)

### ns/omniscriptSaveForLaterAcknowledge.hasResult : Boolean

Flag to determine if there is a result for the save for later acknowledge

**Kind**: instance property of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Scope**: public (track)

### ns/omniscriptSaveForLaterAcknowledge.copyLinkToClipboard()

Copies resume link to clipboard via temporary textarea.

**Kind**: instance method of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)

### ns/omniscriptSaveForLaterAcknowledge~OmniscriptSaveForLaterAcknowledge ⇐ LightningElement

**Kind**: inner class of [ns/omniscriptSaveForLaterAcknowledge](#markdown-header-nsomniscriptsaveforlateracknowledge)  
**Extends**: LightningElement
