## ns/omniscriptTypeaheadBlock ⇐ OmniscriptBlock

The typeahead block is a wrapper element which contains the typeahead element, and any other children inputs.

**Extends**: OmniscriptBlock

- [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock) ⇐ OmniscriptBlock
  - [.\_typeaheadElement](#markdown-header-omniscripttypeaheadblock_typeaheadelement-lightningelement) : LightningElement
  - [.handleSelect(evt)](#markdown-header-omniscripttypeaheadblockhandleselectevt-void) ⇒ void
  - [.enterEditMode()](#markdown-header-omniscripttypeaheadblockentereditmode-void) ⇒ void
  - [.hideValidation(evt)](#markdown-header-omniscripttypeaheadblockhidevalidationevt-void) ⇒ void
  - [.initCompVariables()](#markdown-header-omniscripttypeaheadblockinitcompvariables-void) ⇒ void
  - [.applyCtrlWidth()](#markdown-header-omniscripttypeaheadblockapplyctrlwidth-void) ⇒ void
  - [.reportValidity()](#markdown-header-omniscripttypeaheadblockreportvalidity-boolean) ⇒ boolean
  - [.nullifyChildren(type)](#markdown-header-omniscripttypeaheadblocknullifychildrentype-void) ⇒ void

### omniscriptTypeaheadBlock.\_typeaheadElement : LightningElement

A cached reference to the underlying omniscriptTypeahead/omniscriptPlacesTypeahead.

**Kind**: instance property of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: private

### omniscriptTypeaheadBlock.handleSelect(evt) ⇒ void

Event handler bound via template.

**Kind**: instance method of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: private

| Param           | Type        | Description                   |
| --------------- | ----------- | ----------------------------- |
| evt             | CustomEvent |                               |
| evt.detail      | Object      |                               |
| evt.detail.item | Object      | The object that was selected. |

### omniscriptTypeaheadBlock.enterEditMode() ⇒ void

Calls toggleEditMode(true), on the child omniscriptTypeahead/omnscriptPlacesTypeahead, and clears
block level validation messages.

**Kind**: instance method of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: private

### omniscriptTypeaheadBlock.hideValidation(evt) ⇒ void

Hides block level validation messages.

**Kind**: instance method of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: private

| Param | Type        |
| ----- | ----------- |
| evt   | CustomEvent |

### omniscriptTypeaheadBlock.initCompVariables() ⇒ void

Override for the base lifecycle method `initCompvariables`. Binds event listeners for 'select' and 'hidevalidation' events.

**Kind**: instance method of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: private

### omniscriptTypeaheadBlock.applyCtrlWidth() ⇒ void

Override for base implementation. Prevents display issues.

**Kind**: instance method of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: private

### omniscriptTypeaheadBlock.reportValidity() ⇒ boolean

Shows block level validation messaging when hidden child elements are invalid.
Messaging is hidden when the typeahead element itself or the typeahead is already in edit mode.

**Kind**: instance method of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: api (public)

### omniscriptTypeaheadBlock.nullifyChildren(type) ⇒ void

Clears the values of any child inputs. Triggered from the `OmniscriptTypeaheadBlock.handleSelect`.

**Kind**: instance method of [ns/omniscriptTypeaheadBlock](#markdown-header-nsomniscripttypeaheadblock-omniscriptblock)  
**Scope**: private

| Param | Type   |
| ----- | ------ |
| type  | string |
