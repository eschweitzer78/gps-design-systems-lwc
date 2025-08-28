## ns/omniscriptActionBlock ⇐ OmniscriptBaseAction

**Extends**: OmniscriptBaseAction

- [ns/omniscriptActionBlock](#markdown-header-nsomniscriptactionblock-omniscriptbaseaction) ⇐ OmniscriptBaseAction
  - [.processAction(element)](#markdown-header-omniscriptactionblockprocessactionelement-promise) ⇒ Promise
  - [.handleResponseError(resp, element)](#markdown-header-omniscriptactionblockhandleresponseerrorresp-element-objectvoid) ⇒ Object ⎮ Void
  - [.handleError(element, error)](#markdown-header-omniscriptactionblockhandleerrorelement-error-promise) ⇒ Promise
  - [.sendDataToDebugConsole(params, resp, label, [element])](#markdown-header-omniscriptactionblocksenddatatodebugconsoleparams-resp-label-element-void) ⇒ void

### omniscriptActionBlock.processAction(element) ⇒ Promise

Overwrites inherited processAction. Handles asynchronous processing for the Action Block. Requests
are independent of each other.

**Kind**: instance method of [ns/omniscriptActionBlock](#markdown-header-nsomniscriptactionblock-omniscriptbaseaction)  
**Scope**: private

| Param   | Type   |
| ------- | ------ |
| element | Object |

### omniscriptActionBlock.handleResponseError(resp, element) ⇒ Object ⎮ Void

Overwrites inherited handleResponseError. Determines if Action Block is to apply successful
responses despite having errored responses present.

**Kind**: instance method of [ns/omniscriptActionBlock](#markdown-header-nsomniscriptactionblock-omniscriptbaseaction)  
**Scope**: private

| Param   | Type   |
| ------- | ------ |
| resp    | Object |
| element | Object |

### omniscriptActionBlock.handleError(element, error) ⇒ Promise

Handles common errors present in the Action Block.

**Kind**: instance method of [ns/omniscriptActionBlock](#markdown-header-nsomniscriptactionblock-omniscriptbaseaction)  
**Scope**: private

| Param   | Type   |
| ------- | ------ |
| element | Object |
| error   | Object |

### omniscriptActionBlock.sendDataToDebugConsole(params, resp, label, [element]) ⇒ void

Overwrites inherited sendDataToDebugConsole. Sends data to the Debug Console event handler.

**Kind**: instance method of [ns/omniscriptActionBlock](#markdown-header-nsomniscriptactionblock-omniscriptbaseaction)  
**Scope**: private

| Param     | Type   |
| --------- | ------ |
| params    | Object |
| resp      | Object |
| label     | String |
| [element] | Object |
