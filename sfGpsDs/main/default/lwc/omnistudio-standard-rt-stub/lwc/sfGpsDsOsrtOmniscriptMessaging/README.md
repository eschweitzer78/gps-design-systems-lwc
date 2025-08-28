## ns/omniscriptMessaging ⇐ OmniscriptAtomicElement

**Extends**: OmniscriptAtomicElement

- [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement) ⇐ OmniscriptAtomicElement
  - [.messageText](#markdown-header-omniscriptmessagingmessagetext-string) : String
  - [.messageType](#markdown-header-omniscriptmessagingmessagetype-string) : String
  - [.initCompVariables()](#markdown-header-omniscriptmessaginginitcompvariables-void) ⇒ void
  - [.evaluateValidity()](#markdown-header-omniscriptmessagingevaluatevalidity-boolean) ⇒ Boolean
  - [.removeTabIndex(event)](#markdown-header-omniscriptmessagingremovetabindexevent-void) ⇒ void
  - [.checkValidity()](#markdown-header-omniscriptmessagingcheckvalidity-boolean) ⇒ Boolean
  - [.reportValidity()](#markdown-header-omniscriptmessagingreportvalidity-boolean) ⇒ Boolean
  - [.focus()](#markdown-header-omniscriptmessagingfocus-void) ⇒ void
  - [.getMessageJson()](#markdown-header-omniscriptmessaginggetmessagejson-object) ⇒ Object
  - [.stateRefresh()](#markdown-header-omniscriptmessagingstaterefresh-void) ⇒ void
  - [.render()](#markdown-header-omniscriptmessagingrender-void) ⇒ void
  - [.renderedCallback()](#markdown-header-omniscriptmessagingrenderedcallback-void) ⇒ void

### omniscriptMessaging.messageText : String

Data store for text of message.

**Kind**: instance property of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: track (private)

### omniscriptMessaging.messageType : String

Data store for type of message.

**Kind**: instance property of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: track (private)

### omniscriptMessaging.initCompVariables() ⇒ void

Overwrites inherited initCompVariables. This method is executed once during connectedCallback.

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: private

### omniscriptMessaging.evaluateValidity() ⇒ Boolean

Special function to determine if component is valid.

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: private

### omniscriptMessaging.removeTabIndex(event) ⇒ void

removes the tabindex element from the event target

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: private

| Param | Type  | Description           |
| ----- | ----- | --------------------- |
| event | Event | the spawning element. |

### omniscriptMessaging.checkValidity() ⇒ Boolean

checkValidity should return a Boolean value true, if the input is valid, false if invalid.

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: public

### omniscriptMessaging.reportValidity() ⇒ Boolean

reportValidity should return the value of checkValidity, and trigger the display of any
validation messages as well.

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: public

### omniscriptMessaging.focus() ⇒ void

focuses the input. Overrides from htmlElement. Focuses if from requirement, but only temporarily.

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: public

### omniscriptMessaging.getMessageJson() ⇒ Object

Gets the current messaging information and returns it as an object that stores the type and text (value).

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)

### omniscriptMessaging.stateRefresh() ⇒ void

Overwrites inherited method that gets triggered when data json changes.

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: private

### omniscriptMessaging.render() ⇒ void

Overwrites native LWC render

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: private

### omniscriptMessaging.renderedCallback() ⇒ void

Overwrites native LWC renderedCallback

**Kind**: instance method of [ns/omniscriptMessaging](#markdown-header-nsomniscriptmessaging-omniscriptatomicelement)  
**Scope**: private
