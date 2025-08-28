## c/omniscriptCancelAction ⇐ OmniscriptNavigateAction

Element that extends the OmniscriptNavigateAction and performs navigation away
from the omniscript. In the designer a cancel action is defined by adding a `Navigate Action` element
to the root level of the script, and giving it the name 'CANCEL'.

**Extends**: OmniscriptNavigateAction

- [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction) ⇐ OmniscriptNavigateAction
  - _instance_
    - [.CANCEL_RESOLVED](#markdown-header-omniscriptcancelactioncancel_resolved-string) : string
    - [.DEFAULT_CANCEL_RESOLVED](#markdown-header-omniscriptcancelactiondefault_cancel_resolved-string) : string
    - [.CANCEL_ABORTED](#markdown-header-omniscriptcancelactioncancel_aborted-string) : string
    - [.CANCEL_DISABLED](#markdown-header-omniscriptcancelactioncancel_disabled-string) : string
    - [.cancel()](#markdown-header-omniscriptcancelactioncancel-promiseany) ⇒ Promise.<any>
    - [.execute()](#markdown-header-omniscriptcancelactionexecute)
  - _static_
    - [.cancelPrompt(comp, [message], [header])](#markdown-header-omniscriptcancelactioncancelpromptcomp-message-header-promiseany) ⇒ Promise.<any>

### omniscriptCancelAction.CANCEL_RESOLVED : string

Constant value returned when cancel succeeds.

**Kind**: instance property of [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction)  
**Scope**: static

### omniscriptCancelAction.DEFAULT_CANCEL_RESOLVED : string

Constant value returned when cancel default (inline) succeeds.

**Kind**: instance property of [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction)  
**Scope**: static

### omniscriptCancelAction.CANCEL_ABORTED : string

Constant value thrown when cancel is aborted.

**Kind**: instance property of [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction)  
**Scope**: static

### omniscriptCancelAction.CANCEL_DISABLED : string

Constant value thrown when cancel is disabled.

**Kind**: instance property of [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction)  
**Scope**: static

### omniscriptCancelAction.cancel() ⇒ Promise.<any>

Execute the configured navigate action. Fired by omniscriptHeader.

**Kind**: instance method of [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction)  
**Scope**: api (public)

### omniscriptCancelAction.execute()

Override default execute so the cancel action isn't immediately fired.

**Kind**: instance method of [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction)  
**Scope**: api (public)

### OmniscriptCancelAction.cancelPrompt(comp, [message], [header]) ⇒ Promise.<any>

Show the cancel modal confirm

**Kind**: static method of [c/omniscriptCancelAction](#markdown-header-comniscriptcancelaction-omniscriptnavigateaction)  
**Scope**: static

| Param     | Type             | Description                                                                                                                                                                             |
| --------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| comp      | LightningElement | Component used to fire the omni modal event. Should be a omniscript-cancel-action, or navigate-action. Must be a child of the omni header in order for the header to recieve the event. |
| [message] | string           | Message to display in the modal confirm.                                                                                                                                                |
| [header]  | string           | Title of the modal confirm.                                                                                                                                                             |
